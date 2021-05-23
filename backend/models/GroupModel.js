const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var groupSchema = new Schema(
  {
    groupname: { type: String, required: true },
    useremail: { type: String, required: true },
    groupimage: { type: String, required: false },
  },
  {
    versionKey: false,
  }
);

const groupModel = mongoose.model("group", groupSchema);
module.exports = groupModel;
