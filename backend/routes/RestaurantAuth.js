import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import Restaurant from '../models/Restaurant.js';
import Customer from '../models/Customer.js';
import Menu from '../models/Menu.js';

const router = express.Router();

router.post ('/RegisterRestaurant', async (req, res) => {
    try {

        const { shopName, username, email, password } = req.body;

        const shopNameExists = await Restaurant.findOne({ shopName });
        if (shopNameExists) {
            return res.status(400).json({ message : "ไม่สามารถใช้ชื่อร้านนี้ได้"})
        }

        const emailExists = await Restaurant.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message : "ไม่สามารถใช้อีเมลนี้ได้"})
        }
        const emailExists2 = await Customer.findOne({ email });
        if (emailExists2) {
            return res.status(400).json({message : "ไม่สามารถใช้อีเมลนี้ได้"})
        }

        const userExists = await Restaurant.findOne({ username });
            if (userExists) {
                return res.status(400).json({message : "ไม่สามารถใช้ชื่อผู้ใช้นี้ได้"})
        }
        const userExists2 = await Customer.findOne({ username });
        if (userExists2) {
            return res.status(400).json({message : "ไม่สามารถใช้ชื่อผู้ใช้นี้ได้"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Restaurant({
            shopName,
            username,
            email,
            password : hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message : "สมัครสมาชิกเสร็จสิ้น"})

    } catch (err) {
        res.status(500).json({message : err.message});
    }
})

router.post ('/LoginRestaurant', async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await Restaurant.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" })
        }

        res.status(200).json({
            message : "เข้าสู่ระบบสำเร็จ",
            user : {
                username : user.username,
                email : user.email,
                type : user.type
            }
        })

    } catch (err) {
        res.status(500).json({ message: "Backend Error : " + err.message })
    }

})


const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage : storage});

router.post ('/AddMenu', upload.single('image'), async (req, res) => {

    try {

        const { name, desc, price, username } = req.body;

        if (!req.file) {
            return res.status(400).json({ message : "กรุณาอัพโหลดรูปภาพ" });
        }

        const newMenu = new Menu({
            name,
            desc,
            price,
            image : `/uploads/${req.file.filename}`,
            username
        });

        await newMenu.save();
        res.status(201).json({ message : "บันทึกข้อมูลสำเร็จ", menu : newMenu })

    } catch (err) {
        res.status(500).json({ message: "Backend Error : " + err.message })
    }

});

router.get('/Menus/:username', async (req, res) => {

    try {
        const { username } = req.params;
        const menus = await Menu.find({ username : username}).sort({ createdAt : -1});
        res.status(200).json(menus);
    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message});
    }

});

router.delete('/DeleteMenu/:id', async (req, res) => {

    try {

        const { id } = req.params;
        const DeleteMenu = await Menu.findByIdAndDelete(id);
        
        if (!DeleteMenu) {
            return res.status(404).json({ message : "ไม่พบข้อมูลที่ต้องการลบ" });
        }

        return res.status(200).json({ message: "ลบเมนูสำเร็จ" });

    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message });
    }

});

router.put('/UpdateMenu/:id', upload.single('image'), async (req, res) => {

    try {

        const {id} = req.params;
        const { name, desc, price } = req.body;

        let updateData = {name, desc, price };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const UpdateMenu = await Menu.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: 'after' }
        );

        if (!UpdateMenu) {
            res.status(404).json({ message : "ไม่พบเมนูที่ต้องการแก้ไข" });
        }

        res.status(200).json({ message : "แก้ไขข้อมูลสำเร็จ", menu : UpdateMenu});
    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message});
    }

});

router.get('/getAll', async (req, res) => {
    try {
        const restaurant = await Restaurant.find({});
        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

router.post('/uploadRestaurantImage', upload.single('image'), async (req, res) => {
    try {
        const { username } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "กรุณาอัปโหลดรูปภาพ" });
        }
        const updated = await Restaurant.findOneAndUpdate(
            { username },
            { image: `/uploads/${req.file.filename}` },
            { returnDocument: 'after' }
        );
        res.status(200).json({ message: "อัปโหลดสำเร็จ", image: updated.image });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/getMenu/:id', async (req, res) => {
    try {
        const shopId = req.params.id;
        const shop = await Restaurant.findById(shopId);
        if (!shop) {
            return res.status(404).json({ message: "ไม่พบร้านค้านี้" });
        }
        const menus = await Menu.find({ username: shop.username });
        res.status(200).json({
            shopData: shop, 
            menuData: menus
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/getShop/:username', async (req, res) => {

    try {

        const { username } = req.params;

        const shop = await Restaurant.findOne({ username : username});

        if (!shop) {
            return res.status(404).json({ message: "ไม่พบข้อมูลร้านค้า" });
        }

        res.status(200).json(shop);

    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message});
    }

});

router.put('/setStatus/:username', async (req, res) => {

    try{

        const { username } = req.params;
        const { isOpen } = req.body;

        const updatedShop = await Restaurant.findOneAndUpdate(
            { username : username },
            { isOpen : isOpen },
            { returnDocument: 'after' }
        );

        if (!updatedShop) {
            return res.status(404).json({ message: "ไม่พบข้อมูลร้านค้า" });
        }

        res.status(200).json({
            message : "อัปเดตสถานะสำเร็จ",
            isOpen : updatedShop
        });

    } catch (err) {
        res.status(500).json({ message : "Backend Error : " + err.message});
    }

})

export default router;