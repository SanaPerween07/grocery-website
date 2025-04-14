import jwt from 'jsonwebtoken'

// http://localhost:4000/api/seller/login

export const sellerLogin = async(req, res) => {
    try{
        const {email, password} = req.body

    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token = jwt.sign({email} , process.env.JWT_SECRET, {expiresIn : "7d"})

        res.cookie('sellerToken' , token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict" ,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({success:true , message: "Logged In"})

    }

    else{
        return res.json({success: false, message: "Invalid Credentials"})
    }
}

    catch(error){
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}



// http://localhost:4000/api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try{
        return res.json({success:true ,user})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}


// export const isSellerAuth = (req, res) => {
//     const token = req.cookies.SellerToken;

//     if (!token) {
//         return res.status(401).json({ success: false, message: "No token, authorization denied" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.email = decoded.email;
//         if(!decoded){
//             res.status(400).json({ success: false, message: "Invalid token" });
//         }
//         return res.status(200).json({success:true , data: decoded?.email});

//     } catch (error) {
//         return res.status(401).json({ success: false, message: "Invalid token" });
//     }
// };




// http://localhost:4000/api/seller/logout
export const sellerLogout = async (req, res) => {
    try {
      res.clearCookie('sellerToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      });
      return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  };
  