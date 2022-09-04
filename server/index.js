const { app } = require('electron');
const { response } = require('express');
const express = require('express')
const app_ = express();
const db = require('../db').db;
const bcrypt = require('bcrypt');
app_.use(express.json());


app_.get('', (req, res) => {
  res.status(200);
})


async function decrypt(password,hashedPassword,res){

  try{
    if (await bcrypt.compare(password,hashedPassword))
        res.status(200).send('Passwords match'); 
    else
        res.status(404).send('Passwords do not match')
}
  catch{
    res.status(500).send('Bcrypt failed');
  }
}

async function encrypt (password,res){

  try{
    const salt = await bcrypt.genSalt(); 
    const hashedPassword = await bcrypt.hash(password,salt);
    //res.status(201).send(); 
    //console.log(salt,hashedPassword);
    return hashedPassword;
}
catch{
    res.status(500).send('Bcrypt failed');
}
}

// test 
app_.post('/test', async (req,res) => {
  let {password}= req.body; 
  let hashedPassword = await encrypt(password);
  console.log(hashedPassword);
  res.send(200);

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

app_.post('/login',(req,res) => {
  let {id,password} = req.body;  
  let sql = 'SELECT * FROM Employees WHERE ID = ?';
  
  db.get(sql,[id],async (err,user) => { // err is null if no error 
    
    if (err){
        res.status(500).send(error); 
    }

    if (user){
        //console.log(user.password,password);
        await decrypt(password,user.password,res);
    }
    else
      res.status(404).send('user not found')
  })
})

// sets password of user after initial sign in 
app_.put('/setPassword',async (req,res) => {
    let {id,password}= req.body; 
    let hashedPassword = await encrypt(password,res);
    let sql = 'UPDATE employees SET password = ? WHERE id = ?';

    db.run(sql,[hashedPassword,id], (err) => {

      if (err){
        res.status(500).send(err);
      }

      res.sendStatus(204);
    })
    
})

// gets user info 
app_.get('/getUser/:id',(req,res) => {
      let sql = 'SELECT * FROM Employees WHERE ID = ?';
      let userId = req.params.id; 

      db.get(sql,[userId],(err,user) => { // err is null if no error 
        
        if (err){
            res.status(500).send(err); 
        }

        if (user)
          res.status(200).json({user:user,success:true});
        else
          res.status(404).json({user:null,success:false,message:"user not in db"});
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

