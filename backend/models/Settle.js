const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Group = require("./Groups");
const settleSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    value: { type: Number, required: true },
    paidBy: String,
    paidTo: String,
  },
  {
    timestamp: true,
  }
);

settleSchema.post("save", async (doc) => {
  try {
    await Group.findByIdAndUpdate(doc.owner, { $push: { settles: doc._id } });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

settleSchema.post("findOneAndDelete", async (doc) => {
  try {
    await Group.findByIdAndUpdate(doc.owner, {
      $pull: { settles: doc._id },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const Settle = model("Settle", settleSchema);

module.exports = Settle;
