import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: [],
  items: [],   // alias used by service-request socket reducers
  filter: 'All', // 'All' | 'Pending' | 'In Progress' | 'Completed'
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    addTicket: (state, action) => {
      state.tickets.unshift(action.payload);
    },
    updateTicket: (state, action) => {
      const idx = state.tickets.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.tickets[idx] = { ...state.tickets[idx], ...action.payload };
    },
    removeTicket: (state, action) => {
      state.tickets = state.tickets.filter(t => t.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    // ── Socket-driven reducers ───────────────────────────────────────────────
    prependServiceRequest: (state, action) => {
      state.items.unshift(action.payload);
      state.tickets.unshift(action.payload); // keep tickets in sync
    },
    updateServiceRequestStatus: (state, action) => {
      const { requestId, status, note, updatedAt } = action.payload;
      const updateArr = (arr) => {
        const item = arr.find(
          (i) => i._id === requestId || i.requestId === requestId
        );
        if (item) {
          item.status = status;
          if (note) item.latestNote = note;
          item.updatedAt = updatedAt;
        }
      };
      updateArr(state.items);
      updateArr(state.tickets);
    },
    prependJob: (state, action) => {
      state.items.unshift(action.payload);
      state.tickets.unshift(action.payload);
    },
  },
});

export const {
  setTickets, addTicket, updateTicket, removeTicket, setFilter,
  prependServiceRequest, updateServiceRequestStatus, prependJob,
} = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
