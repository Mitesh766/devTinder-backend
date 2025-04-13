const mongoose = require("mongoose");
const User = require("./user")

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "rejected", "ignored", "interested"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId))
    throw new Error("Cannot send connection request to yourself !");
  next();
});

connectionRequestSchema.index({
  fromUserId: 1,
  toUserId: 1,
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
