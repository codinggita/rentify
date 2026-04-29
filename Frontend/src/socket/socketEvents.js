/**
 * Socket Event Constants
 * Single source of truth — import from here, never use raw strings.
 *
 * Usage:
 *   import { SOCKET_EVENTS } from '../socket/socketEvents'
 *   useSocket([{ event: SOCKET_EVENTS.NEW_LISTING_REQUEST, handler: fn }])
 */
export const SOCKET_EVENTS = {
  // ── Client → Server ──────────────────────────────────────────────────────────
  JOIN_ROOM             : 'join_room',
  INSPECTOR_LOCATION    : 'inspector_location',

  // ── Server → Client: Listing / Inspection workflow ───────────────────────────
  NEW_LISTING_REQUEST   : 'new_listing_request',
  INSPECTOR_ASSIGNED    : 'inspector_assigned',
  LISTING_STATUS_UPDATE : 'listing_status_update',

  // ── Server → Client: Service / Maintenance request workflow ──────────────────
  NEW_SERVICE_REQUEST       : 'new_service_request',
  SERVICE_PROVIDER_ASSIGNED : 'service_provider_assigned',
  SERVICE_REQUEST_UPDATE    : 'service_request_update',

  // ── Generic ───────────────────────────────────────────────────────────────────
  NOTIFICATION          : 'notification',

  // ── Legacy (kept for backward-compat with older dashboard listeners) ──────────
  REQUEST_UPDATE        : 'request_update',
  NEW_TASK              : 'new_task',
  ADMIN_NOTIFICATION    : 'admin_notification',
};
