//const idInput = document.getElementById('idInput');
const passwordInput = document.getElementById('passwordInput');
const reenterPasswordInput = document.getElementById('reenterPasswordInput');
const form = document.getElementById('form');
let id = document.getElementById('id');
const invalidPasswordText = document.getElementById('invalidPasswordText');
const invalidRePasswordText = document.getElementById('invalidRePasswordText');
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
id.innerText = localStorage.getItem('id');

const inputs = [passwordInput,reenterPasswordInput,securityQuestionAnswer]; 
const inputMessages = [invalidPasswordText,invalidRePasswordText,invalidSecurityAnswerText]; 


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

    for (let i = 0; i < inputs.length; i++)
    {
        let input = inputs[i]; 
        let inputErrMsg = inputMessages[i]; 

        //console.log(input)

        if (input.value === ''){
            input.classList.add('is-invalid');
            inputErrMsg.innerText = `Please enter ${i == 2 ? 'an answer.' : 'a password.'}` 
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
        invalidRePasswordText.innerText = 'Passwords do not match.';
        invalidRePasswordText.style.display = 'block'
        return false; 
    }

    return true; 
}


form.addEventListener('submit',async (event) => {
    event.preventDefault(); 


    if (checkEmptyFields() || !checkIfPasswordsMatch())
        return;

    const id = localStorage.getItem('id');
    const password = passwordInput.value;  
    const securityAnswer = securityQuestionAnswer.value;
    const securityQuestion = select.value;
    let data = {id,password};

    //console.log(data);
    
    let options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
    }

    await fetch("http://localhost:3001/setPassword",options); 

    data = {id,securityQuestion,securityAnswer};

    options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
    }

    await fetch("http://localhost:3001/setSecurityAnswer",options); 

    form.action = '../views/launchApp.html'; 

    form.submit();
    

})


