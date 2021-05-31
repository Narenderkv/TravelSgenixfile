
//if you run only this code and put your correct email in the field of to and from the you get a mail 
const nodemailer=require("nodemailer")
var transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
        user:'narenderputhi98@gmail.com',
        pass:"LPU@2021"

    }

});
var mailOption={
    from:'narenderputhi98@gmail.com',
     to:'sankritya95@gmail.com',
     subject:'i am from nodejs side i send a mail to you, only for confirmation it is working fine  or not  ',
     text:"hello no_one this side narender"
}
transporter.sendMail(mailOption,function(error,info){
    if(error){
        console.log(error);
    }
    else{
        log("email has been sended to narender kumar",info.response);
    }
})