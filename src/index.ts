import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

AppDataSource.initialize()
  .then(async () => {
    // console.log("Inserting a new user into the database...");
    // const user = new User();
    // user.name = "sample@domen.com";
    // user.password = "password";
    // await AppDataSource.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await AppDataSource.manager.find(User);
    console.log("Loaded users: ", users);

    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );

    app.use(express.json());

    app.get("/users", (req, res) => {
      res.json(users);
    });

    app.post("/users", async (req, res) => {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
          id: 1, //auto increment somehow
          name: req.body.name,
          password: hashedPassword,
        };
        users.push(user);
        res.status(201).send();
      } catch {
        res.status(500).send();
      }
    });

    app.post("/users/login", async (req, res) => {
      const user = users.find((user) => user.name === req.body.name);
      //might be undefined
      if (user == null) {
        console.log({ user });
        return res.status(400).send("Cannot find user");
      }
      try {
        if (await bcrypt.compare(req.body.password, user.password)) {
          res.send("Success");
        } else {
          res.send("Not Allowed");
        }
      } catch {
        res.status(500).send();
      }
    });

    app.listen(3306);
  })
  .catch((error) => console.log(error));
