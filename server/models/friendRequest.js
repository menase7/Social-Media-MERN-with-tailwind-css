const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = Schema(
  {
    requestTo: { type: Schema.Types.ObjectId, ref: "Users"},
    requestFrom: {type: Schema.Types.ObjectId, ref: "Users"},
    requestStatus: {type: String, default: "Pending"},
  }
);

const FriendRequest = mongoose.model("FriendRequest", requestSchema);

module.exports = FriendRequest;