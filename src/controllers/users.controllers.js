import { apierror } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import { apiresponse } from "../utils/apiresponse.js";
import { User } from "../models/user.models.js"; // Corrected import statement
import { uploadcloudinary } from "../utils/cloudinary.js";
import dotenv from 'dotenv';
dotenv.config();

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

export {
    registerUser
};
