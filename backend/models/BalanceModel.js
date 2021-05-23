const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var balanceSchema = new Schema(
  {
    useroweemail: { type: String, required: true },
    userowedemail: { type: String, required: true },
    balance: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

const balanceModel = mongoose.model("balance", balanceSchema);
module.exports = balanceModel;
