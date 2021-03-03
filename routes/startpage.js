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

    // todo: lookup genererar en array i created, fixa så att det istället blir det första elementet ($project i mongodb)
    const firstClassByInstructor = await Class.aggregate()
      .match({ createdBy: { $in: instructorIds } }) // $in måste användas om man vill matcha på alla element i en array
      //.match({ createdBy: "ett id" }) // för att hitta ett dokument med ett specifikt id
      // .lookup är ekvivalent med .populate på en query (.find)
      .lookup({
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      })
      .unwind("createdBy")
      .sort({ streaming_date: "ascending" }) // sortera innan du grupperar
      .group({ _id: "$createdBy", class: { $first: "$$ROOT" } }); // ta första elementet i varje gruppering och lägg i "class"
    //.group({ _id: "$createdBy", class: { $push: "$$ROOT" } }); // ta alla element i varje gruppering och lägg i "class"

    const classes = firstClassByInstructor.map((item) => item.class);

    res.json(classes);
    console.log(classes, "classes firstClassByInstructor");
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
});

module.exports = router;
