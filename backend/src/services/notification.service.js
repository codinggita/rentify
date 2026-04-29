/**
 * Notification Service
 * Centralised helpers for sending real-time events via Socket.io rooms.
 * All four functions stamp a timestamp on the payload automatically.
 */

/**
 * Emit an event to a single user's private room.
 * @param {import('socket.io').Server} io
 * @param {string|import('mongoose').Types.ObjectId} userId
 * @param {string} event
 * @param {object} payload
 */
const notifyUser = (io, userId, event, payload) => {
  io.to(`user:${userId.toString()}`).emit(event, {
    ...payload,
    timestamp: new Date().toISOString(),
  });
  console.log(`[Socket][notifyUser] ${event} → user:${userId}`);
};

/**
 * Emit an event to the ADMIN role room.
 * @param {import('socket.io').Server} io
 * @param {string} event
 * @param {object} payload
 */
const notifyAdmin = (io, event, payload) => {
  io.to('role:ADMIN').emit(event, {
    ...payload,
    timestamp: new Date().toISOString(),
  });
  // Also emit to legacy 'admin' room for backward-compat
  io.to('admin').emit(event, {
    ...payload,
    timestamp: new Date().toISOString(),
  });
  console.log(`[Socket][notifyAdmin] ${event} → role:ADMIN`);
};

/**
 * Emit an event to an arbitrary role room.
 * @param {import('socket.io').Server} io
 * @param {string} role  e.g. 'OWNER', 'RENTER', 'INSPECTOR', 'SERVICE'
 * @param {string} event
 * @param {object} payload
 */
const notifyRole = (io, role, event, payload) => {
  io.to(`role:${role}`).emit(event, {
    ...payload,
    timestamp: new Date().toISOString(),
  });
  console.log(`[Socket][notifyRole] ${event} → role:${role}`);
};

/**
 * Emit an event to multiple users.
 * @param {import('socket.io').Server} io
 * @param {Array<string|import('mongoose').Types.ObjectId>} userIds
 * @param {string} event
 * @param {object} payload
 */
const notifyMultiple = (io, userIds = [], event, payload) => {
  userIds.forEach((uid) => notifyUser(io, uid, event, payload));
};

module.exports = { notifyUser, notifyAdmin, notifyRole, notifyMultiple };
