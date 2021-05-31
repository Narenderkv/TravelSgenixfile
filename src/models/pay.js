// const { unique } = require("jquery");
const mongoose=require("mongoose")
const validator=require("validator")
const Payments=mongoose.Schema({
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
       
        amount:{
            type:Number,
            require:true,
       
        }
    
    })
    
    // const User2=mongoose.model("User2",userSchema);
    const Pay=mongoose.model("Pay",Payments);
    module.exports=Pay;
    // module.exports={
    // User:User,
    // Register:Register
    // };
    