import wallet from '../../src/wallet.webp';
import menu from '../../src/menu.webp';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function HomeRestaurant () {
    
    const navigate = useNavigate();

    const menuManagement = () => {
        navigate("/MenuManagement");
    }

    const userData = JSON.parse(localStorage.getItem('user'));
    const username = userData?.username;
    const restaurantId = userData?._id

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

    const OrderStatusHandle = async (id, status) => {

        let showText;

        if (status === "done") {
            showText = "จัดส่งสำเร็จ";
        }

        if (status === "done" && window.confirm(`ต้องการเปลี่ยนสถานะคำสั่งซื้อเป็น "${showText} " หรือไม่`)) {
            try {

                const res = await axios.put(`http://localhost:5000/api/OrderMenu/setOrderStatus/${id}`, {
                    status : status
                });

                if (res.status === 200) {
                    alert("เปลี่ยนสถานะเสร็จสิ้น");
                }

            } catch (err) {
                console.error("Update Status Error:", err);
                alert("ไม่สามารถเปลี่ยนสถานะออเดอร์ได้ในขณะนี้");
            }
        } 

        let reason = "";

        if (status === "denied") {

            reason = window.prompt("เหตุผลที่ปฏิเสธคำสั่งซื้อ");

            if (reason === "") {
                alert("โปรดให้เหตุผลการยกเลิกคำสั่งซื้อ");
                return;
            }



        }

    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-gray-100 font-notoSans pb-40">
            
            <div className="h-8"></div>

            <div className="bg-blue-300 w-80 h-32 rounded-3xl shadow-2xl flex-shrink-0">
                <div className='flex flex-row pt-6 pl-3'>
                    <img className='w-20' src={wallet} alt='wallet'/>
                    <div className='flex flex-col pl-4'>
                        <p className='text-white font-bold text-lg'>ยอดขายวันนี้</p>
                        <p className='text-white font-bold text-lg text-right pt-4'>บาท</p>
                    </div>
                </div>
            </div>

            <div className='pt-12 flex flex-row items-center w-80 flex-shrink-0'>
                <button onClick={menuManagement} className='bg-gray-300 w-20 h-20 rounded-full hover:bg-gray-500 active:scale-[0.98] flex items-center justify-center'>
                    <img className='w-14' src={menu} alt='menu-icon'/>
                </button>
                <label className='pl-5 text-2xl font-bold'>เมนู</label>
            </div>

            <div className='pt-8 flex items-center justify-center flex-shrink-0'>
                <p className='text-2xl font-bold'>คำสั่งซื้อ</p>
            </div>

            <div className='w-80 pt-3'>
                {order.length === 0 ? (
                    <div className='flex justify-center pb-10'>
                        <p className='pt-14 text-gray-400'>ไม่มีคำสั่งซื้อ ณ ตอนนี้ . . .</p>
                    </div>
                ) : (
                    order.map((item, index) => (
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

                            <div className='pt-2 pl-2 flex flex-row justify-between'>
                                <p>ราคารวม</p>
                                <p className='font-notoSansBold text-green-700 text-xl'>{item.totalPrice}</p>
                            </div>

                            <div className='flex justify-center pt-4 pb-2'>
                                <p className='font-notoSansBold text-sm text-gray-700'>📍 ส่งที่ : {item.address}</p>
                            </div>

                            <div className='flex justify-center flex-row pt-4'>
                                <div className='pr-2'>
                                <button className='bg-red-500 text-center w-20 h-10 rounded-xl text-white hover:bg-red-700 active:scale-[0.98]'
                                    onClick={ () => OrderStatusHandle(item._id, "denied")}>
                                        ปฎิเสธ                                
                                </button>
                                </div>
                                <div className='pl-2'>
                                <button className='bg-green-500 text-center w-20 h-10 rounded-xl text-white hover:bg-green-700 active:scale-[0.98]'
                                    onClick={ () => OrderStatusHandle(item._id, "done")}>
                                        จัดส่งสำเร็จ                               
                                </button>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>

            <div className='fixed bottom-0 z-50 h-24 min-w-full bg-white border-t flex items-center justify-center'>
                <button onClick={statusHandle} className={`w-20 h-20 text-white rounded-full shadow-lg ${isOpen ? 'bg-green-600' : 'bg-red-600'}`}>
                    {isOpen ? "ปิดร้าน" : "เปิดร้าน"}
                </button>
            </div>
            
        </div>
    );
}

export default HomeRestaurant;