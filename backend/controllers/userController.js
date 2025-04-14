import User from '../models/User.js';
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

//    http://localhost:4000/api/user/register

export const register = async(req,res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.json({success:false , message:'Missing Details'})
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            name, email, password:hashedPassword
        })

        if (!user) {
            return res.json({ success: false, message: 'User creation failed' });
          }

        const token = jwt.sign({id: user._id} , process.env.JWT_SECRET, {expiresIn: "7d"})

        res.cookie('token' , token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"? "true" : "false",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" ,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.json({success:true, token , user:{name : user.name, email: user.email}})
    }
    catch(error){
        console.log(error)
        res.json({success:false, message: error.message})
    }

}




//    http://localhost:4000/api/user/login

export const login = async(req,res) => {
    try{
        const{email, password} = req.body;

        if(!email || !password){
            return res.json({success: false, message: "Email and password are required"})
        }

        const user = await User.findOne({email})

        if(!user){
            return res.json({success:false, message: 'Invalid email or password'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch){
            const token = jwt.sign({id: user._id} , process.env.JWT_SECRET, {expiresIn: "7d"})

            res.cookie('token' , token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" ,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })

            res.json({success:true, token , user:{name : user.name, email: user.email}})
        }
        else{
            return res.json({success:false, message: 'Invalid Credentials'})
        }
    }

    catch(error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
}


//  http://localhost:4000/api/user/is-auth

export const isAuth = async (req, res) => {
    try{
        const userId = req.userId;
        const user = await User.findById(userId)
    .select("-password");

    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }
    
        return res.json({success:true ,user})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}


// export const isAuth = async (req, res) => {
//     try {
//         const userId = req.userId;
        
//         // Convert to ObjectId with 'new'
//         const user = await User.findOne({ 
//             _id: new mongoose.Types.ObjectId(userId) 
//         }).select("-password");

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         return res.json({
//             success: true,
//             user: {
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
//     } catch (error) {
//         console.error("isAuth Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error: " + error.message
//         });
//     }
// };




// http://localhost:4000/api/user/logout

export const logout = async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" ,
        })
        return res.json({success:true , message: "Logged Out"})
    }
    catch(error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
}




