const CartModel = require('../schema/cart.schema');
const RegisterModel = require('../schema/register.schema');
const ProductModel = require('../schema/product.schema');
const addToCart = async (req, res) => {
    const userId = req.query.userId;
    const { product, productCount } = req.body;
    try {

      const user = await RegisterModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "Login first to add to cart items" });
      }

      const cartItem = user.cart.find(item => item.product.toString() === product._id);
      if (cartItem) {
        cartItem.product_count += productCount || 1;
      } else {

        user.cart.push({ product: product, product_count: productCount || 1 });
      }
  
      await user.save();
  
      res.status(200).json({ success: true, message: 'Product added to cart successfully', cart: user.cart });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  


  const getCartProduct = async (req, res) => {

    try {
        // Find the user's cart
        const addProduct = await RegisterModel.findById(req.params.userId)
            .select('cart')
            .populate('cart');
        
        if (!addProduct) {
            return res.status(404).json({ message: 'No product found' });
        }

        // Fetch the cart products
        const cartItems = addProduct.cart;


        const productIds = cartItems.map(item => item.product);


        const products = await ProductModel.find({ _id: { $in: productIds } });

    
        const productDetailsMap = products.reduce((map, product) => {
            map[product._id] = product;
            return map;
        }, {});

        // Combine cart items with product details
        const cartWithDetails = cartItems.map(item => ({
            ...item.toJSON(), // Convert mongoose document to plain object
            productDetails: productDetailsMap[item.product]
        }));

        res.status(200).json({ success: true, products: cartWithDetails });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
};




// update card product 

const updateCartProduct = async (req, res) => {
	const { productId } = req.params;
	const { productCount } = req.body;

	try {
        if(productCount >4){
            return res.status(400).json({ success: false, message: 'Product count should not exceed 4' });
        }

        const allProducts = await RegisterModel.findById(req.body.userId).select('cart').populate('cart')
        const carts = allProducts.cart;
        

        // find the product count and update it 
        const findProducts = carts.find((cart)=>cart.product.toString() === productId)
        
        if(!findProducts){
            return res.status(404).json({ success: false, message: 'No product found' });
        }
        
        findProducts.product_count = productCount;

        await allProducts.save();
    
		// const updateProductCount = await RegisterModel.findByIdAndUpdate(
		// 	{ _id: productId },
		// 	{ $set: { product_cart_count: productCount } },
		// 	{ new: true }
		// );

		// if (!updateProductCount) {
		// 	return res.status(404).json({ message: 'No product found', success: false });
		// }

		res.status(200).json({ message: 'Product count updated successfully', success: true });
	} catch (error) {
		res.status(500).json({ error: error.message, success: false });
	}
};


const deleteCartProduct =async(req,res)=>{
    const {productId,userId } = req.params;
   
   
    try {
        // const deleteProduct = await CartModel.findByIdAndDelete({_id:productId})
        // if(!deleteProduct){
        //     return res.status(404).json({success:false,message:'No product found'})
        // }
        const deleteProduct = await RegisterModel.findById(userId)
            .select('cart')
            .populate('cart');
        
        if (!deleteProduct) {
            return res.status(404).json({ success: false, message: 'No product found' });
        }

        const findProduct =  deleteProduct.cart.find(val=> val.product.toString() === productId);
        if(!findProduct){
            return res.status(404).json({success:false,message:'No product found'})
        }
        
        deleteProduct.cart.splice(deleteProduct.cart.indexOf(findProduct),1);
        await deleteProduct.save()
        res.status(201).json({success:true,message:'Product deleted successfully',deleteProduct})
    } catch (error) {
        res.status(500).json({success:false,error:error.message,success:false})
    }
 
}


// summray total product

const subTotalProduct = async (req, res) => {
    try {
        // Fetch the cart data for the given user
        const subTotalPrice = await RegisterModel.findById(req.params.userId)
            .select('cart')
            .populate('cart');

        if (!subTotalPrice) {
            return res.status(404).json({ message: 'No product found' });
        }

        // Fetch the cart products
        const grandTotalItems = subTotalPrice.cart;
        const productIds = grandTotalItems.map(item => item.product);

        // Fetch product details
        const products = await ProductModel.find({ _id: { $in: productIds } });

        const productDetailsMap = products.reduce((map, product) => {
            map[product._id] = product;
            return map;
        }, {});

        // Combine cart items with product details
        const cartWithDetails = grandTotalItems.map(item => ({
            ...item.toJSON(), // Convert mongoose document to plain object
            productDetails: productDetailsMap[item.product]
        }));

        // Calculate the subtotal
        const totalPrice = cartWithDetails.reduce((total, item) => {
            const product = item.productDetails;
            const originalPrice = parseFloat(product.original_price);
            const discountedPrice = parseFloat(product.discounted_price);
            const priceDifference = originalPrice - discountedPrice;
            const itemTotal = priceDifference * item.product_count;
            return total + itemTotal;
        }, 0);



        return res.status(200).json({ products: cartWithDetails, totalPrice,productCount :products.length,success:true });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error:error,success:false });
    }
};



// handle purchase of a product

const purchaseProduct = async (req, res) => {
    try {
        const purchaseProduct = await RegisterModel.findByIdAndUpdate(
            req.params.userId,
            { $set: { cart: [] } },
            { new: true }
        );

        if (!purchaseProduct) {
            return res.status(404).json({ success: false, message: 'No product found' });
        }

        res.status(200).json({ success: true, message: 'Purchase successful', purchaseProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error });
    }
};



//  product search funtionlity

const searchProduct = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm?.trim();
      

        if (!searchTerm) {
            return res.status(400).json({ success: false, message: 'Search term is required', products: [] });
        }

        const products = await ProductModel.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } }
            ]
        });

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found', products: [] });
        }

        return res.status(200).json({ success: true, products });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


module.exports = {addToCart,getCartProduct,updateCartProduct,deleteCartProduct,subTotalProduct,purchaseProduct,searchProduct};
