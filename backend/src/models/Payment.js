const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    lease: {
        type: mongoose.Schema.ObjectId,
        ref: 'Lease',
        required: [true, 'Payment must belong to a lease']
    },
    tenant: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Payment must belong to a tenant']
    },
    property: {
        type: mongoose.Schema.ObjectId,
        ref: 'Property',
        required: [true, 'Payment must belong to a property']
    },
    amount: {
        type: Number,
        required: [true, 'Payment must have an amount']
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'net_banking', 'cash'],
        required: [true, 'Please specify payment method']
    },
    paidAt: Date,
    dueDate: {
        type: Date,
        required: [true, 'Payment must have a due date']
    },
    transactionId: String,
    billingPeriod: {
        start: Date,
        end: Date
    }
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
