import { Router } from "express";
import { registerUser,logoutUser } from "../controllers/users.controllers.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router=Router();

//we have use multer to deal with img and all
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser
);

//secured routes

router.route("/logout").post(verifyJWT,logoutUser)
export default router