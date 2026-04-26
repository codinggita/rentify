const Lease = require('../models/Lease');

/**
 * Lease Controller
 * Handles lease agreements between owners and tenants.
 */
const leaseController = {
  /**
   * Get leases for the current user
   */
  getLeases: async (req, res) => {
    try {
      let query = {};
      if (req.user.role === 'RENTER') query.tenant = req.user.id;
      if (req.user.role === 'OWNER') query.owner = req.user.id;

      const leases = await Lease.find(query)
        .populate('property', 'title address rent')
        .populate('tenant', 'name email')
        .populate('owner', 'name email');
        
      res.status(200).json(leases);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Create a new lease draft
   */
  createLease: async (req, res) => {
    try {
      const newLease = new Lease({
        ...req.body,
        owner: req.user.id
      });
      const savedLease = await newLease.save();
      res.status(201).json(savedLease);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = leaseController;
