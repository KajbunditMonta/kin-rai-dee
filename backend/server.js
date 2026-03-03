import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import CustomerAuth from './routes/CustomerAuth.js';
import RestaurantAuth from './routes/RestaurantAuth.js';
import ResetPassword from './routes/ResetPassword.js';
import OrderMenu from './routes/OrderMenu.js';

import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();
const mongo_uri = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/api/CustomerAuth', CustomerAuth);
app.use('/api/RestaurantAuth', RestaurantAuth);
app.use('/uploads', express.static('uploads'));
app.use('/api/OrderMenu', OrderMenu);
app.use('/api/ResetPassword', ResetPassword);

mongoose.connect(mongo_uri)
    .then( () => console.log("MongoDB Connected..."))
    .catch( err => console.log(err));

app.get('/', (req, res) => {
    res.send("Kin Rai Dee API is running...");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));