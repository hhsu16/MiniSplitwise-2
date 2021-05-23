const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const User = require("./User");

const groupSchema = new Schema(
  {
    groupName: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    members: {
      type: [String],
      set: (names) => {
        return names.map((name) => {
          const loweredCaseName = name.toLowerCase();
          return `${loweredCaseName
            .charAt(0)
            .toUpperCase()}${loweredCaseName.slice(1)}`;
        });
      },
    },
    description: String,
    expenses: [{ type: Schema.Types.ObjectId, ref: "Expense" }],
    settles: [{ type: Schema.Types.ObjectId, ref: "Settle" }],
    date: Date,
  },
  {
    timestamp: true,
  }
);

groupSchema.post("save", async (doc) => {
  try {
    await User.findByIdAndUpdate(doc.owner, { $push: { groups: doc._id } });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

groupSchema.post("findOneAndDelete", async (doc) => {
  try {
    await User.findByIdAndUpdate(doc.owner, { $pull: { groups: doc._id } });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const Group = model("Group", groupSchema);

module.exports = Group;
