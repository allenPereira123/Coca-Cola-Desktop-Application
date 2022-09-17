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


app_.get('/setId/:id', (req, res) => {
    global.id = req.params.id
    res.sendStatus(200);
})

// gets user info 
app_.get('/getSignedInId',(req,res) => {
  let sql = 'SELECT * FROM Employees WHERE ID = ?';
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

//deletes user (admin cannot be deleted)
app_.delete('/deleteUser/:id', (req,res) => {
  //console.log('hello')
  let sql = `DELETE FROM Employees WHERE id = ?`;
  let id = req.params.id; 
  //console.log(id);
  db.run(sql,id, (err,results) => {
      if (err){
        res.status(500).send(err); 
      }

        return res.status(200).send(results);
  })
});


// adds user when admin is creating accounts
app_.post('/addUser',async (req,res) => {
  let {id,fname,lname,role,secQ,secA,password} = req.body;
  let hashedPassword = await encrypt(password,res); 
  let hashedSecurityAnswer = await encrypt(secA,res);
  let sql = `INSERT INTO Employees(id,password,fname,lname,security_answer,role,security_question) 
            values (?,?,?,?,?,?,?)`;
  
  db.run(sql,[id,hashedPassword,fname,lname,hashedSecurityAnswer,role,secQ], (err,result) => {
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

// checks if security answer is correct
app_.put('/checkSecurityAnswer',(req,res) => {
  let {id,securityAnswer} = req.body;  
  //console.log('hello')
  let sql = `SELECT Employees.security_answer FROM Employees WHERE ID = ?`;
  
  db.get(sql,[id],async (err,answer) => { // err is null if no error 
    
    if (err){
        return res.status(500).send('Error retrieving information'); 
    }

    if (answer){
        //console.log(securityAnswer,answer);
        return await decrypt(securityAnswer,answer.security_answer,res);
    }
    //console.log(answer);
    return res.status(404).send('user not found')
  })
})


// handles login after user has created password
app_.post('/login',(req,res) => {
  let {id,password} = req.body;  
  let sql = 'SELECT * FROM Employees WHERE ID = ?';
  
  db.get(sql,[id],async (err,user) => { // err is null if no error 
    
    if (err){
        return res.status(500).send(error); 
    }

    if (user){
        //console.log(user.password,password);
        return await decrypt(password,user.password,res);
    }
    
    return res.status(404).send('user not found')
  })
})

// sets password of user after initial sign in 
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

// sets security answer question
app_.put('/setSecurityAnswer',async (req,res) => {
  let {id,securityQuestion,securityAnswer}= req.body; 
  let hashedSecAnswer = await encrypt(securityAnswer,res);
  let sql = `UPDATE Employees SET
              security_answer = ?,
              security_question = ?
              WHERE id = ?`
              
  //console.log(hashedSecAnswer);
  db.run(sql,[hashedSecAnswer,securityQuestion,id], (err) => {

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
  let sql = `UPDATE UserProgress SET ${sid} = ${progress} WHERE id = 9876`
  db.run(sql,[], (err) => {

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

  db.all(sql,[],(err,users) => { // err is null if no error 
    
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

// returns all users of groups that belong to leader/admin group
app_.get('/getGroupMembers/:id',(req,res) => {
  let sql = `SELECT UserProgress.*, Employees.fname, Employees.lname, Groups.group_name
            FROM UserProgress,GroupMembers,Groups,Employees
            WHERE UserProgress.id = Employees.id AND Groups.group_id = GroupMembers.group_id AND Employees.id = GroupMembers.member_id AND Groups.creater_id = ?`;

  let groupCreaterId = req.params.id;

  db.all(sql,[groupCreaterId],(err,users) => { 
    
      if (err){
          return res.status(500).send(err); 
      }

      return res.status(200).send(users);
  })
});

// gets user progress
app_.get('/getUserProgress/:id',(req,res) => {
  let sql = ` SELECT UserProgress.* 
              FROM Employees,UserProgress
              WHERE Employees.id = ?  AND UserProgress.id = ?
            `;

  let userId = req.params.id; 

  db.get(sql,[userId,userId],(err,userProgress) => { // err is null if no error 
    
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

    //console.log(global.id);

    db.get(sql,[],(err,scenarioProgress) => { // err is null if no error 
    
      if (err){
          return res.status(500).send(err); 
      }

        return res.status(200).send(scenarioProgress);
     
      //console.log(global.id);
    
  })
})

// gets user info 
app_.get('/getUser/:id',(req,res) => {
    let sql = 'SELECT * FROM Employees WHERE ID = ?';
    let userId = req.params.id; 

    db.get(sql,[userId],(err,user) => { // err is null if no error 
        
      if (err){
          return res.status(500).send(err); 
      }

      if (user){
        //global.id = user.id;
        return res.status(200).json(user);
        //console.log(global.id);
      }
        
      return res.status(404).json('user not in db');
    })
})


app_.listen(3001, () => {
  console.log("Your server is running on port 3001")
})

