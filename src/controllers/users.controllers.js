import { apierror } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import { apiresponse } from "../utils/apiresponse.js";
import { user } from "../models/user.models.js"; // Corrected import statement
import { uploadcloudinary } from "../utils/cloudinary.js";

const registerUser = asynchandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    // Validation if all fields are there or not
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new apierror(400, "All fields are required");
    }
    // Validation if user existed or not
    const existeduser = await user.findOne({
        $or: [{ email }, { username }]
    });
    if (existeduser) {
        throw new apierror(409, "User already existed");
    }
    const avatarlocalpath = req.files?.avatar[0]?.path;
    const coverlocalpath = req.files?.coverimage[0]?.path;
    if (!avatarlocalpath) {
        throw new apierror(400, "Avatar file is missing");
    }
    const avatar = await uploadcloudinary(avatarlocalpath);
    let coverimage = "";
    if (coverimage) {
        coverimage = await uploadcloudinary(coverimage);
    }
    const user = await user.create({
        fullname,
        email,
        avatar: avatar.url,
        coverimage: coverimage?.url || "",
        username: username.toLowerCase(),
        password,
    });
    // We have to validate the user
    const createduser = await user.findById(user._id).select(
        "-password -refreshToken"
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
