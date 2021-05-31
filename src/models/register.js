// const { unique } = require("jquery");
const mongoose=require("mongoose")
const validator=require("validator")
const forregister=mongoose.Schema({
        name:{
            type:String,
            required:true,
            minlength:3
        },
        gmail:{
            type:String,
            required:true,
            unique:true,
            validator(value){
                if(!validator.isEmail(value)){
                    throw new Error("invalid gmail")
                }
            }
        },
        phone:{
            type:Number,
            required:true,
            minlength:3,
            unique:true,
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
    
    // const User2=mongoose.model("User2",userSchema);
    const User=mongoose.model("User",forregister);
    module.exports=User;
    // module.exports={
    // User:User,
    // Register:Register
    // };
    