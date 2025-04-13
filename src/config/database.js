const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://miteshsot010068:DjamHeYcfgcBVw3@mg-learns-node.pnc3y.mongodb.net/devTinder5"
  );
};

module.exports = connectDB;
