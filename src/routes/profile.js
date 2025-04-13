const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Invalid\n" + err.message);
  }
});

profileRouter.put("/profile/edit",userAuth, async (req, res) => {

  const loggedInUser = req.user;
  const newData = req.body;
  console.log(loggedInUser)
  console.log("newData "+newData)

  try {
    const allowed = [
      "firstName",
      "lastName",
      "gender",
      "age",
      "skills",
      "photoURL",
    ];
    for (k in newData) {
      if (!allowed.includes(k)) throw new Error("Field not allowed to change");
    }

    for (k in newData) {
      loggedInUser[k] = newData[k];
    }

    const updatedData = await loggedInUser.save();
    res.send(updatedData);
  } catch (error) {
    res.status(400).send("Something went wrong" + error.message);
  }
});

module.exports = profileRouter;
