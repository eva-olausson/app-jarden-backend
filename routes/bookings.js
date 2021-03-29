const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Class = require("../models/Class");
const { checkJwt } = require("../auth0/check-jwt");

// Get bookings

router.get("/", checkJwt, async (req, res) => {
  try {
    const user = await User.findOne({ sub: req.user.sub });
    const bookings = await Booking.find({
      user: user._id,
    }).populate({
      path: "class", // Populate bookings with class path from Class Model (all classes) and with path createdBy from the User Model (instructor users).
      model: Class,
      populate: {
        path: "createdBy",
        model: User,
      },
    });

    res.json(bookings);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Create a booking / Book a class

router.post("/", checkJwt, async (req, res) => {
  try {
    const { classId } = req.body;
    const user = await User.findOne({ sub: req.user.sub });
    if (!user) throw new Error("User does not exist");

    const classObj = await Class.findOne({ _id: classId });
    if (!classObj) throw new Error("Class does not exist");

    let newBooking = new Booking({
      class: classId,
      user: user._id,
    });

    newBooking = await newBooking.save();
    const allBookings = await Booking.find({ user: user._id });
    console.log(user, "user i post");
    console.log(allBookings, "allBookings");
    res.json(allBookings);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Remove a booking

router.delete("/:bookingId", checkJwt, async (req, res) => {
  const bookingId = req.params.bookingId;
  const user = await User.findOne({ sub: req.user.sub });

  const booking = await Booking.findOne({
    _id: bookingId,
  });

  if (!booking) {
    return sendStatus(404);
  }

  if (!booking.user.equals(user._id)) {
    return res.sendStatus(403);
  }

  try {
    await Booking.remove({
      _id: bookingId,
    });
    const user = await User.findOne({ sub: req.user.sub });
    const bookings = await Booking.find({ user: user._id }).populate({
      path: "class",
      model: Class,
      populate: {
        path: "createdBy",
        model: User,
      },
    });
    res.json(bookings);
  } catch (err) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
