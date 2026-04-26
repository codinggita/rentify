const User = require('../models/User');

const userController = {
  getServiceProviders: async (req, res) => {
    try {
      const providers = await User.find({ role: { $in: ['SERVICE', 'SERVICE_PROVIDER'] } });
      res.status(200).json(providers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getInspectors: async (req, res) => {
    try {
      const inspectors = await User.find({ role: 'INSPECTOR' });
      res.status(200).json(inspectors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController;
