// backend.js
import express from "express";
import cors from "cors";
import {addUser, getUsers, findUserById, deleteUser} from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Using dotenv package to use .env variables
dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .then(() => console.log("Connected"))
  .catch((error) => {
    console.log(error)
  }
  );

const app = express();
const port = 8000;

// Open backend routes to requests from anywhere
// Gets rid of "No-access-control-allow-origin" error
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  getUsers(name, job)
    .then((result) => res.send(result))
    .catch((error) => console.log(error))
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  findUserById(id)
    .then((result) => {
      if(result === undefined) {
        res.status(404).send("Resource not found.");
      }
      else {
        res.send(result)
      }
    })
    .catch((error) => console.log(error));
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd)
    .then((newUser) => res.status(201).send(newUser))
    .catch((error) => console.log(error));
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];

  deleteUser(id)
    .then((result) => {
      if (result === undefined) {
        res.status(404).send("Resource not found.");
      }
      else{
        res.status(204).send(result);
      }
    })
    .catch((error) => console.log(error));

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
