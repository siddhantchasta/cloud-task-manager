const { createClient } = require("redis");

const subscriber = createClient({
  url: "redis://redis:6379"
});

async function start() {

  await subscriber.connect();

  console.log("Notification Service Connected to Redis");

  await subscriber.subscribe("task_created", (message) => {

    const task = JSON.parse(message);

    console.log("New Task Event Received:");

    console.log(`Task: ${task.title}`);
    console.log(`Assigned to: ${task.assignedTo}`);

  });

}

start();