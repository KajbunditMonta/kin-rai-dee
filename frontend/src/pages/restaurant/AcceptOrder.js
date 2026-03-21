import homeImg from '../../src/Home.webp';
import acceptImg from '../../src/Accept.webp';
import cancelImg from '../../src/Cancel.png';
import profileImg from '../../src/profile.png';

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";

function AcceptOrder () {

    const userData = JSON.parse(localStorage.getItem('user'));
    const username = userData?.username;
    const restaurantId = userData?._id;

    const [isOpen, setIsopen] = useState(false);
    useEffect(() => {

        const fetchStatus = async () => {

            try {

                const res = await axios.get(`http://localhost:5000/api/RestaurantAuth/getShop/${username}`);
                
                if (res.data) {
                    setIsopen(res.data.isOpen);
                }

            } catch (err) {
                console.error("Fetch Status Error:", err);
            }
        };

        if (username) {
            fetchStatus();
        }
    }, [username]);

    const statusHandle = async () => {

        if(window.confirm("ต้องการเปลี่ยนสถานะร้านหรือไม่")) {

            try {

                const nextStatus = !isOpen;
                
                const res = await axios.put(`http://localhost:5000/api/RestaurantAuth/setStatus/${username}`, {
                    username : username,
                    isOpen : nextStatus
                });

                if (res.status === 200) {
                    setIsopen(nextStatus);
                }

            } catch (err) {
                console.error("Update Status Error:", err);
                alert("ไม่สามารถเปลี่ยนสถานะร้านได้ในขณะนี้");
            }

        }
    }

    const [order, setOrder] = useState([]);
    useEffect( () => {

        const fetchOrder = async () => {

            try {

                const res = await axios.get(`http://localhost:5000/api/OrderMenu/getOrder/${restaurantId}`);
                
                if (res.data) {
                    setOrder(res.data);
                }

            } catch (err) {
                console.error("Fetch Order Error : " + err);
            }

        };

        if (restaurantId) {
            fetchOrder();
            const interval = setInterval(fetchOrder, 5000);
            return () => clearInterval(interval);
        }

    }, [restaurantId]);

    const pendingOrdersA = order.filter(item => item.OrderStatus === "accept");
    const pendingOrdersB = order.filter(item => item.OrderStatus === "success");

    const viewSlip = async () => {

    }

    return(
        <div className="min-h-screen w-full flex flex-col items-center bg-gray-100 font-notoSans pb-40">

            <div className='pt-12 flex items-center justify-center flex-shrink-0 pb-4'>
                <p className='text-2xl font-bold'>ออเดอร์ที่รับมาแล้ว</p>
            </div>

            <div className='w-80 pt-3'>
                {pendingOrdersA.length === 0 ? (
                    <div className='flex justify-center pb-10'>
                        <p className='pt-14 text-gray-400'>ไม่มีออเดอร์ที่รับมา ณ ตอนนี้ . . .</p>
                    </div>
                ) : (
                    order.map((item, index) => ( item.OrderStatus === "accept" && (
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
                                    <p className='font-bold'>ราคารวม :</p>
                                    <span className='pl-2 text-green-700 font-notoSansBold text-2xl'>{item.totalPrice}</span>
                                </div>

                                <div className='flex justify-center items-center pt-4'>
                                    {item.paySlip ? (
                                        <button
                                            onClick={() => viewSlip(item.paySlip)}
                                        >

                                        </button>
                                    ) : (
                                        <p>🕓 รอหลักฐานการชำระเงิน</p>
                                    )}
                                </div>

                            </div>
                        )
                    ))
                )}
            </div>

            <div className='pt-12 flex items-center justify-center flex-shrink-0 pb-4'>
                <p className='text-2xl font-bold'>คำสั่งซื้อที่เสร็จสิ้น</p>
            </div>
            
            <div className='w-80 pt-3'>
                {pendingOrdersB.length === 0 ? (
                    <div className='flex justify-center pb-10'>
                        <p className='pt-14 text-gray-400'>ไม่มีคำสั่งซื้อที่เสร็จสิ้น ณ ตอนนี้ . . .</p>
                    </div>
                ) : (
                    order.map((item, index) => ( item.OrderStatus === "success" && (
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
                                    <p className='font-bold'>ราคารวม :</p>
                                    <span className='pl-2 text-green-700 font-notoSansBold text-2xl'>{item.totalPrice}</span>
                                </div>

                            </div>
                        )
                    ))
                )}
            </div>

            <Navbar
                isOpen={isOpen}
                statusHandle={statusHandle}
                homeImg={homeImg}
                acceptImg={acceptImg}
                cancelImg={cancelImg}
                profileImg={profileImg}
            />

        </div>
    )
}

export default AcceptOrder;