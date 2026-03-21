import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    restaurantId: {type: String, require: true},
    customerName: {type: String, require: true},
    items: {type: Array, require: true},
    address: {type: String, require: true},
    totalPrice: {type: Number, require: true},
    OrderStatus: {type: String, default: ""},
    RejectReason: {type: String, default: ""},
    paySlip: {type: String, require: true},
    DeriveredPT: {type: String, require: true},
    createAt: {type: Date, default: Date.now}
});

export default mongoose.model("Order", OrderSchema);