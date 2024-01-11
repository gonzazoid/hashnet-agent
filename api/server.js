import "dotenv/config";
import express from "express";
import cors from "cors";

import HashNetRouter from "./app/routes/hashnet.routes.js";
import db from "./app/models/index.js";
console.log(db.url);

const app = express();
app.disable("etag");

var corsOptions = {
  origin: (origin, callback) => callback(null, { origin: true }),
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

db.mongoose
  .connect(db.url, {})
  .then(() => console.log("Connected to the database!"))
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to #Net server." });
});

HashNetRouter(app);

const PORT = process.env.NODE_DOCKER_PORT;
app.listen(PORT, () => {
  console.log(`#Net server is running on port ${PORT}.`);
});
