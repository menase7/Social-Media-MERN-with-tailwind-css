const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const postSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.types.ObjectId, 
      ref: "Users"
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    likes: [{
      type: String
    }],
    comments: [{
      type: Schema.Types.ObjectId, ref: "Comments"
    }]
  },
  {
    timestamps: true
  }
);

const posts = mongoose.model("Posts", postSchema);

module.exports = posts;