const WorkflowRequest = require('../models/WorkflowRequest');
const Property = require('../models/Property');
const Lease = require('../models/Lease');
const User = require('../models/User');
const { getIO } = require('../config/socket');
const { notifyUser, notifyAdmin } = require('../services/notification.service');

exports.createRequest = async (req, res) => {
  try {
    const { type, propertyId, notes } = req.body;
    const request = await WorkflowRequest.create({
      type,
      property: propertyId,
      requester: req.user.id,
      notes
    });

    // Notify Admin via socket (room-based, not broadcast)
    try {
      const io = getIO() || req.app.get('io');
      if (io) {
        notifyAdmin(io, 'new_listing_request', {
          listingId: request._id,
          ownerId: req.user.id,
          ownerName: req.user.name ?? req.user.email,
          propertyTitle: '',
          type: request.type,
          submittedAt: request.createdAt,
        });
      }
    } catch (_) {}

    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAdminRequests = async (req, res) => {
  try {
    const requests = await WorkflowRequest.find()
      .populate('property')
      .populate('requester', 'name email role')
      .populate('assignedInspector', 'name')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, assignedInspector, notes } = req.body;
    const request = await WorkflowRequest.findById(req.params.id).populate('property');
    
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.status = status || request.status;
    if (assignedInspector) request.assignedInspector = assignedInspector;
    if (notes) request.notes = notes;

    const savedRequest = await request.save();

    // ── Side Effects based on status ───────────────────────
    if (status === 'ASSIGNED' && request.type === 'TOUR_REQUEST') {
      await Lease.create({
        property: request.property._id,
        renter: request.requester,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        rentAmount: request.property.rent,
        status: 'ACTIVE'
      });
      await Property.findByIdAndUpdate(request.property._id, { status: 'BOOKED', isAvailable: false });
    }

    if (status === 'COMPLETED' && request.type === 'LEASE_APPROVAL') {
      await Property.findByIdAndUpdate(request.property._id, { status: 'AVAILABLE', isAvailable: true });
    }
    // ────────────────────────────────────────────────────────

    // ── Notify Users via Socket (room-based) ───────────────
    try {
      const io = getIO() || req.app.get('io');
      if (io) {
        // Inspector assigned to a LEASE_APPROVAL job
        if (status === 'ASSIGNED' && assignedInspector && savedRequest.type === 'LEASE_APPROVAL') {
          notifyUser(io, assignedInspector, 'inspector_assigned', {
            listingId: savedRequest._id,
            propertyTitle: request.property?.title ?? '',
            address: request.property?.address ?? {},
            assignedAt: new Date(),
          });
          notifyUser(io, request.requester, 'listing_status_update', {
            listingId: savedRequest._id,
            status: 'INSPECTOR_ASSIGNED',
            updatedAt: new Date(),
          });
        }

        // Inspector assigned to a TOUR_REQUEST (requester = renter)
        if (status === 'ASSIGNED' && savedRequest.type === 'TOUR_REQUEST') {
          notifyUser(io, request.requester, 'listing_status_update', {
            listingId: savedRequest._id,
            status: 'INSPECTOR_ASSIGNED',
            propertyTitle: request.property?.title ?? '',
            updatedAt: new Date(),
          });
        }

        // Approved
        if (status === 'COMPLETED') {
          notifyUser(io, request.requester, 'listing_status_update', {
            listingId: savedRequest._id,
            status: 'APPROVED',
            note: notes ?? '',
            updatedAt: new Date(),
          });
        }

        // Rejected
        if (status === 'REJECTED') {
          notifyUser(io, request.requester, 'listing_status_update', {
            listingId: savedRequest._id,
            status: 'REJECTED',
            note: req.body.reason ?? notes ?? '',
            updatedAt: new Date(),
          });
        }

        // Notify admin of any status change
        notifyAdmin(io, 'listing_status_update', {
          listingId: savedRequest._id,
          status: savedRequest.status,
          updatedAt: new Date(),
        });
      }
    } catch (err) {
      console.error('[Socket] workflowController notification error:', err.message);
    }
    // ────────────────────────────────────────────────────────

    res.json(savedRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
