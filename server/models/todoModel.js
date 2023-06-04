const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    todo: {
      type: String,
      minLength: 5,
      maxLength: 15,
      required: true,
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      required: [true, "This field is required by DB"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Todo", todoSchema);
