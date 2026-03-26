import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import backImg from '../../src/back.jpg';
import axios from "axios";
import Swal from 'sweetalert2';

function Cartorder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(`cart_${id}`);
        setCart(saved ? JSON.parse(saved) : []);
    }, [id]);

    const updateQty = (foodId, delta) => {
        setCart((prev) => {
            const updated = prev
                .map((item) =>
                    item.foodId === foodId
                        ? { ...item, quantity: item.quantity + delta, totalPrice: item.price * (item.quantity + delta) }
                        : item
                )
                .filter((item) => item.quantity > 0);
            localStorage.setItem(`cart_${id}`, JSON.stringify(updated));
            return updated;
        });
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    const handleOrder = async () => {
        if (!address.trim()) {
            Swal.fire({
                title: 'ข้อผิดพลาด',
                text: 'กรุณากรอกที่อยู่จัดส่ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#F97316', 
                shape: 'rounded-xl'
            });
            return;
        }
        if (cart.length === 0) {
            alert("ตะกร้าว่างเปล่า");
            return;
        }
        setLoading(true);
        const User = JSON.parse(localStorage.getItem('user'));
        const customerName = User ? User.username : "ลูกค้า";
        try {
            await axios.post(`http://localhost:5000/api/OrderMenu/create`, {
                restaurantId: id,
                customerName: customerName,
                items: cart,
                address,
                totalPrice,
            });
            localStorage.removeItem(`cart_${id}`);
            Swal.fire({
                text: 'สั่งอาหารสำเร็จ',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#F97316', 
                shape: 'rounded-xl'
            });
            navigate(`/OrderCustomer`);
        } catch (err) {
            console.error("Order error:", err);
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-36">
            <div className="bg-white shadow-sm p-4 flex items-center gap-3">
                <button onClick={() => navigate(-1)}>
                    <img className="w-9" src={backImg} alt="backIcon" />
                </button>
                <h1 className="text-lg font-bold text-gray-800">ตะกร้าสินค้า</h1>
            </div>
            <div className="p-4 space-y-4">
                {cart.length === 0 ? (
                    <div className="text-center text-gray-400 py-16">
                        <button onClick={() => navigate(-1)} className="mt-4 text-orange-500 font-semibold underline">
                            เพิ่มเมนู
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {cart.map((item) => (
                            <div key={item.foodId} className="bg-white rounded-2xl p-3 flex items-center gap-3">
                                <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
                                    <img
                                        src={item.foodImage ? `http://localhost:5000${item.foodImage}` : "https://via.placeholder.com/150"}
                                        alt={item.foodName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-800 truncate">{item.foodName}</h3>
                                    {item.note ? (
                                        <p className="text-xs text-gray-400 truncate">{item.note}</p>
                                    ) : null}
                                    <p className="text-orange-500 font-bold text-sm mt-0.5">฿{item.totalPrice.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => updateQty(item.foodId, -1)}
                                        className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-lg active:scale-95"
                                    >
                                        −
                                    </button>
                                    <span className="w-5 text-center font-bold text-gray-800">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQty(item.foodId, 1)}
                                        className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-lg active:scale-95"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {cart.length > 0 && (
                    <div className="p-4">
                        <h3 className="font-bold text-gray-700 mb-2">ที่อยู่จัดส่ง</h3>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="กรอกที่อยู่สำหรับจัดส่งอาหาร..."
                            className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
                            rows={3}
                        />
                    </div>
                )}
                {cart.length > 0 && (
                    <div className="p-4">
                        <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-800">
                            <span>รวมทั้งหมด</span>
                            <span className="text-orange-500">฿{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4">
                    <button
                        onClick={handleOrder}
                        disabled={loading}
                        className="w-full text-white bg-orange-500 py-3 rounded-2xl font-bold text-center flex justify-center px-6"
                    >
                        <h3>ยืนยัน</h3>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cartorder;