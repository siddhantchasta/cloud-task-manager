const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
connectRedis();

app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Task Service Running");
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Task service running on ${PORT}`);
});