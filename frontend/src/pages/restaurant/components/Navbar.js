import { useNavigate } from 'react-router-dom';

const Navbar = ({ isOpen, statusHandle, homeImg, acceptImg, cancelImg, profileImg }) => {

    const navigate = useNavigate();

    return (
        <div className='fixed bottom-0 z-50 h-24 w-full bg-white border-t flex justify-around items-center px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]'>
            
            <button onClick={() => navigate('/HomeRestaurant')} className='flex flex-col items-center group'>
                <img className='w-12 h-12 group-active:scale-90 transition-transform' src={homeImg} alt='Home' />
                <p className='text-[10px] mt-1'>หน้าหลัก</p>
            </button>

            <button onClick={() => navigate('/AcceptOrder')} className='flex flex-col items-center group'>
                <img className='w-12 h-12 group-active:scale-90 transition-transform' src={acceptImg} alt='Accept' />
                <p className='text-[10px] mt-1'>ยืนยันแล้ว</p>
            </button>

            <div className='relative -top-5'>
                <button 
                    onClick={statusHandle} 
                    className={`w-16 h-16 text-white rounded-full shadow-2xl font-bold text-xs transition-colors ${isOpen ? 'bg-green-600' : 'bg-red-600'}`}
                >
                    {isOpen ? "เปิดร้าน" : "ปิดร้าน"}
                </button>
            </div>

            <button onClick={() => navigate('/RejectOrder')} className='flex flex-col items-center group'>
                <img className='w-12 h-12 group-active:scale-90 transition-transform' src={cancelImg} alt='Reject' />
                <p className='text-[10px] mt-1'>ปฏิเสธแล้ว</p>
            </button>

            <button onClick={() => navigate('/Profile')} className='flex flex-col items-center group'>
                <img className='w-12 h-12 group-active:scale-90 transition-transform' src={profileImg} alt='Profile' />
                <p className='text-[10px] mt-1'>โปรไฟล์</p>
            </button>

        </div>
    );
}

export default Navbar;