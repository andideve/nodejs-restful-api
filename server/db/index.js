const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    user: 'root',
    password: '',
    database: 'restapi',
    host: 'localhost',
    port: '3306'
});

let db = {};

db.all = (table) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM " + table, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

db.one = (table, id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM " + table + " WHERE id = ?", [id], (err, results) => {
            if (err) reject(err);
            resolve(results[0]);
        });
    });
}

db.create = (table, data) => {
    return new Promise((resolve, reject) => {
        let query = "INSERT INTO `" + table + "` (`id`, ";
        const keys = Object.keys(data);
        keys.forEach((k, i) => query += "`"+k+"`" + (i == keys.length-1 ? '' : ', '));
        query += ") VALUES (NULL,";
        Object.values(data).forEach((v, i) => query += "'"+v+"'" + (i == keys.length-1 ? '' : ', '));
        query += ")";

        pool.query(query, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

db.update = (table, data, id) => {
    return new Promise((resolve, reject) => {
        let query = "UPDATE `" + table + "` SET ";
        const keys = Object.keys(data);
        keys.forEach((k, i) => query += "`"+k+"`="+ "'"+Object.values(data)[i]+"'" + (i == keys.length-1 ? '' : ', '));
        query += " WHERE id = ?";

        pool.query(query, [id], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

db.delete = (table, id) => {
    return new Promise((resolve, reject) => {
        let query = "DELETE FROM `" + table + "` WHERE id = ?";

        pool.query(query, [id], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

module.exports = db;
