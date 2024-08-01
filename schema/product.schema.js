const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
    type: String,
    required: true,
  },
 category:{
    type: String,
    required: true
  },
  processor:{
    type: String,
    required: true
  },
  image_url:{
    type:String,
    required: true
  },
  discounted_price:{
    type: String,
  },
  original_price:{
    type: String,
    required: true
  },
  display:{
    type: String,

  },
  storage:String,
  memory:String,
  OS: String,
  graphics_card: String,
  rating:Number

  
},{timestamps:true,versionKey:false});

const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;
