const express = require('express')
const app_ = express();
const db = require('../db').db;
app_.use(express.json());

app_.get('', (req, res) => {
  res.send('this is working')
})

app_.get('/getUsers', (req, res) => {
    let sql = `SELECT name FROM Users`
    db.all(sql, [], (err,rows) => {
      if (err){
          throw err;
      }

      res.send(rows);
      
    })
})

app_.post('/addUser', (req, res) => {
  let obj = req.body;
  let sql = 'INSERT INTO users(name) VALUES(?)';

  db.run(sql, [obj.name], (err) => {
    if (err){
      return console.log(err.message)
    }

    res.send('successs');
  })

})


app_.listen(3001, () => {
  console.log("Your server is running on port 3001")
})

