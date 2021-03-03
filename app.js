require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const { clientOrigins, serverPort } = require("./config/env.dev");
const classesRoute = require("./routes/classes");
const usersRoute = require("./routes/users");
const startpageRoute = require("./routes/startpage");
const instructorsRoute = require("./routes/instructors");
const bookingsRoute = require("./routes/bookings");

// App config

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors({ origin: clientOrigins }));

app.get("/", (req, res) => {
  res.send("This is the landingpage");
});

app.use("/classes", classesRoute);
app.use("/users", usersRoute);
app.use("/instructors", instructorsRoute);
app.use("/startpage", startpageRoute);
app.use("/bookings", bookingsRoute);

mongoose.connect(
  process.env.DATABASE_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Connected to db");
  }
);

app.listen(serverPort);
