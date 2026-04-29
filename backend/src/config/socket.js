const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io = null;

/**
 * Initialise Socket.io on the given http.Server.
 * Call once from server.js after the httpServer is created.
 * @param {import('http').Server} httpServer
 * @param {object} corsOptions   – same cors options used by Express
 * @returns {import('socket.io').Server}
 */
const initSocket = (httpServer, corsOptions) => {
  io = new Server(httpServer, { cors: corsOptions });

  // ── AUTH MIDDLEWARE ─────────────────────────────────────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized: no token'));
    try {
      const SECRET = process.env.JWT_SECRET || 'rentify_dev_secret';
      const decoded = jwt.verify(token, SECRET);
      socket.user = decoded; // { id, role, email }
      next();
    } catch (err) {
      next(new Error('Unauthorized: invalid token'));
    }
  });

  // ── CONNECTION HANDLER ──────────────────────────────────────────────────────
  io.on('connection', async (socket) => {
    const { id, role } = socket.user;
    console.log(`[Socket] Connected: ${socket.id} | user:${id} | role:${role}`);

    // Join private room and role room
    socket.join(`user:${id}`);
    socket.join(`role:${role}`);

    // Also keep legacy room names for backward-compat with existing controllers
    socket.join(String(id));
    if (role === 'ADMIN' || role === 'admin') socket.join('admin');

    // Persist socketId to DB (non-blocking)
    User.findByIdAndUpdate(id, { socketId: socket.id }).catch(() => {});

    // ── Inspector GPS streaming (debounced — max 1 DB write per 30 s) ─────────
    let lastLocationWrite = 0;
    socket.on('inspector_location', async ({ lat, lng }) => {
      const now = Date.now();
      if (now - lastLocationWrite < 30_000) return;
      lastLocationWrite = now;
      try {
        await User.findByIdAndUpdate(id, {
          'location.lat': lat,
          'location.lng': lng,
        });
      } catch (err) {
        console.error('[Socket] GPS write error:', err.message);
      }
    });

    // ── Cleanup on disconnect ──────────────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id} | user:${id}`);
      User.findByIdAndUpdate(id, { socketId: null }).catch(() => {});
    });
  });

  return io;
};

/**
 * Returns the singleton io instance.
 * Always call initSocket() first (in server.js) before using this.
 */
const getIO = () => io;

module.exports = { initSocket, getIO };
