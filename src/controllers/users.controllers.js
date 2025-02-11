import { apierror } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import { apiresponse } from "../utils/apiresponse.js";
import { User } from "../models/user.models.js"; // Corrected import statement
import { uploadcloudinary } from "../utils/cloudinary.js";
import dotenv from 'dotenv';
dotenv.config();
//now we have to create a function to generate the access token and refresh token
const generateAccessandRefereshToken=async(userId)=>{
try {
         //firing up the query to find the user
         const user=await User.findById(userId);
         if(!user){
            throw new apierror(404,"User not found");
         }
         //now using this user we will generate acess token and referesh token
        const acessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
    
        user.refreshToken=refreshtoken;
        await user.save({validateBeforeSave:false});
        return {acesstoken,refreshtoken};
} catch (error) {
    console.log("Error generating access and refresh token:", error);
    throw new apierror(500, "Error generating access and refresh token");
    
}
}
const registerUser = asynchandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    // Log the request body and files for debugging
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    // Validation if all fields are there or not
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new apierror(400, "All fields are required");
    }
    // Validation if user existed or not
    const existeduser = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (existeduser) {
        throw new apierror(409, "User already existed");
    }
    console.warn(req.files);
    const avatarlocalpath = req.files?.avatar?.[0]?.path;
    const coverlocalpath = req.files?.coverimage?.[0]?.path;

    let avatar;
    try {
        avatar = await uploadcloudinary(avatarlocalpath);
        console.log("Avatar URL:", avatar.url); // Moved this line here
    } catch (error) {
        console.log("Error uploading avatar to Cloudinary:", error);
        throw new apierror(500, "Error uploading avatar to Cloudinary");
    }

    let coverimage;
    try {
        coverimage = await uploadcloudinary(coverlocalpath);
        console.log("Cover Image URL:", coverimage);
    } catch (error) {
        console.log("Error uploading coverimage to Cloudinary:", error);
        throw new apierror(500, "Error uploading coverimage to Cloudinary");
    }

    const user = await User.create({
        fullname,
        email,
        avatar: avatar.url,
        coverimage: coverimage?.url || "",
        username: username ? username.toLowerCase() : "", // Updated line
        password,
    });
    // We have to validate the user
    const createduser = await User.findById(user._id).select(
        "-password -refreshToken" // Updated line
    );
    if (!createduser) {
        throw new apierror(500, "Something went wrong while registering a user");
    }
    return res
        .status(201)
        .json(new apiresponse(200, createduser));
});
//now we are done with the user registration 
//now we have to work on the login part
//we have to create a login controller
//so first we need an instance of user model and we have to find the user by which we can grab the accesstooken and refreshtoken

//login user

const loginUser=asynchandler(async(req,res)=>{
    //get user para from user body
    const{email,username,password}=req.body;
    //validating the user
    if(!email){
        throw new apierror(400,"email is required")
    }
    const user = await User.findOne({
        $or: [{ email }, { username }]
    });
    if(!user){
        throw new apierror(400,"user doesn't exist")
    }
    const ispasswordValid=await user.ispasswordcorrect(password)
    if(!ispasswordValid){
        throw new apierror("Invalid credentials")
    }
    //generating acess and refresh token
    const {acessToken,refreshToken}= await generateAccessandRefereshToken(user._id);
    
    const loggedInUser=await user.findById(user._id)
    .select("-password -refreshToken");
//creating cookies
    const options={
        httpOnly:true,
        secure: process.env.NODE_ENV==="production"
    }
    return res
        .status(200)
        .cookie("acessToken",acessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new apiresponse(200,loggedInUser,"User Loged in succesfully"))
    
})

const refreshAcessToken=asynchandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken //getting the refresh token from body or cookies
    if(!incomingRefreshToken){
        throw new apierror(401,"refresh token is required")
    }
    //if refresh tokens are available then we will fit in try-catch block
    try {
        const decodedToken=JsonWebTokenError.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new apierror(401,"Invalid referesh token")
        }
        if(incomingRefreshToken!==user?.refreshToken){
            throw new apierror(401,"Invalid refresh token")
        }
        const options={
            httpOnly:true,
            secure:process.env.NODE_ENV="production"
        }
        const {acessToken,refereshToken:newRefreshToken}=
        await generateAccessandRefereshToken(user._id)

        return res
        .status(200)
        .cookie("accestoken",acessToken,options)
        .cookie("refereshtoken",newRefreshToken,options)
        .json(new apiresponse(200,{acessToken,refreshToken:newRefreshToken},"Acess token refreshed successfully"))
        
    } catch (error) {
        throw new apierror(500,"something went wrong while refreshing acess token")
        
    }
})
export {
    registerUser,
    loginUser,
    refreshAcessToken
};
