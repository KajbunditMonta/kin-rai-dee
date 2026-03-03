import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function RegisterRestaurant () {

    const [username, setUsername] = useState("");
    const [shopName, setShopName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");

    const navigate = useNavigate();

    const handlePegister = async () => {

        if (!username || !email || !password || !shopName) {
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

        try {

            const response = await axios.post("http://localhost:5000/api/RestaurantAuth/RegisterRestaurant", {
                shopName,
                username,
                email,
                password
            })

            alert(response.data.message);
            navigate("/");

        } catch (err) {
            alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
        }

    };

    return (
        <div className = "h-screen flex flex-col items-center bg-gray-100 font-notoSans">

            <div className = "pt-16">
                <h1 className = "font-bold text-3xl font-notoSansBold">
                    สมัครสมาชิก
                </h1>
            </div>

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

            <div className = "pt-10 pr-48">
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

            <div onClick = {handlePegister} className = "pt-10">
                <button className = " bg-orange-400 text-white min-h-10 min-w-40 rounded-lg hover:bg-orange-700 active:bg-orange-800 active:scale-[0.98]">
                    สมัครสมาชิก
                </button>
            </div>

            <div className = "pt-16 flex flex-row">
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