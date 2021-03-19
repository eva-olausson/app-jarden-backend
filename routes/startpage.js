const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Class = require("../models/Class");

//  The startpage resource contains all instructors next class. You get name the user (instructor) and the next class coming up.

router.get("/", async (req, res) => {
  try {
    const instructors = await User.find(
      { isInstructor: true },
      "profileSlug nickname, picture"
    );

    const instructorIds = instructors.map((instructor) => instructor._id);

    const firstClassByInstructor = await Class.aggregate()
      .match({ createdBy: { $in: instructorIds } }) // $in match on all elements i the instructorId-array.
      .lookup({
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      })
      .unwind("createdBy")
      .sort({ streaming_date: "ascending" })
      .group({ _id: "$createdBy", class: { $first: "$$ROOT" } }); // take the first element in every group and put them in "class"

    const classes = firstClassByInstructor.map((item) => item.class);

    res.json(classes);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
});

module.exports = router;
