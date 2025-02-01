import {apierror} from "../utils/apierror.js"
import {asynchandler} from "../utils/asynchandler.js";
import {apiresponse} from "../utils/apiresponse.js";
import{user} from "../models/user.models.js";
import {uploadcloudinary} from "../utils/cloudinary.js"

const registerUser=asynchandler(async(req,res)=>{
    const {fullname,email,username,password } =req.body

    //validation if all fields are there or not
    if([fullname,email,username,password].some((field)=>field?.trim()===""))
    {
        throw new apierror(400,"All fields are required");
        
    }
    //validation if user existed or not
    const existeduser=user.findOne({
        $or:[{email}, {username}]
    })
    if(existeduser){
        throw new apierror(409,"User already existed")
    }
    const avatarlocalpath=req.files?avatar[0]?.path;
    const coverlocalpath=req.files?coverimage[0]?.path;
    if(!avatarlocalpath){
        throw new apierror(400,"Avatar file is missing")
    }

})  
export {
    registerUser
}