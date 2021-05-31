const mongoose=require("mongoose")
const validator=require("validator")
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    gmail:{
        type:String,
        required:true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid gmail")
            }
        }
    },
    phone:{
        type:Number,
        required:true,
        minlength:3
    },
    description:{
        type:String,
        required:true,
      
    },
    data:{
        type:Date,
        default:Date.now
    }
})
const User=mongoose.model("User",userSchema);
module.exports=User;
