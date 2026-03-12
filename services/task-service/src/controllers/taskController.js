const Task = require("../models/Task");
const { client } = require("../config/redis");

exports.createTask = async (req, res) => {

  try {

    const { title, description, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.user.userId
    });

    await task.save();

    await client.publish(
        "task_created",
        JSON.stringify(task)
    );

    res.status(201).json({
      message: "Task created",
      task
    });

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};

exports.getTasks = async (req, res) => {

  try {

    const userId = req.user.userId;

    const cachedTasks = await client.get(`tasks:${userId}`);

    if (cachedTasks) {

      console.log("Serving from Redis Cache");

      return res.json(JSON.parse(cachedTasks));

    }

    const tasks = await Task.find({
      createdBy: userId
    });

    await client.set(
      `tasks:${userId}`,
      JSON.stringify(tasks),
      { EX: 60 }
    );

    console.log("Serving from MongoDB");

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};