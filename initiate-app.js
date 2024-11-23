import express from "express";
import { config } from "dotenv";

import { db_connection } from "./DB/connection.js";

import {
  cronJobForDisablingCoupons,
  socketConnection,
} from "./src/utils/index.js";
import { gracefulShutdown } from "node-schedule";
import { routerHandler } from "./router-handler.js";
export const main = () => {
  // Inheritance
  // let animal = {
  //   eats: "eats",
  // };
  // // let dog = Object.create(animal);
  // let dog = new Object(animal);
  // dog.nice = "nice";
  // dog.eats = "bones";
  // console.log(dog.eats);
  // console.log(dog);
  const app = express();

  config();
  
  const port = process.env.PORT;

  routerHandler(app);

  db_connection();

  cronJobForDisablingCoupons();
  gracefulShutdown();

  app.get("/", (req, res) => res.send("Hello World!"));
  const serverApp = app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
  );
  const io = socketConnection(serverApp);
};
