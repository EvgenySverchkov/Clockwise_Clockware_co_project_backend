const nodemailer = require("nodemailer");

class MailerController {
  constructor() {
    this.sendMessage = this.sendMessage.bind(this);
  }
  sendMessage(req, res) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "confirmationsendler@gmail.com",
        pass: "qwertyuiop1234!",
      },
    });
    let options = {
      from: '"Clockwise" <confirmationsendler@gmail.com>',
      to: req.body.email,
      subject: "Confirmation of an order",
      text: `You ordered master on ${req.body.date} ${req.body.time} in ${req.body.town}`,
      html: `You ordered master on ${req.body.date} ${req.body.time} in ${req.body.town}`,
    };
    return transporter.sendMail(options, function (err, info) {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).json(info);
    });
  }
}

module.exports = new MailerController();
