const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
    try {
        const payment = await Payment.create({
            ...req.body,
            tenant: req.user.id
        });
        res.status(201).json({
            status: 'success',
            data: { payment }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ tenant: req.user.id })
            .populate('property', 'title location')
            .populate('lease');

        res.status(200).json({
            status: 'success',
            results: payments.length,
            data: { payments }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getUpcomingPayments = async (req, res) => {
    try {
        const payments = await Payment.find({
            tenant: req.user.id,
            status: 'pending',
            dueDate: { $gte: new Date() }
        }).sort('dueDate');

        res.status(200).json({
            status: 'success',
            data: { payments }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
