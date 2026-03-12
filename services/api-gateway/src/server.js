const express = require("express");
const cors = require("cors");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

app.use(morgan("dev"));

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP
  message: "Too many requests, please try again later"
});

app.use(limiter);

/* AUTH SERVICE */

app.use("/auth", async (req, res) => {
  try {

    const url = `http://auth-service:5001${req.originalUrl}`;

    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: {
        Authorization: req.headers.authorization
      }
    });

    res.status(response.status).json(response.data);

  } catch (error) {

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(error.message);
      res.status(500).json({ message: "Gateway error" });
    }

  }
});

/* TASK SERVICE */

app.use("/tasks", async (req, res) => {
  try {

    const url = `http://task-service:5002${req.originalUrl}`;

    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: {
        Authorization: req.headers.authorization
      }
    });

    res.status(response.status).json(response.data);

  } catch (error) {

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(error.message);
      res.status(500).json({ message: "Gateway error" });
    }

  }
});

app.get("/", (req, res) => {
  res.send("API Gateway Running");
});

const PORT = 5003;

app.listen(PORT, () => {
  console.log(`API Gateway running on ${PORT}`);
});