const Property = require('../models/Property');

/**
 * Property Controller
 * Handles logic for property retrieval and management.
 */
const propertyController = {
  /**
   * Get all properties
   */
  getProperties: async (req, res) => {
    try {
      const { city, minRent, maxRent, type } = req.query;
      let query = {};

      if (city) query.city = new RegExp(city, 'i');
      if (type && type !== 'all') query.type = type.toUpperCase();
      if (minRent || maxRent) {
        query.rent = {};
        if (minRent) query.rent.$gte = Number(minRent);
        if (maxRent) query.rent.$lte = Number(maxRent);
      }

      const properties = await Property.find(query).populate('owner', 'name email');
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get property by ID
   */
  getPropertyById: async (req, res) => {
    try {
      const property = await Property.findById(req.params.id).populate('owner', 'name email');
      if (!property) return res.status(404).json({ message: 'Property not found' });
      res.status(200).json(property);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Create property
   */
  createProperty: async (req, res) => {
    try {
      const newProperty = new Property({
        ...req.body,
        owner: req.user.id // Assuming auth middleware sets req.user
      });
      const savedProperty = await newProperty.save();
      res.status(201).json(savedProperty);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Update property
   */
  updateProperty: async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ message: 'Property not found' });
      
      // Check ownership
      if (property.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const updatedProperty = await Property.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Delete property
   */
  deleteProperty: async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ message: 'Property not found' });

      // Check ownership
      if (property.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      await Property.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Property deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = propertyController;
