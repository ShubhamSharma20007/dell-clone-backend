const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId:String,
    product_cart_count:{
        type: Number,
        default: 1
    },
    title: {
        type: String,
    },
    category: {
        type: String,

    },
    processor: {
        type: String,

    },
    image_url: {
        type: String,

    },
    discounted_price: {
        type: String,
    },
    original_price: {
        type: String,

    },
    display: {
        type: String,

    },
    storage: String,
    memory: String,
    OS: String,
    graphics_card: String,


}, { timestamps: true, versionKey: false });

const CartModel = mongoose.model('cart', CartSchema);

module.exports = CartModel;
