const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age skills photoURL gender";

userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Connection requests fetched successfully",
      connectionRequest,
    });
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      data,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    if (limit > 50) limit = 50;
    let skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const toHideFromFeedUsers = new Set();
    connectionRequests.forEach((req) => {
      toHideFromFeedUsers.add(req.fromUserId);
      toHideFromFeedUsers.add(req.toUserId);
    });

    toHideFromFeedUsers.add(loggedInUser._id)

    const users = await User.find({
      _id: { $nin: Array.from(toHideFromFeedUsers) },
    })
      .select("firstName lastName email photoURL age skills gender")
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.send("Error : " + err.message);
  }
});

module.exports = userRouter;
