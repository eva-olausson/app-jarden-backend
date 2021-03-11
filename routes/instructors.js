const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Class = require("../models/Class");
const { checkJwt } = require("../auth0/check-jwt");

// get a specific instructor

router.get("/:slug", async (req, res) => {
  try {
    console.log(req.params.slug);
    let instructor = await User.findOne({ profileSlug: req.params.slug });

    if (!instructor) {
      throw new Error("user does not exist");
    }
    if (!instructor.isInstructor) {
      throw new Error("user is not instructor");
    }
    const classesByInstructor = await Class.find({
      createdBy: instructor._id,
      streaming_date: { $gt: Date.now() },
    }).sort({ streaming_date: "ascending" });

    return res.json({
      nickname: instructor.nickname,
      picture: instructor.picture,
      classes: classesByInstructor,
    });
  } catch (err) {
    res.status(400).send({
      message: err,
    });
  }
});

module.exports = router;
