//always remember two thing 
//try and catch
//asyn await
import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB=async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`, )
        console.log(`\n MongoDB connected: ${connectionInstance.connection.host}`)
        console.log(DB_NAME)
        
    } catch (error) {
        console.log("MongoDB connection error ",error)
        process.exit(1)
    }
        
    }
    export {connectDB}