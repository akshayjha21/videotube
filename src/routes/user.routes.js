import { Router } from "express";
import { registerUser } from "../controllers/users.controllers.js";
import {upload} from "../middlewares/multer.middleware.js";


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
export default router