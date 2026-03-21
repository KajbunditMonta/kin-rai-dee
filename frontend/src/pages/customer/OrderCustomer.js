

import { Link } from "react-router-dom"; 
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function HomeCustomer () {

    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem("user"));
    const customerUsername = userData?.username;

    const [order, setOrder] = useState([]);
    useEffect( () => {

        const fetchOrder = async () => {

            try {

                const res = await axios.get(`http://localhost:5000/api/OrderMenu/getOrderCustomer/${customerUsername}`);
                
                if (res.data) {
                    setOrder(res.data);
                }

            } catch (err) {
                console.error("Fetch Order Error : " + err);
            }

        };

        if (customerUsername) {
            fetchOrder();
            const interval = setInterval(fetchOrder, 5000);
            return () => clearInterval(interval);
        }

    }, [customerUsername]);

    const newOrders = order.filter(item => !item.OrderStatus || item.OrderStatus === "");
    const acceptedOrders = order.filter(item => item.OrderStatus === "accept");
    const rejectedOrders = order.filter(item => item.OrderStatus === "reject");
    const successOrders = order.filter(item => item.OrderStatus === "success");
    const paidOrders = order.filter(item => item.OrderStatus === "paid");

    const viewDereveredPhoto = (DeriveredPT) => {

        if (!DeriveredPT) {
            return Swal.fire({
                icon: 'error',
                title: 'ไม่พบหลักฐาน',
                text: 'ออเดอร์นี้ยังไม่มีการแนบรูปเข้ามา',
            });
        }

        const imgUrl = `http://localhost:5000${DeriveredPT}`;

        Swal.fire({
            title : "หลักฐานการโอนเงิน",
            imageUrl : imgUrl,
            imageAlt : "Slip",
            imageWidth : 320,
            confirmButtonText : "ปิดหน้าต่าง",
            confirmButtonColor : '#3b82f6'
        });

    }

    return (
        <div className = "min-h-screen flex flex-col items-center bg-gray-100 font-notoSans">
            <h1 className = "text-5xl pt-8">รายการ</h1>

            <div className='w-80 pt-5'>

                {order.length === 0 && (
                    <div className='flex justify-center pb-10'>
                        <p className='pt-14 text-gray-400'>คุณยังไม่มีคำสั่งซื้อ ณ ตอนนี้ . . .</p>
                    </div>
                )}

                {acceptedOrders.length !== 0 && (
                    acceptedOrders.map((item, index) => ( item.OrderStatus === "accept" && (
                            <div key={index} className='bg-blue-200 rounded-xl mb-4 shadow-md p-4'>
                                <h1 className='font-notoSansBold text-blue-700 text-lg mb-2'> 👤 {item.customerName}</h1>

                                {item.items.map((food, idx) => (
                                    <div key={idx} className='pt-1 border-dashed last:border-0 pb-1'>

                                        <div className='flex justify-between items-center'>
                                            <p className='pl-4 text-lg'>{food.foodName}</p>
                                            <span className='font-notoSansBold pr-2 text-lg'>x{food.quantity}</span>
                                        </div>

                                        {food.note && (
                                            <p className='text-sm pl-10 text-red-500 italic'>*{food.note}</p>
                                        )}
                                    </div>
                                ))}

                                <div className='flex justify-center pt-4 pb-2'>
                                    <p className='font-notoSansBold text-sm text-gray-700'>📍 ส่งที่ : {item.address}</p>
                                </div>

                                <div className='flex justify-center items-center pt-4'>
                                    <p className='font-bold'>ราคารวม :</p>
                                    <span className='pl-2 text-green-700 font-notoSansBold text-2xl'>{item.totalPrice}</span>
                                </div>

                                <div className="pt-2 text-center">
                                    <div className="flex justify-end">
                                        <button className="bg-green-600 text-white w-16 h-10 rounded-xl active:scale-[0.98] hover:bg-green-800"
                                            onClick={() => navigate(`/Payment/${item._id}/${item.restaurantId}`)}
                                        >    
                                            ชำระเงิน
                                        </button>
                                    </div>
                                </div>

                            </div>
                    )))
                )}

                {successOrders.length !== 0 && (
                    successOrders.map((item, index) => ( item.OrderStatus === "success" && (
                            <div key={index} className='bg-green-100 rounded-xl mb-4 shadow-md p-4'>
                                <h1 className='font-notoSansBold text-blue-700 text-lg mb-2'> 👤 {item.customerName}</h1>

                                {item.items.map((food, idx) => (
                                    <div key={idx} className='pt-1 border-dashed last:border-0 pb-1'>

                                        <div className='flex justify-between items-center'>
                                            <p className='pl-4 text-lg'>{food.foodName}</p>
                                            <span className='font-notoSansBold pr-2 text-lg'>x{food.quantity}</span>
                                        </div>

                                        {food.note && (
                                            <p className='text-sm pl-10 text-red-500 italic'>*{food.note}</p>
                                        )}
                                    </div>
                                ))}

                                <div className='flex justify-center pt-4 pb-2'>
                                    <p className='font-notoSansBold text-sm text-gray-700'>📍 ส่งที่ : {item.address}</p>
                                </div>

                                <div className='flex flex-col justify-center items-center pt-4'>
                                    <span className='pl-2 text-green-700 font-notoSansBold text-lg'>จัดส่งเสร็จสิ้น</span>
                                    <div className='pl-2'>
                                        <button className='bg-white w-48 h-10 rounded-xl active:scale-[0.98] hover:bg-gray-100'
                                            onClick={() => viewDereveredPhoto(item.DeriveredPT)}
                                        >
                                            ดูหลักฐานการจัดส่ง
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                    )))
                )}

                {paidOrders.length !== 0 && (
                    paidOrders.map((item, index) => ( item.OrderStatus === "paid" && (
                            <div key={index} className='bg-green-100 rounded-xl mb-4 shadow-md p-4'>
                                <h1 className='font-notoSansBold text-blue-700 text-lg mb-2'> 👤 {item.customerName}</h1>

                                {item.items.map((food, idx) => (
                                    <div key={idx} className='pt-1 border-dashed last:border-0 pb-1'>

                                        <div className='flex justify-between items-center'>
                                            <p className='pl-4 text-lg'>{food.foodName}</p>
                                            <span className='font-notoSansBold pr-2 text-lg'>x{food.quantity}</span>
                                        </div>

                                        {food.note && (
                                            <p className='text-sm pl-10 text-red-500 italic'>*{food.note}</p>
                                        )}
                                    </div>
                                ))}

                                <div className='flex justify-center pt-4 pb-2'>
                                    <p className='font-notoSansBold text-sm text-gray-700'>📍 ส่งที่ : {item.address}</p>
                                </div>

                                <div className='flex flex-col justify-center items-center pt-4'>
                                    <span className='pl-2 text-gray-700 font-notoSansBold text-lg'>รอร้านจัดส่ง . . .</span>
                                </div>
                                
                            </div>
                    )))
                )}

                {newOrders.length !== 0 && (
                    newOrders.map((item, index) => ( item.OrderStatus === "" && (
                            <div key={index} className='bg-gray-300 rounded-xl mb-4 shadow-md p-4'>
                                <h1 className='font-notoSansBold text-blue-700 text-lg mb-2'> 👤 {item.customerName}</h1>

                                {item.items.map((food, idx) => (
                                    <div key={idx} className='pt-1 border-dashed last:border-0 pb-1'>

                                        <div className='flex justify-between items-center'>
                                            <p className='pl-4 text-lg'>{food.foodName}</p>
                                            <span className='font-notoSansBold pr-2 text-lg'>x{food.quantity}</span>
                                        </div>

                                        {food.note && (
                                            <p className='text-sm pl-10 text-red-500 italic'>*{food.note}</p>
                                        )}
                                    </div>
                                ))}

                                <div className='flex justify-center pt-4 pb-2'>
                                    <p className='font-notoSansBold text-sm text-gray-700'>📍 ส่งที่ : {item.address}</p>
                                </div>

                                <div className='flex justify-center items-center pt-4'>
                                    <p className='font-bold text-md'>🕙 รอร้านยืนยันออเดอร์</p>
                                </div>

                            </div>
                    )))
                )}

                {rejectedOrders.length !== 0 && (
                    rejectedOrders.map((item, index) => ( item.OrderStatus === "reject" && (
                            <div key={index} className='bg-red-100 rounded-xl mb-4 shadow-md p-4'>
                                <h1 className='font-notoSansBold text-blue-700 text-lg mb-2'> 👤 {item.customerName}</h1>

                                {item.items.map((food, idx) => (
                                    <div key={idx} className='pt-1 border-dashed last:border-0 pb-1'>

                                        <div className='flex justify-between items-center'>
                                            <p className='pl-4 text-lg'>{food.foodName}</p>
                                            <span className='font-notoSansBold pr-2 text-lg'>x{food.quantity}</span>
                                        </div>

                                        {food.note && (
                                            <p className='text-sm pl-10 text-red-500 italic'>*{food.note}</p>
                                        )}
                                    </div>
                                ))}

                                <div className='flex justify-center pt-4 pb-2'>
                                    <p className='font-notoSansBold text-sm text-gray-700'>📍 ส่งที่ : {item.address}</p>
                                </div>

                                <div className='flex flex-col justify-center items-center pt-4'>
                                    <span className='pl-2 text-red-700 font-notoSansBold text-lg'>ร้านยกเลิก</span>
                                    <div className="flex flex-row pt-2">
                                        <p className='text-sm pt-1'>เหตุผล : </p>
                                        <span className='pl-2 pt-1 font-notoSansBold text-sm'>{item.RejectReason}</span>
                                    </div>
                                </div>

                            </div>
                    )))
                )}

            </div>
            
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 h-16 flex justify-around items-center shadow-lg z-50">
                <Link to="/HomeCustomer" className="flex flex-col items-center text-gray-600 hover:text-blue-500 focus:text-blue-600">
                    <span className="text-2xl">🏠</span>
                    <span className="text-xs font-medium">หน้าหลัก</span>
                </Link>
                <Link to="/OrderHistory" className="flex flex-col items-center text-gray-600 hover:text-blue-500 focus:text-blue-600">
                    <span className="text-2xl">📜</span>
                    <span className="text-xs font-medium">ออเดอร์</span>
                </Link>
                <Link to="/Profile" className="flex flex-col items-center text-gray-600 hover:text-blue-500 focus:text-blue-600">
                    <span className="text-2xl">👤</span>
                    <span className="text-xs font-medium">ฉัน</span>
                </Link>

            </div>
            <div className="pt-20"></div>
        </div>
        
    )
}

export default HomeCustomer;    