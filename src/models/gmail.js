const mongoose=require("mongoose")
const validator=require("validator")
const gmailschema=mongoose.Schema({
   
  
    email:{
        type:String,
        
        unique:true
    },
    name:{
        type:String

    }
   
})



const Gmaildb=mongoose.model("Gmaildb",gmailschema)

 module.exports=Gmaildb;
