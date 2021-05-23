const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Group = require("./Groups");
const expenseSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    description: { type: String, required: true },
    value: { type: Number, required: true },
    split: {
      paidBy: String,
      dividedBy: [String],
      isDividedByAll: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamp: true,
  }
);

expenseSchema.post("save", async (doc) => {
  try {
    await Group.findByIdAndUpdate(doc.owner, { $push: { expenses: doc._id } });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

expenseSchema.post("findOneAndDelete", async (doc) => {
  try {
    await Group.findByIdAndUpdate(doc.owner, {
      $pull: { expenses: doc._id },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const Expense = model("Expense", expenseSchema);

module.exports = Expense;
