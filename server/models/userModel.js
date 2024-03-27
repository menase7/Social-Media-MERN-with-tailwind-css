const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required"]
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required"]
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, "Password length should be greaterthan 6 characters"],
      select: true,
    },
    locatioin:{ type: String },
    profileUrl: {type: String},
    profession: {type: String},
    friends: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Users"
    }],
    views: [{type: String}],
    verified: 
    {
    type: Boolean, 
    default: false
  }
  },
  {
    timestamps: true
  }
);

const Users = mongoose.model("Users", userSchema);

module.exports = Users;