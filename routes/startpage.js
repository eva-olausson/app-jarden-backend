const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Class = require("../models/Class");

router.get("/", async (req, res) => {
  try {
    const instructors = await User.find(
      { isInstructor: true },
      "profileSlug nickname, picture"
    );

    const instructorIds = instructors.map((instructor) => instructor._id);

    const firstClassByInstructor = await Class.aggregate()
      .match({ createdBy: { $in: instructorIds } }) // matcha alla element i en array
      .lookup({
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      })
      .unwind("createdBy")
      .sort({ streaming_date: "ascending" })
      .group({ _id: "$createdBy", class: { $first: "$$ROOT" } }); // ta första elementet i varje gruppering och lägg i "class"

    const classes = firstClassByInstructor.map((item) => item.class);

    res.json(classes);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

module.exports = router;
