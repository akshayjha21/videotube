import express from "express";
import cors from "cors"
import { healthcheck } from "./controllers/healthcheck.controllers.js";
import cookieParser from 'cookie-parser'

const app = express();

app.use(//it act as a middleware which allows only selected website to work with
    cors({
        origin:process.env.CORS_ORIGIN,
        credentials:true
    })
)
//common middlewares

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))//can acces public folders 
app.use(cookieParser())


// import routes
import healthcheckrouter from "./routes/healthcheck.routes.js";
import userrouter from "./routes/user.routes.js";



//using the route
app.use("/api/v1/healthcheck",healthcheckrouter)
app.use("/api/v1/user",userrouter)


export { app };
