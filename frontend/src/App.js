import LoginRegister from './pages/LoginRegister.js';
import ForgotPassword from './pages/ForgotPassword.js';
import NewPassword from './pages/NewPassword.js';
import RegisterRole from './pages/RegisterRole.js';
import RegisterCustomer from './pages/customer/RegisterCustomer.js';
import RegisterRestaurant from './pages/restaurant/RegisterRestaurant.js';
import HomeCustomer from './pages/customer/HomeCustomer.js';
import HomeRestaurant from './pages/restaurant/HomeRestaurant.js';
import MenuManagement from './pages/restaurant/MenuManagement.js';
import AddMenu from './pages/restaurant/AddMenu.js';
import OrderCustomer from './pages/customer/OrderCustomer.js';
import RestaurantMenu from './pages/customer/RestaurantMenu.js';
import EditMenu from './pages/restaurant/EditMenu.js';
import Orderfood from './pages/customer/Orderfood.js';  
import Cartorder from './pages/customer/Cartorder.js';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<LoginRegister />} />
        <Route path = "/ForgotPassword" element = {<ForgotPassword />} />
        <Route path = "/NewpassWord" element = {<NewPassword />}/>
        <Route path = "/RegisterCustomer" element = {<RegisterCustomer />} />
        <Route path = "/RegisterRole" element = {<RegisterRole />} />\
        <Route path = "/RegisterRestaurant" element = {<RegisterRestaurant />}/>
        <Route path = "/HomeCustomer" element = {<HomeCustomer/>}/>
        <Route path = "/HomeRestaurant" element = {<HomeRestaurant/>}/>
        <Route path = "/MenuManagement" element = {<MenuManagement/>}/>
        <Route path = "/AddMenu" element = {<AddMenu/>}/>
        <Route path = "/OrderCustomer" element = {<OrderCustomer/>}/>
        <Route path = "/RestaurantMenu/:id" element = {<RestaurantMenu/>}/>
        <Route path = "/EditMenu" element = {<EditMenu />}/>
        <Route path="/order/:id/:foodId" element={<Orderfood />} />
        <Route path="/cart/:id" element={<Cartorder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
