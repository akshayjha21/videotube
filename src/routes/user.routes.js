import { Router } from "express";
import { registerUser } from "../controllers/users.controllers.js";
import {upload} from "../middlewares/multer.middleware.js";


const router=Router();

//we have use multer to deal with img and all
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxcount:1
        },
        {
            name:"coverimage",
            maxcount:1
        }
    ]  
    )
    ,registerUser)
export default router 