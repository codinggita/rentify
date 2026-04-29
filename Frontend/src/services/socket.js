/**
 * Socket.io Client Singleton
 * Always import from this file — never create a second socket instance.
 */
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5001';

let socket = null;

/** Returns the current socket instance (may be null if not yet connected). */
export const getSocket = () => socket;

/**
 * Creates and connects the socket with JWT auth.
 * If a connected socket already exists, returns it immediately (singleton).
 * @param {string} token  JWT access token from Redux auth state
 */
export const connectSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(BASE_URL, {
    auth: { token },
    autoConnect: false,
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.connect();

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);
  });
  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message);
  });
  socket.on('disconnect', (reason) => {
    console.warn('[Socket] Disconnected:', reason);
  });

  return socket;
};

/**
 * Legacy helper — joins user and role rooms.
 * Kept for backward-compat; new code should rely on server-side auto-join.
 * @param {string} userId
 * @param {string} role
 */
export const joinUserRoom = (userId, role) => {
  const s = getSocket();
  if (userId && s?.connected) s.emit('join', { userId, role });
};

/** Disconnects and clears the singleton. */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('[Socket] Manually disconnected');
  }
};

export default getSocket;
