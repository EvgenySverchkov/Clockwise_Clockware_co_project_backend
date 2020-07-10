const nodemailer = require('nodemailer');

exports.sendMessage = async function(req, res){
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
}
