const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

router.get('/owner', authenticate, dashboardController.getOwnerStats);
router.get('/renter', authenticate, dashboardController.getRenterStats);
router.get('/service', authenticate, dashboardController.getServiceStats);
router.get('/inspector', authenticate, dashboardController.getInspectorStats);
router.get('/admin', authenticate, dashboardController.getAdminStats);

module.exports = router;
