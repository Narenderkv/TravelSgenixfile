const mongoose=require("mongoose")
const validator=require("validator")
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
  
    email:{
        type:String,
        require:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        minlength:10
    },
    password:{
        type:String,
        required:true,
        
      
    },
    confirmpassword:{
        type:String,
        required:true,
        

    },
    data:{
        type:Date,
        default:Date.now
    }
})



//for new register user we use difference schema that help lots




const Register=mongoose.model("Register",userSchema)

 module.exports=Register;
