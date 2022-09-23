const { app } = require('electron');
const { response, json } = require('express');
const express = require('express')
const app_ = express();
const db = require('../db').db;
const bcrypt = require('bcrypt');
app_.use(express.json());
const cors = require('cors'); 
app_.use(cors({
  origin: 'http://127.0.0.1:5500'
}))


app_.get('',(req,res) => {

    res.send({greeting: "Hello"});
})

// sets id of user that is logged in 
app_.get('/setId/:id', (req, res) => {
    global.id = req.params.id
    res.sendStatus(200);
})

// returns signed in info to unity
app_.get('/getSignedInUserInfo',(req,res) => {
  let sql = `SELECT Employees.fname,Employees.lname,UserProgress.*
             FROM Employees,UserProgress
             WHERE Employees.id = UserProgress.id AND Employees.id = ?`
  let userId = global.id 

  db.get(sql,[userId],(err,user) => { // err is null if no error 
      
    if (err){
        return res.status(500).send(err); 
    }

    if (user){
      
      return res.status(200).json(user);
      
    }
    else{  
      return res.status(404).json('user not in db');
    }
  })
})



// gets user info only (no progress) 
app_.get('/getSignedInId',(req,res) => {
  let sql = 'SELECT id,fname,lname,role FROM Employees WHERE ID = ?';
  let userId = global.id 

  db.get(sql,[userId],(err,user) => { // err is null if no error 
      
    if (err){
        return res.status(500).send(err); 
    }

    if (user){
      
      return res.status(200).json(user);
      
    }
      
    return res.status(404).json('user not in db');
  })
})


async function decrypt(password,hashedPassword,res){

  try{
    if (await bcrypt.compare(password,hashedPassword))
        return res.status(200).send('passwords match'); 
    else
        return res.status(404).send('Incorrect security answer');
}
  catch{
    return res.status(500).send('bcrypt failed');
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
    return res.status(500).send('Bcrypt failed');
}
}

//deletes user
app_.delete('/deleteUser/:id', (req,res) => {
  
  let sql = `DELETE FROM Employees WHERE id = ?`;
  let id = req.params.id; 
  
  db.run(sql,id, (err,results) => {
      if (err){
        return res.status(500).send(err); 
      }

        return res.status(200).send(results);
  })
});


// adds user when admin is creating accounts
app_.post('/addUser',async (req,res) => {
  let {id,fname,lname,role,password} = req.body;
  let hashedPassword = await encrypt(password,res); 
  let sql = `INSERT INTO Employees(id,password,fname,lname,role) 
            values (?,?,?,?,?)`;
  
  db.run(sql,[id,hashedPassword,fname,lname,role], (err,result) => {
      if (err){
        return res.status(500).send(err.message); 
      }
      else{
        return res.status(200).send('added user');
      }
  })

})

// test 
app_.post('/test', async (req,res) => {
  let {password}= req.body; 
  let hashedPassword = await encrypt(password);
  console.log(hashedPassword);
  res.send(200);

})

// handles login 
app_.post('/login',(req,res) => {
  let {id,password} = req.body;  
  let sql = 'SELECT * FROM Employees WHERE ID = ?';
  
  db.get(sql,[id],async (err,user) => { 
    
    if (err){
        return res.status(500).send(error); 
    }

    if (user){
        return await decrypt(password,user.password,res);
    }
    
    return res.status(404).send('user not found')
  })
})

// resets password
app_.put('/setPassword',async (req,res) => {
    let {id,password}= req.body; 
    let hashedPassword = await encrypt(password,res);
    let sql = 'UPDATE employees SET password = ? WHERE id = ?';

    db.run(sql,[hashedPassword,id], (err) => {

      if (err){
        return res.status(500).send(err);
      }

      return res.sendStatus(204);
    })
    
})


// updates user progress
// user must be signed in 
app_.put('/updateUserProgress',async (req,res) => {
  let {sid,progress}= req.body; 
  let id = global.id
  let sql = `UPDATE UserProgress SET ${sid} = ${progress} WHERE id = ?`
  db.run(sql,[id], (err) => {

    if (err){
      return res.status(500).send(err);
    }

    return res.sendStatus(204);
  })
})

// returns all users
app_.get('/getAllUsers',(req,res) => {
  let sql = `SELECT Employees.fname,Employees.lname,Employees.id,Employees.role
  FROM Employees`;

  db.all(sql,[],(err,users) => {
    
      if (err){
          return res.status(500).send(err); 
      }

      if (users){
          res.status(200).send(users);
          return; 
      }
  
      return res.status(404).send('user not in db'); 
  })
});


// gets user progress
app_.get('/getUserProgress/:id',(req,res) => {
  let sql = ` SELECT UserProgress.* 
              FROM Employees,UserProgress
              WHERE Employees.id = ?  AND UserProgress.id = ?
            `;

  let userId = req.params.id; 

  db.get(sql,[userId,userId],(err,userProgress) => { 
    
      if (err){
          return res.status(500).send(err); 
      }

      if (userProgress){
          res.status(200).send(userProgress);
          return; 
      }
  
      return res.status(404).send('user not in db'); 
  })
});

// gets specific scenario user progress
app_.get('/getScenarioProgress/:sid',(req,res) => {
    
    let scenarioId = req.params.sid;
    let id = global.id;

    let sql = `select ${scenarioId}
                from UserProgress
                where id = ${id}`

    db.get(sql,[],(err,scenarioProgress) => { 
    
      if (err){
          return res.status(500).send(err); 
      }

        return res.status(200).send(scenarioProgress);
  })
})

// gets user info 
app_.get('/getUser/:id',(req,res) => {
    let sql = 'SELECT * FROM Employees WHERE ID = ?';
    let userId = req.params.id; 

    db.get(sql,[userId],(err,user) => {
        
      if (err){
          return res.status(500).send(err); 
      }

      if (user){
        return res.status(200).json(user);
      }
        
      return res.status(404).json('user not in db');
    })
})


app_.listen(3001, () => {
  console.log("Your server is running on port 3001")
})