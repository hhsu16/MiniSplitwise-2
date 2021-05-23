const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var activitySchema = new Schema(
  {
    groupname: { type: String, required: true },
    expense: { type: Number, required: true },
    description: { type: String, required: true },
    useremail: { type: String, required: true },
    date: { type: String, required: true },
    datestring: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const activityModel = mongoose.model("activity", activitySchema);
module.exports = activityModel;
