const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    avatar: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
  }
);

const User = model("User", userSchema);

module.exports = User;
