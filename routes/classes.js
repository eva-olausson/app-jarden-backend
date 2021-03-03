const express = require("express");
const router = express.Router();
const Class = require("../models/Class");

// Fix error codes

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

router.get("/:classId", async (req, res) => {
  try {
    const specificClass = await Class.findById(req.params.classId);
    // Hämta instruktor för klassen
    res.json(specificClass);

    if (!specificClass) return res.status(404).send({ error: "Not found" });
  } catch (err) {
    res.json({ message: err });
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
