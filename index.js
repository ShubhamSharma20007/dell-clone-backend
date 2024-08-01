require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const connecdb = require('./db/dbConnect')
const userRoutes = require('./routes/user.route')
const productRoutes = require('./routes/addProduct.route');
const cartRoutes = require('./routes/cart.route');
const auth = require("./middleware/auth.middleware");
connecdb()

// Middleware to parse JSON requests
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// Middleware to handle CORS errors
app.use(cors())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})


//  router middleware 

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/cart', cartRoutes)



// get current user
app.get('/api/v1/current-user',auth,async(req,res)=>{
  try {
    res.json({user: req.user})
  } catch (error) {
    res.status(500).json({error: 'Server Error'})
  }
})


// server listing middleware and  listeners
const port = process.env.PORT || 8080
app.listen(port,function(){
    console.log(`Server is running on port ${port}`)
})