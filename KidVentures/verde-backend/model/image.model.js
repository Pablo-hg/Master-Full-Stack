const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema(
  { 
 
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", 
    },
    filePath: { 
      type: String, 
      required: true 
    },
    isTemporary: {
      type: Boolean,
      default: true, 
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } 
);


module.exports = mongoose.model("image", imageSchema);
