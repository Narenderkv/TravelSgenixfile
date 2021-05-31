
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/i_am_narender",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
// then is know as a promise function
}).then(()=>{
    console.log("connection succesful with nodejs");
}).catch((er)=>
{
console.log("no connection");
})


