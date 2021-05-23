const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var usersSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    currency: { type: String, required: true },
    timezone: { type: String, required: true },
    language: { type: String, required: true },
    image: { type: String, required: false },
  },
  {
    versionKey: false,
  }
);

const userModel = mongoose.model("user", usersSchema);
module.exports = userModel;
