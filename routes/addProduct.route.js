const express = require('express');
const {addProduct,getAllProducts,getProductById} = require('../controllers/addProduct.controller')
const router = express.Router();
const auth  = require('../middleware/auth.middleware')
router.post('/add-product',auth,addProduct)
router.get('/get-all-product',getAllProducts)
router.get('/get-product/:id',getProductById)


module.exports =  router;
