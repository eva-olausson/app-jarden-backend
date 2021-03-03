const mongoose = require("mongoose");

const ClassSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  streaming_date: {
    type: Date,
  },
  equipment: {
    type: String,
    requered: true,
  },
  location: {
    type: String,
    requered: true,
  },
  video: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  classSlug: {
    type: String,
  },
});

module.exports = mongoose.model("Classes", ClassSchema);
