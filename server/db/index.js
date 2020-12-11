const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  user: "root",
  password: "",
  database: "restapi",
  host: "localhost",
  port: "3306",
});

let db = {};

db.all = (table) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM `" + table + "`", (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

db.one = (table, id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM `" + table + "` WHERE `id` = ?",
      [id],
      (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      }
    );
  });
};

db.create = (table, data) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    let query = "INSERT INTO `" + table + "` (`id`, ";
    keys.forEach((k, i) => {
      query += "`" + k + "`" + (i + 1 == keys.length ? "" : ", ");
    });
    query += ") VALUES (NULL,";
    values.forEach((v, i) => {
      query += "'" + v + "'" + (i + 1 == keys.length ? "" : ", ");
    });
    query += ")";

    pool.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

db.update = (table, data, id) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    let query = "UPDATE `" + table + "` SET ";
    keys.forEach((k, i) => {
      query +=
        "`" +
        k +
        "`" +
        "=" +
        "'" +
        values[i] +
        "'" +
        (i + 1 == keys.length ? "" : ",");
    });
    query += " WHERE id = ?";

    pool.query(query, [id], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

db.delete = (table, id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM `" + table + "` WHERE id = ?",
      [id],
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  });
};

module.exports = db;
