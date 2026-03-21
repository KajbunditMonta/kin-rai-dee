import express from 'express';
import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';

import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage : storage});

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

router.put('/rejectOrder/:orderId', async (req, res) => {
    try {

        const { orderId } = req.params;
        const { reason } = req.body;
        const order = await Order.findOneAndUpdate(
            { _id : orderId },
            {
                OrderStatus : "reject",
                RejectReason : reason
            },
            { returnDocument: 'after' }
        );

        if (!order) {
            return res.status(404).json({ message: "ไม่พบคำสั่งซื้อนี้" });
        }

        res.status(200).json({ message : "ปฏิเสธคำสั่งซื้อเรียบร้อย", data : order});

    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message});
    }
});

router.put('/acceptOrder/:orderId', async (req, res) => {
    try {

        const { orderId } = req.params;
        const { price } = req.body;
        const order = await Order.findOneAndUpdate(
            { _id : orderId },
            {
                OrderStatus : 'accept',
                totalPrice : price
            },
            { returnDocument : 'after'}
        );

        if (!order) {
            return res.status(404).json({message : "ไม่พบคำสั่งซื้อนี้"});
        }

        res.status(200).json({ message : "รับออเดอร์เรียบร้อย", data : order});

    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message});
    }
});

router.put('/uploadSlip/:id', upload.single('paySlip'), async (req, res) => {
    try{

        const { id } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ message: "กรุณาอัปโหลดรูปภาพ" });
        }

        const updated = await Order.findOneAndUpdate(
            { _id : id },
            {   
                OrderStatus : "paid",
                paySlip: `/uploads/${req.file.filename}` 
            },
            { returnDocument: 'after' }
        );

        res.status(200).json({ message: "อัปโหลดสำเร็จ", image: updated.image });

    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message});
    }
})

router.get('/getOrderCustomer/:customerUsername', async (req, res) => {
    try {
        const { customerUsername } = req.params;
        const order = await Order.find({ customerName : customerUsername }).sort({ createAt : -1 });
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message});
    }
});

router.put('/sendDeriveredPhoto/:OrderId', upload.single('derveredPhoto'), async (req, res) => {
    try {

        const { OrderId } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "กรุณาอัปโหลดรูปภาพ" });
        }

        const upload = await Order.findOneAndUpdate(
            { _id : OrderId},
            { 
                DeriveredPT : `/uploads/${req.file.filename}`,
                OrderStatus : "success"
            },
            { returnDocument : 'after' }
        )

        res.status(200).json({ message : "อัปโหลดสำเร็จ", image: upload.image});

    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message});
    }
});

export default router;