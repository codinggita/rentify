const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/service-providers', userController.getServiceProviders);
router.get('/inspectors', userController.getInspectors);

module.exports = router;
