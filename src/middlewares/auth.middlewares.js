import jwt from"jsonwebtoken"
import { User } from "../models/user.models.js"
import { apierror } from "../utils/apierror.js"
import { asynchandler } from "../utils/asynchandler.js"

//to mark the flow of route we need to give next as a parameter too
export const verifyJWT= asynchandler(async(req,_,next)=>{ //we don't have to sent any respond to the servern that's why we used "_"
   
    //grabbing the token
    const token=req.cookies.acessToken||req.header("Authorization")?.replace("Bearer","")
    if(!token){
        throw new apierror(401,"unauthorized")
    }
    try {
        //decoding the token
        const decodedToken=jwt.verify(token,process.env.ACESS_TOKEN_SECRET)

        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
         if(!user){
            throw new apierror(401,"Unauthorized")
         }

         req.user=user
         next()

    } catch (error) {
       throw new apierror(401,error?.message||"Invalid access token") 
       
    }
})