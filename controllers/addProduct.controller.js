const ProductModel = require('../schema/product.schema')


const addProduct = async(req,res)=>{
    const { products ,rating} = req.body;


    const {title,category,processor,image_url,discounted_price,original_price,display,storage,memory,graphics_card,OS} = JSON.parse(products);
    if(!title || !category || !image_url || !original_price || !display){
        return res.status(400).json({message: 'Please fill the missing fields'})
    }
    await ProductModel.create({title,category,processor,image_url,discounted_price,original_price,display,storage,memory,graphics_card,OS,rating})
    
    return res.status(200).json({message:'Product created successfully',success:true})
}

//  get all products

const getAllProducts = async(req,res)=>{
    const categories = req.query.category
  
    if(categories != "products"){
        const products = await ProductModel.find({
            category : categories
        })
        return res.status(200).json({data:products,success:true})
    }

    const products = await ProductModel.find()
    return res.status(200).json({data:products,success:true})    
}




// find products base on Id 

const getProductById = async (req, res) => {
 
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ data: product, success: true });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};


module.exports = {addProduct,getAllProducts,getProductById}