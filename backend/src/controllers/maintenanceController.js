const MaintenanceTicket = require('../models/MaintenanceTicket');
const { getIO } = require('../config/socket');
const { notifyUser, notifyAdmin } = require('../services/notification.service');

/**
 * Maintenance Controller
 * Handles maintenance requests from tenants and approvals from owners.
 */
const maintenanceController = {
  /**
   * Get all tickets (filtered by role)
   */
  getTickets: async (req, res) => {
    try {
      let query = {};
      
      // Filter based on user role
      if (req.user.role === 'RENTER') {
        query.renter = req.user.id;
      } else if (req.user.role === 'OWNER') {
        // Find properties owned by this user first, then tickets for those properties
        // For simplicity, we'll assume the ticket has a propertyId and we can filter
        // In a real app, you'd populate or use a more complex query
        query.owner = req.user.id; 
      } else if (req.user.role === 'SERVICE' || req.user.role === 'SERVICE_PROVIDER') {
        query.assignedTo = req.user.id;
      } else if (req.user.role === 'ADMIN') {
        // Admin sees all tickets
        query = {};
      }

      const tickets = await MaintenanceTicket.find(query)
        .populate('property', 'title address')
        .populate('renter', 'name email firstName lastName')
        .populate('assignedTo', 'name phone');
        
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Create a new maintenance ticket
   */
  createTicket: async (req, res) => {
    try {
      const User = require('../models/User');
      let userId = req.user?.id;
      
      if (!userId) {
        const defaultUser = await User.findOne();
        userId = defaultUser ? defaultUser._id : null;
      }

      const newTicket = new MaintenanceTicket({
        ...req.body,
        renter: userId,
        status: (req.body.status || 'OPEN').toUpperCase(),
        priority: (req.body.priority || 'MEDIUM').toUpperCase()
      });
      const savedTicket = await newTicket.save();
      const populatedTicket = await MaintenanceTicket.findById(savedTicket._id)
        .populate('property', 'title')
        .populate('renter', 'firstName lastName name');

      // ── Real-time notification via Socket.io (room-based) ────────
      try {
        const io = getIO() || req.app.get('io');
        if (io) {
          const userName = populatedTicket.renter?.name ||
                          (populatedTicket.renter?.firstName ? `${populatedTicket.renter.firstName} ${populatedTicket.renter.lastName}` : 'A User');

          const payload = {
            requestId: savedTicket._id,
            ticketId: savedTicket._id,
            title: req.body.title || `${req.body.category}: ${req.body.type}`,
            userName,
            requesterName: userName,
            requesterRole: req.user.role,
            category: req.body.category || 'Maintenance',
            priority: savedTicket.priority,
            propertyTitle: populatedTicket.property?.title || 'Property',
            description: req.body.description || '',
            submittedAt: savedTicket.createdAt,
          };

          // Notify admins (targeted room, not broadcast)
          notifyAdmin(io, 'new_service_request', payload);

          // Notify specific assigned provider (if set)
          if (savedTicket.assignedTo) {
            notifyUser(io, savedTicket.assignedTo, 'service_provider_assigned', {
              ...payload,
              assignedAt: new Date(),
            });
          }
        }
      } catch (socketErr) {
        console.error('[Socket] Emit error:', socketErr.message);
      }
      // ────────────────────────────────────────────────────────

      res.status(201).json(savedTicket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Update ticket status
   */
  updateTicketStatus: async (req, res) => {
    try {
      const { status, assignedTo } = req.body;
      const ticket = await MaintenanceTicket.findById(req.params.id);
      
      if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

      // Logic for who can update what
      if (status) ticket.status = status;
      if (assignedTo) ticket.assignedTo = assignedTo;

      const updatedTicket = await ticket.save();
      const populatedTicket = await MaintenanceTicket.findById(updatedTicket._id)
        .populate('property')
        .populate('renter')
        .populate('assignedTo');

      // ── Notify Involved Parties (room-based) ────────────────
      try {
        const io = getIO() || req.app.get('io');
        if (io) {
          const updatePayload = {
            requestId: updatedTicket._id,
            ticketId: updatedTicket._id,
            status: updatedTicket.status,
            updatedAt: new Date(),
          };

          // Notify Renter
          if (populatedTicket.renter) {
            notifyUser(io, populatedTicket.renter._id || populatedTicket.renter, 'service_request_update', updatePayload);
          }

          // Notify Owner (if property has owner)
          if (populatedTicket.property?.owner) {
            notifyUser(io, populatedTicket.property.owner, 'service_request_update', updatePayload);
          }

          // Notify Provider if newly assigned
          if (assignedTo) {
            notifyUser(io, assignedTo, 'service_provider_assigned', {
              requestId: updatedTicket._id,
              propertyTitle: populatedTicket.property?.title ?? '',
              category: updatedTicket.category ?? '',
              priority: updatedTicket.priority ?? '',
              assignedAt: new Date(),
            });
          }

          // Notify Admins of any update
          notifyAdmin(io, 'service_request_update', updatePayload);
        }
      } catch (err) {
        console.error('[Socket] Update notification error:', err);
      }
      // ────────────────────────────────────────────────────────

      res.status(200).json(populatedTicket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = maintenanceController;
