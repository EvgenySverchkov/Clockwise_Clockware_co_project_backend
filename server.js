const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const passport = require("passport");

const mastersRouter = require("./routes/mastersRouter");
const townsRouter = require("./routes/townsRouter");
const ordersRouter = require("./routes/ordersRouter");
const authRouter = require("./routes/accountRouter");
const mailerRouter = require("./routes/mailerRouter");
const freeMastersRouter = require("./routes/freeMastersRouter");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.get("/", function (req, res) {
  res.send("Welcome to the server!!!");
});
app.use("/", authRouter);
app.use("/", mailerRouter);

app.use(passport.authenticate("jwt", { session: false }));
app.use("/masters", mastersRouter);
app.use("/towns", townsRouter);
app.use("/orders", ordersRouter);
app.use("/freeMasters", freeMastersRouter);

app.use((error, req, res, next) => {
  res.status(500);
  res.send({ msg: "Something went wrong" });
  console.log("Error handler");
  next(error);
});
app.listen(process.env.PORT || 9000, function () {
  console.log("Server start");
});
