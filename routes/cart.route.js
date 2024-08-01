const express = require('express');
const {addToCart,getCartProduct,updateCartProduct,purchaseProduct,deleteCartProduct,subTotalProduct,searchProduct} = require('../controllers/cart.controller');
const router = express.Router();

router.post('/add-to-cart',addToCart )
router.get('/get-cart-product/:userId',getCartProduct)
router.put('/update-cart-product/:productId',updateCartProduct)
router.delete('/delete-cart-product/:productId/:userId',deleteCartProduct)
router.post('/sub-total-product/:userId',subTotalProduct)
router.patch('/purchase-product/:userId',purchaseProduct)
router.post('/search-product',searchProduct)


module.exports =  router;
