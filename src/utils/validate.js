const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName)
    throw new Error("First name or last name is missing");
  else if (!emailId || !validator.isEmail(emailId)) throw new Error("Invalid email");
  else if (!password || !validator.isStrongPassword(password))
    throw new Error("Invalid password");
  else return true;
};

module.exports = {validateSignup} ;
