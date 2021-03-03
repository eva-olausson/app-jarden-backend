const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  sub: {
    type: String,
    index: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
  profileSlug: {
    type: String,
  },
  isInstructor: {
    type: Boolean,
    default: false,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
