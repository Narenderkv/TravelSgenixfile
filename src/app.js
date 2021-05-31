const express=require("express");
const path=require("path")
const hbs=require("hbs");
const app=express()
require("./db/conn")
const Register=require("./models/registers")
const Pay=require("./models/pay")
const User=require("./models/register")
const Gmaildb=require("./models/gmail")

app.use('/api/registers', require('./models/registers'));
app.use('/api/pay', require('./models/pay'));
app.use('/api/register', require('./models/register'));

const https = require("https");
const qs = require("querystring");


const checksum_lib = require("./Paytm/checksum");
const config = require("./Paytm/config");
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '333642631602-h2l1m29lfb5c1d0dta76nvv4so4bjeo4.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);
const port=process.env.PORT || 7000


const static_path=path.join(__dirname,'../public');
// path.join(__dirname,"../templates/images")
const template_path=path.join(__dirname,"../templates/views")
const partials_path=path.join(__dirname,"../templates/partials")
app.use(express.json());
app.use(express.static(static_path))
// app.use(express.urlencoded({extended:false})
app.set("view engine","hbs")
app.set("views",template_path)
hbs.registerPartials(partials_path);
app.use(express.urlencoded({extended:false}))
app.get('/',(req,res)=>
{
    res.render("Register")
})
app.get('/cart',(req,res)=>{
    res.render("cart");
})
app.get('/pay',(req,res)=>{
    res.render('pay')
})
app.get('/index',(req,res)=>{
    res.render("index")
})

// app.get('/Register',(req,res)=>{
//     res.render("Register")
// })
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get('/about',(req,res)=>{
    res.render('about')
})

app.get('/Package',(req,res)=>{
    res.render("package")
})
app.get('/Rishikesh',(req,res)=>{
    res.render('Rishikesh')
})
app.get('/Kedarnath',(req,res)=>{
    res.render('Kedarnath')
})
app.get('/Badrinath',(req,res)=>{
    res.render('Badrinath')
})
app.get('/glogin',(req,res)=>{
    res.render('glogin')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/Register',(req,res)=>{
    res.render('Register')
})
app.get('/logout',(req,res)=>{
    res.render('Register');
})
//start 

app.post('/glogin', (req,res)=>{
    let token = req.body.token;

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
      }
      verify()
      
      .then(()=>{
          res.cookie('session-token', token);
          res.send('success')
      })
      .catch(console.error);

})

app.get('/profile', checkAuthenticated, (req, res)=>{
    let user = req.user;
    res.render('index');
})

app.get('/protectedRoute', checkAuthenticated, (req,res)=>{
    res.send('This route is protected')
})

app.get('/logout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/login')

})


function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      Gmaildb.save()
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/login')
      })

}


//end





app.post('/Register',async(req,res)=>{
    try {
        // console.log(req.body.name)
        // res.send(req.body.name);
         const password=req.body.password;
         const cpassword=req.body.confirmpassword;
         if(password===cpassword)
         {
              const registeruser=new Register({
                  name:req.body.name,
                  email:req.body.email,
                  phone:req.body.phone,
                  password:password,
                  confirmpassword:cpassword
              })
              const registered=await registeruser.save();
              res.status(201).render("login")
         }else{
             res.send("password not matching")
         }

    } catch (error) {
        res.status(400).send("come from go here");
    }
})
app.post('/pay',async(req,res)=>{
    try{

        
        // res.send(req.body); 
         const paydata=new Pay(req.body);
         await paydata.save(); 
         res.status(201).render("index");
     } catch(error){
                  res.status(500).send(error);
         }
     
})
app.post("/contact",async(req,res)=>
{
    try{
    //    res.send(req.body); 
        const userData=new User(req.body);
        await userData.save(); 
        res.status(201).render("index");
    } catch(error){
                 res.status(500).send(error);
        }
    }
)
app.post('/login',async(req,res)=>{
    try {

       const email= req.body.email
       const password= req.body.password
       const usermail=await Register.findOne({email:email})
        // console.log(reg);

        //this is very very important to fend the password .password use to call password
       // res.send(reg.password);
       if(usermail.password===password)
       {
           res.status(400).render("index");
       }else{

        //this is not need to write because it provide email information to hacker
        //    res.send("password are not matching")
        res.send("incorrect detail")

    }
    } catch (error) {
        res.status(400).send("notfind")
    }
})

const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });



app.post("/paynow", [parseUrl, parseJson], (req, res) => {
  // Route for making payment
 
    var paymentDetails = {
   
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    amount: req.body.amount
}
// await paymentDetails.save()
// }catch (error) {
//     res.status(400).send("come pay from here");
// }

if(!paymentDetails.amount || !paymentDetails.name || !paymentDetails.email || !paymentDetails.phone) {
    res.status(400).send('Payment failed')
} else {
    var params = {};
    params['MID'] = config.PaytmConfig.mid;
    params['WEBSITE'] = config.PaytmConfig.website;
    params['CHANNEL_ID'] = 'WEB';
    params['INDUSTRY_TYPE_ID'] = 'Retail';
    params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
    params['CUST_ID'] = paymentDetails.name;
    params['TXN_AMOUNT'] = paymentDetails.amount;
    params['CALLBACK_URL'] = 'http://localhost:3000/callback';
    params['EMAIL'] = paymentDetails.email;
    params['MOBILE_NO'] = paymentDetails.phone;


    checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
        var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
        // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

        var form_fields = "";
        for (var x in params) {
            form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
        }
        form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
        res.end();
    });
}
});
app.post("/callback", (req, res) => {
  // Route for verifiying payment

  var body = '';

  req.on('data', function (data) {
     body += data;
  });

   req.on('end', function () {
     var html = "";
     var post_data = qs.parse(body);

     // received params in callback
     console.log('Callback Response: ', post_data, "\n");


     // verify the checksum
     var checksumhash = post_data.CHECKSUMHASH;
     // delete post_data.CHECKSUMHASH;
     var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
     console.log("Checksum Result => ", result, "\n");


     // Send Server-to-Server request to verify Order Status
     var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};

     checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {

       params.CHECKSUMHASH = checksum;
       post_data = 'JsonData='+JSON.stringify(params);

       var options = {
         hostname: 'securegw-stage.paytm.in', // for staging
         // hostname: 'securegw.paytm.in', // for production
         port: 443,
         path: '/merchant-status/getTxnStatus',
         method: 'POST',
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Content-Length': post_data.length
         }
       };


       // Set up the request
       var response = "";
       var post_req = https.request(options, function(post_res) {
         post_res.on('data', function (chunk) {
           response += chunk;
         });

         post_res.on('end', function(){
           console.log('S2S Response: ', response, "\n");

           var _result = JSON.parse(response);
             if(_result.STATUS == 'TXN_SUCCESS') {
                 res.send('payment sucess')
             }else {
                 res.send('payment failed')
             }
           });
       });

       // post the data
       post_req.write(post_data);
       post_req.end();
      });
     });
});

app.listen(port,()=>{
    console.log(`server is runing at ${port} port number`);
})