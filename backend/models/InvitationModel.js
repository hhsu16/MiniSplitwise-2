const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var invitationSchema = new Schema(
  {
    useremail: { type: String, required: true },
    inviteduseremail: { type: String, required: true },
    groupname: { type: String, required: true },
    isaccepted: { type: Boolean, required: true },
  },
  {
    versionKey: false,
  }
);

const invitationModel = mongoose.model("invitation", invitationSchema);
module.exports = invitationModel;
