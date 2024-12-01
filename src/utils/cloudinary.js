import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

 // Configure cloudinary
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadoncloudinary =async(localfilepath)=>{
    try {
        if(!localfilepath) return null
       const response=await cloudinary.uploader.upload(
            localfilepath,{
                resource_type: "auto",
            }
        )
        console.log("file uploaded on cloudinary .file src: "+response.url)
        //once the file is uploaded,we would like to delete it from our servers 
        fs.unlinkSync(localfilepath)
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath)
        return null
    }
}