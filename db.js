const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + './mydb.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err)
        return console.error(err.message);
    
})
db.get("PRAGMA foreign_keys = ON")

exports.db = db;
