import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const NewOrder = Order(req.body);
        await NewOrder.save();
        res.status(200).json({message: "สั่งอาหารสำเร็จ", Order: NewOrder});
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/getOrder/:restaurantId', async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const order = await Order.find({ restaurantId : restaurantId }).sort({ createAt : -1 });
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message});
    }
});

export default router;