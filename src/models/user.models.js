import mongoose,{  Schema} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"


const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    avatar: { type: String },
    coverImage: { type: String },
    watchHistory: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    password: { type: String, required: true },
    refreshToken: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  //The callback function inside userSchema.pre should use a regular function (function) instead of an arrow function (=>), because this refers to the Mongoose document only in a regular function. Update to:
// javascript
// Copy code

  userSchema.pre("save", async function (next) {
    //this is used to check if the password is provided or not been updated then don't run the encryption method
    //good when we provide a newpassword it just bycrypt it ...really good middleware
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.ispasswordcorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
//creating the acess token


userSchema.methods.generateAccessToken=function(){
    //short lived access token
    return jwt.sign({ 
       _id:  this.id,
       username: this.username,
       email: this.email,
       fullName: this.fullName,
    }, process.env.ACESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
  );
}
userSchema.methods.generateRefreshToken=function(){
    //short lived access token
    return jwt.sign({ 
       _id:  this.id,
    }, process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
  );  
}
export const User=mongoose.model("User",userSchema)