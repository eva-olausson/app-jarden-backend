const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // userId
    ref: "User",
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId, // classId
    ref: "Class",
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
