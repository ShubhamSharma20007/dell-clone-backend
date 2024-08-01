const mongoose = require('mongoose');

// const CartItemSchema = new mongoose.Schema({
//   product: {
    
//     required: true,
//   },
//   product_cart_count: {
//     type: Number,
//     default: 1,
//   },
// });
const RegisterSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    default: 'user',
  },
  cart: {
    type: [{
      product: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        required: true
      },
      product_count: {
        type: Number,
        default: 1,
        required: true
      }
    }],
    default: []
  }
}, { timestamps: true, versionKey: false });

const RegisterModel = mongoose.model('Register', RegisterSchema);

module.exports = RegisterModel;
