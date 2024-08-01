const bcrypt = require('bcrypt');
const RegisterModel = require('../schema/register.schema');
const jwt =  require('jsonwebtoken')
const userRegister = async (req, res) => {
    const { email, password, firstname, lastname } = req.body;

    try {
        if (!email || !password || !firstname || !lastname) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Find the existing user
        const existingUser = await RegisterModel.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ success: false, message: 'User already registered' });
        }

        // Password length
        if (password.length < 6) {
            return res.status(401).json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        const saltRounds = 7;
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err) return res.status(500).json({ success: false, message: 'Error hashing password' });

            await RegisterModel.create({
                email,
                password: hash,
                firstname,
                lastname
            });
            return res.status(201).json({ success: true, message: 'User created successfully!' });
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


const userLogin = async (req,res)=>{
    const {email,password} = req.body;
    try{
        if(!email || !password){
            return res.send("all field are required")
        }
        const existingUser = await RegisterModel.findOne({email})
        if(!existingUser){
            return res.status(401).json({success:false,message:'user not found'})
        }
        bcrypt.compare(password,existingUser.password, async(err,result)=>{
            if(err) return res.send('something went wrong');
            if(result){
                const payload ={
                    _id: existingUser._id,
                    firstname:existingUser.firstname,
                    email,
                    password,
                    role : existingUser?.role
                }
             const token =  await jwt.sign(payload,process.env.SECRET_KEY);
             return res.status(201).json({success:true,message:'user login successfully !',token,payload})

            }else{
                res.send('wrong credentials')
            }
        })
       

    }
    catch(err){
        return res.status(401).json({success:false,message:err.message})
    }
}
module.exports = { userRegister ,userLogin};
