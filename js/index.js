/*
var child = require('child_process').execFile;
var executablePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
*/

const { format } = require("mysql");

const idInput = document.getElementById('idInput');
const invalidIdText = document.getElementById('invalidIdText');
const verifyButton = document.getElementById('verifyButton');
const loginForm = document.getElementById('loginForm');
const alert = document.getElementById('alert');




idInput.addEventListener('input',() => {
    
    if (idInput.classList.contains('is-invalid')){   
        idInput.classList.remove('is-invalid')
        invalidIdText.style.display = 'none'
    }

})

loginForm.addEventListener('submit',async (event) => {
    event.preventDefault(); 


    if (idInput.value === '')
    {
        idInput.classList.add('is-invalid')
        invalidIdText.style.display = 'block';
        invalidIdText.innerText = 'Please enter an employee id';
        return; 
    }

    let id = idInput.value; 
    //console.log(`http://localhost:3001/getUser/${id}`);

    const response = await fetch(`http://localhost:3001/getUser/${id}`); 
    
    if (!response.ok)
    {
        invalidIdText.style.display = 'block';
        invalidIdText.innerText = 'Invalid Employee Id';
        return; 
    }

    const user = await response.json(); 

    //localStorage.setItem('role',user.role);
    //localStorage.setItem('id',user.id);
            
    console.log(user);

    
    if (user.password === null)
        loginForm.action = 'views/firstSignIn.html'; 
    else
        loginForm.action = 'views/signIn.html'

    loginForm.submit();
    
})
