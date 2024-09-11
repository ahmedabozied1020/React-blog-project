const { model, Schema } = require("mongoose");

const postSchema = new Schema(
  {
    title: String,
    description: String,
    image: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
