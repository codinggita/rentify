const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
// const auth = require('../middleware/auth'); // Assuming auth middleware exists

router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);

// Protected routes (require auth)
// router.post('/', auth, propertyController.createProperty);
// router.put('/:id', auth, propertyController.updateProperty);
// router.delete('/:id', auth, propertyController.deleteProperty);

module.exports = router;
