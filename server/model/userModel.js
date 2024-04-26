import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
     usuario:{
         type: String,
         required: true,
         min: 3,
         max: 20,
         unique: true,
     },
     email:{
         type: String,
         required: true,
         max: 50,
         unique: true,
     },
     contraseña:{
         type: String,
         required: true,
         min: 6,
     },
     isAvatarImageSet:{
         type: Boolean,
         default: false,
     },
     avatarImage:{
         type: String,
         default: "",
     },
     conectado: {
         type: Boolean,
         default: false,
     }
    }
 )
 
export default mongoose.model("User", userSchema);