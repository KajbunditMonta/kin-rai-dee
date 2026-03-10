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

router.put('/setOrderStatus/:id', async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findOneAndUpdate(
            { _id : id },
            { OrderStatus : status },
            { returnDocument : 'after' }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "ไม่พบข้อมูลออเดอร์" });
        }

        res.status(200).json({ 
            message : "อัพเดตสถานะออเดอร์เสร็จสิ้น",
            status : updatedOrder
        })

    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message});
    }
})

router.put('/uploadSlip/:id', upload.single('paySlip'), async (req, res) => {
    try{

        const { id } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ message: "กรุณาอัปโหลดรูปภาพ" });
        }

        const updated = await Restaurant.findOneAndUpdate(
            { _id : id },
            { paySlip: `/uploads/${req.file.filename}` },
            { returnDocument: 'after' }
        );

        res.status(200).json({ message: "อัปโหลดสำเร็จ", image: updated.image });

    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message});
    }
})

export default router;