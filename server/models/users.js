const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    email: String,
    password: String,
    role: String,
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
