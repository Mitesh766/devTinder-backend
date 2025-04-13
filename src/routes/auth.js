const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { validateSignup } = require("../utils/validate");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);
    const { firstName, lastName, emailId, password } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    
    const token = user.getJWT()
    const data = await user.save();

    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 });
      res.json({
        message: "Signup Successfull",
        userData: data,
      });

  
  } catch (err) {
    res.status(400).send("Error signing up the user" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const isValid = validator.isEmail(emailId);
    if (!isValid) throw new Error("Invalid Credentials");

    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid credentials");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const token = user.getJWT();
      res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 });
      res.json({
        message: "Login Successfull",
        userData: user,
      });
    } else throw new Error("Invalid Credentials");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { maxAge: 0 });
  res.send("Logged out successfully");
});

module.exports = authRouter;
