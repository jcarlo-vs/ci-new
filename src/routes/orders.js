const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET all orders with populated user data
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single order with populated user data
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new order
router.post('/', async (req, res) => {
    const order = new Order({
        user: req.body.userId,
        items: req.body.items,
        totalAmount: req.body.totalAmount,
        status: req.body.status || 'pending'
    });

    try {
        const newOrder = await order.save();
        const populatedOrder = await Order.findById(newOrder._id).populate('user', 'name email');
        res.status(201).json(populatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update order
router.put('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (req.body.items) order.items = req.body.items;
        if (req.body.totalAmount) order.totalAmount = req.body.totalAmount;
        if (req.body.status) order.status = req.body.status;

        const updatedOrder = await order.save();
        const populatedOrder = await Order.findById(updatedOrder._id).populate('user', 'name email');
        res.json(populatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await order.deleteOne();
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 