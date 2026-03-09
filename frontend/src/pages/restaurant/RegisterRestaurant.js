import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function RegisterRestaurant () {

    const [username, setUsername] = useState("");
    const [shopName, setShopName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [img, setImg] = useState(null);
    const [preview, setPreview] = useState(null);
    const [imgPP, setImgPP] = useState(null);
    const [previewPP, setPreviewPP] = useState(null);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImg(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleFileChangePP = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgPP(file);
            setPreviewPP(URL.createObjectURL(file));
        }
    };

    const navigate = useNavigate();

    const handlePegister = async () => {

        if (!username || !email || !password || !shopName || img === null || imgPP === null) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง");
            return;
        }

        if (password.length < 8) {
            alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
            return;
        }

        if (password !== confirmPassword) {
            alert("รหัสผ่านไม่ตรงกัน");
            return;
        }

        const formData = new FormData();
        formData.append("shopName", shopName);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", img);
        formData.append("imagePP", imgPP);

        try {

            const response = await axios.post("http://localhost:5000/api/RestaurantAuth/RegisterRestaurant", formData, {
                headers : { "Content-Type" : "multipart/formData" }
            })

            alert(response.data.message);
            navigate("/");

        } catch (err) {
            alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
        }

    };

    return (
        <div className = "min-h-screen flex flex-col items-center bg-gray-100 font-notoSans">

            <div className = "pt-16">
                <h1 className = "text-3xl font-notoSansBold">
                    สมัครสมาชิก
                </h1>
            </div>
            
            {preview && (
                <div className="flex justify-center flex-col items-center pt-10">
                    <p className = "pr-36 pb-5 text-sm">รูปโปรไฟล์ร้าน</p>
                    <label>
                        <img src={preview} className="w-40 h-40 rounded-xl" alt="Preview" />
                        <input className = 'pl-16'
                        type = 'file'
                        accept='image/*'
                        onChange = { handleFileChange }
                        hidden = 'hidden'
                    />
                    </label>
                    
                    <p className = 'underline text-gray-400 pt-2'>คลิ๊กที่รูปเพื่ออัพโหลดรูปใหม่</p>
                </div>
            )}

            {!preview && (
                <div className = 'flex flex-col items-center justify-center pt-10'>
                    <p className = "pr-36 pb-5 text-sm">รูปโปรไฟล์ร้าน</p>
                    <input className = 'pl-16'
                        type = 'file'
                        accept='image/*'
                        onChange = { handleFileChange }
                    />
                </div>
            )}

            <div className = "pt-10 pr-28">
                <label className = "text-sm">
                    ชื่อร้าน (แสดงในระบบ)
                </label>
            </div>

            <div className = "pt-1">
                <input className = "rounded-md border-2 min-h-10 min-w-60 text-center"
                    placeholder = "ชื่อร้าน"
                    value = {shopName}
                    onChange = { (e) => setShopName(e.target.value)}
                />
            </div>

            <div className = "pt-5 pr-48">
                <label className = "text-sm">
                    ชื่อผู้ใช้
                </label>
            </div>

            <div className = "pt-1">
                <input className = "rounded-md border-2 min-h-10 min-w-60 text-center"
                    placeholder = "ชื่อผู้ใช้"
                    value = {username}
                    onChange = { (e) => setUsername(e.target.value)}
                />
            </div>

            <div className = "pt-5 pr-36">
                <label className = "text-sm">
                    Email address
                </label>
            </div>

            <div className = "pt-2">
                <input className = "rounded-md border-2 min-h-10 min-w-60 text-center"
                    placeholder = "Email address"
                    type = "email"
                    value = {email}
                    onChange = { (e) => setEmail(e.target.value)}
                />
            </div>

            <div className = "pt-5 pr-48">
                <label className = "text-sm">
                    รหัสผ่าน
                </label>
            </div>

            <div className = "pt-2">
                <input className = "rounded-md border-2 min-h-10 min-w-60 text-center"
                    placeholder = "รหัสผ่าน"
                    type = "password"
                    value = {password}
                    onChange = { (e) => setPassword(e.target.value)}
                />
            </div>

            <div className = "pt-5 pr-40">
                <label className = "text-sm">
                    ยืนยันรหัสผ่าน
                </label>
            </div>

            <div className = "pt-2">
                <input className = "rounded-md border-2 min-h-10 min-w-60 text-center"
                    placeholder = "ยืนยันรหัสผ่าน"
                    type = "Password"
                    value = {confirmPassword}
                    onChange = { (e) => setconfirmPassword(e.target.value)}
                />
            </div>
            
            {previewPP && (
                <div className="flex justify-center flex-col items-center pt-10">
                    <p className = "pr-36 pb-5 text-sm">คิวอาร์โค้ดพร้อมเพย์</p>
                    <label>
                        <img src={previewPP} className="w-40 h-40 rounded-xl" alt="Preview" />
                        <input className = 'pl-16'
                        type = 'file'
                        accept='image/*'
                        onChange = { handleFileChangePP }
                        hidden = 'hidden'
                    />
                    </label>
                    
                    <p className = 'underline text-gray-400 pt-2'>คลิ๊กที่รูปเพื่ออัพโหลดรูปใหม่</p>
                </div>
            )}

            {!previewPP && (
                <div className = 'flex flex-col items-center justify-center pt-10'>
                    <p className = "pr-32 pb-5 text-sm">คิวอาร์โค้ดพร้อมเพย์</p>
                    <input className = 'pl-16'
                        type = 'file'
                        accept='image/*'
                        onChange = { handleFileChangePP }
                    />
                </div>
            )}

            <div onClick = {handlePegister} className = "pt-10">
                <button className = " bg-orange-400 text-white min-h-10 min-w-40 rounded-lg hover:bg-orange-700 active:bg-orange-800 active:scale-[0.98]">
                    สมัครสมาชิก
                </button>
            </div>

            <div className = "pt-16 flex flex-row mb-10">
                <p className = "text-sm">
                    มีสมาชิกอยู่แล้ว?
                </p>
                <Link className = "text-sm underline pl-2" to = "/">
                    Login ที่นี่
                </Link>
            </div>

        </div>
    )
}

export default RegisterRestaurant;