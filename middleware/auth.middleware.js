const jwt = require('jsonwebtoken');

const auth = (req,res,next)=>{
    const token =  req.headers.authorization && req.headers.authorization.split(" ")[1]
    if(token){
        try {
            jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
                if(err){
                    return res.status(401).json({error:"Invalid token"})
                }
                req.user = decoded
               
                next()
    
            })
        } catch (error) {
            res.status(401).json({error:error.message})
        }
       
    }
    else{
        return res.status(401).json({error:"Token is required"})
    }

}
module.exports = auth