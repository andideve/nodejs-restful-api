const express = require("express");
const db = require("../db");
const bodyParser = require("body-parser");

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/users", async (req, res, next) => {
  try {
    const users = await db.all("users");
    res.json({
      status: "success",
      data: users,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.one("users", req.params.id);
    res.json({
      status: "success",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/users", urlencodedParser, async (req, res, next) => {
  try {
    const user = await db.create("users", {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      date_created: new Date().getTime(),
    });
    res.json({
      status: "success",
      message: "user has been created",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put("/users/:id", urlencodedParser, async (req, res, next) => {
  try {
    const user = await db.update(
      "users",
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
      req.params.id
    );
    res.json({
      status: "success",
      message: "user has been updated",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.delete("/users/:id", urlencodedParser, async (req, res, next) => {
  try {
    const user = await db.delete("users", req.params.id);
    res.json({
      status: "success",
      message: "user has been deleted",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
