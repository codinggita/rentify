const mongoose = require('mongoose');

const inspectionTaskSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { 
    type: String, 
    enum: ['ROUTINE', 'MOVE_IN', 'MOVE_OUT', 'EMERGENCY'],
    default: 'ROUTINE'
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'],
    default: 'PENDING'
  },
  scheduledDate: { type: Date, required: true },
  notes: { type: String },
  report: { type: String } // URL to inspection report/images
}, { timestamps: true });

module.exports = mongoose.model('InspectionTask', inspectionTaskSchema);
