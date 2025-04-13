const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decodedData = jwt.verify(token, "abcd1234");
    
    const { _id } = decodedData;
    
    const userData = await User.findOne({ _id: _id });
    if (!userData) throw new Error("Invalid token ,please login again");
    req.user = userData;
    next();
  } catch (err) {
    res.status(400).send("Error\n" + err.message);
  }
};
module.exports = { userAuth };
