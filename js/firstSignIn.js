//const { app } = require("electron");

//const idInput = document.getElementById('idInput');
const passwordInput = document.getElementById('passwordInput');
const reenterPasswordInput = document.getElementById('reenterPasswordInput');
const form = document.getElementById('form');
const idInput = document.getElementById('idInput');
const invalidPasswordText = document.getElementById('invalidPasswordText');
const invalidRePasswordText = document.getElementById('invalidRePasswordText');
const invalidIdText = document.getElementById('invalidIdText');
const select = document.getElementById('select');
const securityQuestionAnswer = document.getElementById('securityQuestionAnswer');
const invalidSecurityAnswerText = document.getElementById('invalidSecurityAnswerText');
const invalidSelectText = document.getElementById('invalidSelectText'); 
//const invalidIdText = document.getElementById('invalidIdText');
//const verifyButton = document.getElementById('verifyButton');
//const loginForm = document.getElementById('loginForm');
//const alert = document.getElementById('alert');
// add class is-invalid when idInput,passwordInput,reenterpasswordInput are empty 
// set display block for every inccorect input field 
// if is-invalid is on and input changes, remove is-invalid from element 
// 

const inputs = [passwordInput,reenterPasswordInput,securityQuestionAnswer,idInput]; 
const inputMessages = [invalidPasswordText,invalidRePasswordText,invalidSecurityAnswerText,invalidIdText]; 


// removes the warning once a question is selected if the user submitted without selecting question
select.addEventListener('change',(event) => {
    if (event.target.value != 0)
    {
        select.classList.remove('is-invalid');
        invalidSelectText.style.display = 'none'; 
    }
})

// attaches input event listenrs. toggles off is-invalid class once user changes the input 
for (let i = 0; i < inputs.length; i++){
    let input = inputs[i];
    let inputMessage = inputMessages[i]; 
    
    input.addEventListener('input', () => {

        if (input.classList.contains('is-invalid'))
        {
            input.classList.remove("is-invalid"); 
            inputMessage.style.display = 'none'; 
        }
    })
}

function checkEmptyFields(){
    let isEmpty = false;
    let message = ['a password', 'a password','an answer','a employee Id']

    for (let i = 0; i < inputs.length; i++)
    {
        let input = inputs[i]; 
        let inputErrMsg = inputMessages[i]; 

        //console.log(input)

        if (input.value === ''){
            input.classList.add('is-invalid');
            inputErrMsg.innerText = `Please enter ${message[i]}` 
            inputErrMsg.style.display = 'block';  
            isEmpty = true; 
        }   
    }

    if (select.value == 0)
    {
        select.classList.add('is-invalid');
        invalidSelectText.innerText = "Please select a question." 
        invalidSelectText.style.display = 'block';  
        isEmpty = true; 
    }

    return isEmpty; 
}

function checkIfPasswordsMatch(){
    if (passwordInput.value != reenterPasswordInput.value)
    {
        //console.log('do not match')
        invalidRePasswordText.innerText = 'Passwords do not match.';
        invalidRePasswordText.style.display = 'block'
        return false; 
    }

    invalidRePasswordText.style.display = 'none'

    return true; 
}

form.addEventListener('submit',async (event) => {
    event.preventDefault(); 


    if (checkEmptyFields() || !checkIfPasswordsMatch())
        return;

    
    let id = idInput.value;
    let password = passwordInput.value;  
    let securityAnswer = securityQuestionAnswer.value;
    let securityQuestion = select.value;


    let response = await fetch(`http://localhost:3001/getUser/${id}`);
    
    if (!response.ok)
    {
        idInput.classList.add('is-invalid'); 
        invalidIdText.innerText = 'Id not found';
        invalidIdText.style.display = 'block';
        return;
    } 

    let user = await response.json();

    let data = {id,password};
    
    let options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
    }

    let setPassword = await fetch("http://localhost:3001/setPassword",options);

    if (!setPassword.ok)
        return; 
    
    
    data = {id,securityQuestion,securityAnswer};

    options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
    }
    
    let setSecurityAnswer = await fetch("http://localhost:3001/setSecurityAnswer",options); 

    if (!setSecurityAnswer.ok)
        return;

    options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
            }
    };
    
    let sendId = await fetch(`http://localhost:3001/setId/${id}`); 

    if (!sendId.ok)
        return; 

    if (user.role === 'Operator')
        form.action = 'operator.html'; 
    else if (user.role === 'Leader')
        form.action = 'leader.html'; 
    else
        form.action = 'admin.html'; 

    form.submit();

})