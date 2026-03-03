import mongoose from "mongoose";

const restaurantSchema = mongoose.Schema({
    shopName : { type : String, required: [true, 'Please Enter Username'], unique: true},
    username : { type : String, required: [true, 'Please Enter Username'], unique: true},
    email : { type : String, required: [true, 'Please Enter Email'], unique: true},
    password : { type : String, required: [true, 'Please Enter Password'] },
    type : {type : String, default : "restaurant"},
    createdAt : {type : Date, default : Date.now},
    isOpen: { type: Boolean, default: false},
    image: { type: String, default: "" },
    resetPasswordToken: String,
    resetPasswordExpired: Date
});

export default mongoose.model('Restaurant', restaurantSchema);