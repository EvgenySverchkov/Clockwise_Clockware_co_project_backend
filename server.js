const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require('nodemailer');
const mastersRouter = require('./routes/mastersRouter');
const townsRouter = require('./routes/townsRouter');
const ordersRouter = require('./routes/ordersRouter');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
///////////////////////////////////////////////////////////////////nodemailer////////////////////////////////////////////////


app.post("/send_message", async function(req, res){
  let testEmailAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
         user: "confirmationsendler@gmail.com",
         pass: "qwertyuiop1234!"
       }
     });
  let options = {
      from: '"Clockwise" <confirmationsendler@gmail.com>',
      to: req.body.email,
      subject: "Confirmation of an order",
      text: `You ordered master on ${req.body.date} ${req.body.time} in ${req.body.town}`,
      html: `You ordered master on ${req.body.date} ${req.body.time} in ${req.body.town}`
    }
  let result = await transporter.sendMail(options, function(err, info){
    if(err){
      res.json(err);
    }
    console.log("email is send");
    res.json(info);
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/', function (req, res) {
  res.send("Welcome to the server!!!")
});
app.use("/masters", mastersRouter);
app.use("/towns", townsRouter);
app.use("/orders", ordersRouter);

app.listen(process.env.PORT || 9000, function(){
  console.log("Server start")
})
