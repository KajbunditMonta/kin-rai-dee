import Navbar from './components/Navbar';
import homeImg from '../../src/Home.webp';
import acceptImg from '../../src/Accept.webp';
import cancelImg from '../../src/Cancel.png';
import profileImg from '../../src/profile.png';

import axios from 'axios';
import { useState, useEffect } from 'react';

function ProfileRestaurant () {

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

    const [shop, setShop] = useState(null);

    useEffect ( () => {

        const fetchShop = async () => {

            try {

                const res = await axios.get(`http://localhost:5000/api/RestaurantAuth/getShop/${username}`);

                if (res.data) {
                    setShop(res.data);
                }
    
            } catch (err) {
                console.error("Fetch Shop Error : " + err);
            }

        };

        if (username) {
            fetchShop();
            const interval = setInterval(fetchShop, 5000);
            return () => clearInterval(interval);
        }

    }, [username]);

    return(
        <div className = "min-h-screen flex flex-col bg-gray-100 font-notoSans">

            {shop ? (
                <div className='flex flex-col items-center pt-10'>
                    <div className='w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-white'>
                        <img 
                            className='w-full h-full object-cover'
                            src={`http://localhost:5000${shop.image}`}
                            alt='shop profile'
                        />
                    </div>
                    <h1 className='text-2xl font-bold mt-4'>{shop.shopName}</h1>

                    <div className='w-full pl-8 pt-10'>
                        <p className='text-gray-500'>ชื่อผู้ใช้</p>
                    </div>

                    <div className='pt-2'>
                        <div className='w-72 h-12 bg-gray-300 flex justify-center items-center rounded-xl'>
                            <span className='text-gray-600'>{shop.username}</span>
                        </div>
                    </div>

                    <div className='w-full pl-8 pt-10'>
                        <p className='text-gray-500'>Email</p>
                    </div>

                    <div className='pt-2'>
                        <div className='w-72 h-12 bg-gray-300 flex justify-center items-center rounded-xl'>
                            <span className='text-gray-600'>{shop.email}</span>
                        </div>
                    </div>

                    <div className='w-full pl-8 pt-10'>
                        <p className='text-gray-500'>Qr code พร้อมเพย์</p>
                    </div>

                    <div className='pt-2'>
                        <div className='w-44 h-44'>
                            <img className=''
                                src={`http://localhost:5000${shop.imagePP}`}
                                alt='qr promtpay'
                            />
                        </div>
                    </div>

                    <div className='pt-36'>
                        <div className='w-72 h-12 bg-gray-300 flex justify-center items-center rounded-xl'>
                            <span></span>
                        </div>
                    </div>

                </div>
            ) : (
                <div className='flex justify-center pt-20 text-gray-400'>กำลังโหลดข้อมูล...</div>
            )
            }

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

export default ProfileRestaurant;