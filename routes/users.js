const express = require("express");
const router = express.Router();
var axios = require("axios").default;
const User = require("../models/User");
const { checkJwt } = require("../auth0/check-jwt");

// Get user. If user does not exist in db create new user, using ref sub: from Auth0 jwt-token.

router.get("/me", checkJwt, async (req, res) => {
  try {
    let user = await User.findOne({ sub: req.user.sub });
    if (user === null) {
      const userResponse = await getUserInfo(req.headers.authorization);
      const { nickname, email, picture } = userResponse.data;

      let newUser = new User({
        sub: req.user.sub,
        nickname: nickname,
        email: email,
        picture: picture,
      });

      user = await newUser.save();
    }
    return user ? res.json(user) : res.sendStatus(204);
  } catch (err) {
    res.status(400).send({
      message: err,
    });
  }
});

// Auth0 getUserInfo endpoint

const getUserInfo = async (token) => {
  var options = {
    method: "GET",
    url: "https://dev-kwscsnfg.eu.auth0.com/userinfo",
    headers: { authorization: token },
  };

  return await axios.request(options);
};

router.post("/me", checkJwt, async (req, res) => {
  const { nickname, email, picture } = req.body;

  let newUser = new User({
    sub: req.user.sub,
    nickname: nickname,
    email: email,
    picture: picture,
  });

  newUser = await newUser.save();
  res.json(newUser);
});

router.patch("/me", checkJwt, async (req, res) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
        },
      }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(400).send({
      message: err,
    });
  }
});

module.exports = router;
