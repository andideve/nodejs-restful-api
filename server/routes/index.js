const express = require("express");
const db = require("../db");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

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

router.post(
  "/users",
  urlencodedParser,
  upload.single("avatar"),
  async (req, res, next) => {
    let data = req.body;

    console.log(req.file);

    if (!req.file) {
      data.avatar = "default.jpg";
    } else {
      data.avatar = req.file.filename;
    }

    try {
      data.date_created = new Date().getTime();

      const user = await db.create("users", data);
      res.json({
        status: "success",
        message: "user has been created",
        data: user,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.put(
  "/users/:id",
  urlencodedParser,
  upload.single("avatar"),
  async (req, res, next) => {
    let data = req.body;

    let user = await db.one("users", req.params.id);

    if (req.file) {
      if (user.avatar != "default.jpg") {
        try {
          fs.unlinkSync("./uploads/" + user.avatar);
        } catch (err) {
          console.log(err);
          res.sendStatus(500);
        }
      }

      data.avatar = req.file.filename;
    } else {
      data.avatar = user.avatar;
    }

    try {
      user = await db.update("users", data, req.params.id);
      res.json({
        status: "success",
        message: "user has been updated",
        data: user,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.delete("/users/:id", urlencodedParser, async (req, res, next) => {
  let user = await db.one("users", req.params.id);

  if (user.avatar != "default_avatar.jpg") {
    try {
      fs.unlinkSync("./uploads/" + user.avatar);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  try {
    user = await db.delete("users", req.params.id);
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
