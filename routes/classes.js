const express = require("express");
const router = express.Router();
const Class = require("../models/Class");
const User = require("../models/User");

const { checkJwt } = require("../auth0/check-jwt");

//Only specific class is used at present.

router.get("/", async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newClass = new Class({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      streaming_date: req.body.streaming_date,
      equipment: req.body.equipment,
      location: req.body.location,
      image: req.body.image,
      video: req.body.video,
      classSlug: req.body.classSlug,
    });

    const savedClass = await newClass.save();
    res.json(savedClass);
  } catch (err) {
    res.status(400).send({ error: error.message });
  }
});

// Get a specific class and the user that created the class

router.get("/:classId", checkJwt, async (req, res) => {
  try {
    const specificClass = await Class.findById(req.params.classId);
    const instructor = await User.findById(specificClass.createdBy);

    if (!specificClass || !instructor)
      return res.status(404).send({ error: "Not found" });
    res.json({ specificClass, instructor });
  } catch (err) {
    res.status(404).send({ error: "Not found" });
  }
});

router.delete("/:classId", async (req, res) => {
  try {
    const removedClass = await Class.remove({ _id: req.params.classId });
    res.json(removedClass);
  } catch (err) {
    res.status(400).send({ error: error.message });
  }
});

router.patch("/:classId", async (req, res) => {
  try {
    const updatedClass = await Class.updateOne(
      { _id: req.params.classId },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          streaming_date: req.body.streaming_date,
          equipment: req.body.equipment,
          location: req.body.location,
          image: req.body.image,
          video: req.body.video,
          classSlug: req.body.classSlug,
        },
      }
    );
    res.json(updatedClass);
  } catch (err) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
