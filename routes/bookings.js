const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Class = require("../models/Class");
const { checkJwt } = require("../auth0/check-jwt");

// get my bookings

router.get("/", checkJwt, async (req, res) => {
  try {
    const user = await User.findOne({ sub: req.user.sub });
    const bookings = await Booking.find({
      user: user._id,
    }).populate({
      path: "class", // Populate bookings med class path från Class Model (alla pass) och populate med path createdBy från User Model (instructor users).
      model: Class,
      populate: {
        path: "createdBy",
        model: User,
      },
    });

    console.log("My bookings", bookings);

    res.json(bookings);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/", checkJwt, async (req, res) => {
  try {
    const { classId } = req.body;
    const user = await User.findOne({ sub: req.user.sub }); // Hämta user
    if (!user) throw new Error("User does not exist");

    const classObj = await Class.findOne({ _id: classId }); // Hämta pass
    if (!classObj) throw new Error("Class does not exist");

    // Sen skapa ny bokning

    let newBooking = new Booking({
      class: classId,
      user: user._id,
    });

    newBooking = await newBooking.save();
    const allBookings = await Booking.find({ user: user._id });
    res.json(allBookings);
    console.log(newBooking);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
