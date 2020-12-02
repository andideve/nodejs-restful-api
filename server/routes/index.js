const express = require("express");

const db = require("../db");

const router = express.Router();

router.get("/users", async (req, res, next) => {
  try {
    const users = await db.all();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.one(req.params.id);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
