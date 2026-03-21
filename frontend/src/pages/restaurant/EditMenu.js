import backImg from '../../src/back.jpg';

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function EditMenu () {

    const navigate = useNavigate();

    const backHandle = () => {
        navigate('/MenuManagement');
    };

    const location = useLocation();
    const { menu } = location.state || {};

    const [name, setName] = useState(menu.name);
    const [desc, setDesc] = useState(menu.desc);
    const [price, setPrice] = useState(menu.price);
    const [img, setImg] = useState(menu.image);
    const [preview, setPreview] = useState(null);

    const handleImg = (e) => {

        const file = e.target.files[0];

        if (file) {
            setImg(file);
            setPreview(URL.createObjectURL(file));
        }

    }

    const updateHandle = async (e) => {

        if (window.confirm("ต้องการแก้ไขข้อมูลตามนี้ใช่หรือไม่")) {

            e.preventDefault();

            const formData =  new FormData();
            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('price', price);

            if (img instanceof File) {
                formData.append('image', img);
            }

            try {

                const res = await axios.put(`http://localhost:5000/api/RestaurantAuth/UpdateMenu/${menu._id}`, formData, { headers : { 'Content-Type' : 'multipart/form-data' }});

                if (res.status === 200) {
                    alert("แก้ไขเมนูสำเร็จ!");
                    navigate('/MenuManagement');
                }

            } catch (err) {
                console.error("Update error :", err);
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            }

        }
    }

    return (
        <div className = "min-h-screen flex flex-col bg-gray-100 font-notoSans">
            <div className = "flex flex-col pt-10">
                
                <div className = "pl-4">

                    <button onClick = {backHandle} className = "w-20 h-10 flex items-center justify-center rounded-full hover:bg-slate-300 active:scale-[0.98]">
                        <img className = "w-9" 
                            src = {backImg}
                            alt = 'backIcon'
                        />
                    </button>

                </div>

                <h1 className = "font-bold text-center text-2xl pb-5 pt-5">
                    แก้ไขเมนู:
                </h1>
                <div className = 'flex justify-center'>
                    <span className = 'font-notoSansBold text-2xl text-orange-500'>{menu?.name}</span>
                </div>
                

                <div className = 'flex flex-col items-center pt-5'>

                    <label>

                        <img
                            className = 'w-32 h-32 rounded-lg'
                            src = {preview ? preview : `http://localhost:5000${menu.image}`}
                            alt = "Preview"
                        />

                        <input
                            type = 'file'
                            accept = 'image/*'
                            hidden = "hidden"
                            onChange = { handleImg }
                        />
                    </label>

                </div>

                <p className = 'text-center pt-2 text-gray-400 underline text-sm'>คลิ๊กที่รูปเพื่ออัพโหลดรูปใหม่</p>

                <div className = 'flex flex-col items-center pt-7'>

                    <p className = 'pb-2 font-bold'>
                        ชื่อเมนู
                    </p>

                    <input
                        className = 'rounded-lg bg-gray-300 w-60 h-10 text-center'
                        placeholder = {menu.name}
                        onChange = { (e) => setName(e.target.value) }
                    />
                </div>

                <div className = 'flex flex-col items-center pt-5'>

                    <p className = 'pb-2 font-bold'>
                        คำอธิบาย
                    </p>

                    <input
                        className = 'rounded-lg bg-gray-300 w-60 h-10 text-center'
                        placeholder = {menu.desc}
                        onChange = { (e) => setDesc(e.target.value) }
                    />
                </div>

                <div className = 'flex flex-col items-center pt-5'>

                    <p className = 'pb-2 font-bold'>
                        ราคา
                    </p>

                    <input
                        className = 'rounded-lg bg-gray-300 w-60 h-10 text-center'
                        type = 'number'
                        placeholder = {menu.price}
                        onChange = { (e) => setPrice(e.target.value) }
                    />
                </div>

                <div className = 'flex flex-col items-center pt-10'>
                    <button onClick = {updateHandle} className = 'w-32 h-10 bg-blue-400 rounded-lg text-white active:scale-[0.98] hover:bg-blue-600'>
                        บันทึกการแก้ไข
                    </button>
                </div>

            </div>
        </div>
    )
};

export default EditMenu;