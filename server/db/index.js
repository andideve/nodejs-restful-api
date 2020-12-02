const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  user: "root",
  password: "",
  database: "mysql-api",
  host: "localhost",
  port: "3306",
});

let andidb = {};

andidb.all = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users", (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

andidb.one = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) reject(err);
      resolve(results[0]);
    });
  });
};

module.exports = andidb;
