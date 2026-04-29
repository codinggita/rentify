/**
 * useSocket — React hook for subscribing to Socket.io events.
 *
 * Usage:
 *   const { socket, connected } = useSocket([
 *     { event: SOCKET_EVENTS.NEW_LISTING_REQUEST, handler: myHandler },
 *   ])
 *
 * Rules:
 *  - Connects automatically once a JWT token is present in Redux.
 *  - Cleans up all listeners on unmount to prevent memory leaks.
 *  - Uses the singleton socket from services/socket.js — never opens a second connection.
 */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { connectSocket, getSocket } from '../services/socket';

/**
 * @param {Array<{event: string, handler: function}>} events
 */
const useSocket = (events = []) => {
  // Q5 confirmed: token lives at state.auth.token
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    events.forEach(({ event, handler }) => {
      socket.on(event, handler);
    });

    return () => {
      events.forEach(({ event, handler }) => {
        socket.off(event, handler);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return {
    socket: getSocket(),
    connected: getSocket()?.connected ?? false,
  };
};

export default useSocket;
