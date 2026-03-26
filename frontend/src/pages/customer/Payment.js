import backImg from '../../src/back.jpg'
import Swal from 'sweetalert2';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";

function Payment() {
    
    const { OrderId,ShopId } = useParams(); 
    const [PP, setPP] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/RestaurantAuth/getMenu/${ShopId}`);
                setPP(res.data.shopData.imagePP); 
            } catch (err) {
                console.error("Error:", err.response?.data || err.message);
            }
        };
        fetchImage();
    }, [OrderId, ShopId]);

    const handleBack = async () => {

        if (slip === null) {
            Swal.fire({
                text: 'กรุณาใส่หลักฐานการโอนเงิน',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#F97316', 
                shape: 'rounded-xl'
            });
        }

        const formData = new FormData();
        
        if (slip instanceof File) {
            formData.append("paySlip", slip);
        }

        try {

            const response = await axios.put(`http://localhost:5000/api/OrderMenu/uploadSlip/${OrderId}`, formData, {headers : { 'Content-Type' : 'multipart/form-data' }});

            if (response.status === 200) {
                Swal.fire({
                    text: 'อัพโหลดเสร็จสิ้น',
                    confirmButtonText: 'ปิดหน้าต่าง',
                    confirmButtonColor: '#F97316', 
                    shape: 'rounded-xl'
                });
                navigate(`/OrderCustomer`);
            }

        } catch (err) {
            console.error("Update error :", err);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    const [preview, setPreview] = useState(null);
    const [slip, setSlip] = useState(null);

    const handleFileChange = (e) => {
        
        const file = e.target.files[0];

        if (file) {
            setSlip(file);
            setPreview(URL.createObjectURL(file));
        }

    }

    return (
        <>
            
            <div className='pt-10 pl-5'>
                <button onClick = {() => navigate(-1)} className = "w-20 h-10 flex items-center justify-center rounded-full hover:bg-slate-300 active:scale-[0.98]">
                    <img className = "w-9" 
                        src = {backImg}
                        alt = 'backIcon'
                    />
                </button>
            </div>

            <div className="flex flex-col items-center pt-10 font-notoSans">
                {PP ? (
                    <div className="w-100 h-80">
                        <img
                            src={`http://localhost:5000${PP}`}
                            alt="Fetched Images"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <p className="text-gray-500">ไม่มีรูปภาพ</p>
                )}
            </div>
            
            <div>

                {!preview && (
                    <div className="flex flex-col items-center pt-20">

                        <p>อัพโหลดสลิปโอนเงิน</p>

                        <input
                            className="pt-10 pl-20"
                            type="file"
                            accept="image/*"
                            onChange={(handleFileChange)}
                        />

                    </div>
                )}

                {preview && (
                    <div className="flex flex-col items-center pt-10">

                        <p>อัพโหลดสลิปโอนเงิน</p>

                        <label>
                        <img src={preview} alt="slip_preview" className="pt-5 w-52 h-52"/>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            hidden="hidden"
                        />
                        </label>

                        <p className="pt-3">คลิ๊กที่รูปเพื่ออัพโหลดใหม่</p>

                    </div>
                )}

            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4">
                <button
                    onClick={handleBack}
                    className="w-full text-white bg-orange-500 py-3 rounded-2xl font-bold text-center flex justify-center px-6"
                >
                    <span>จ่ายสำเร็จ</span>
                </button>
            </div>
        </>
    );
}

export default Payment;