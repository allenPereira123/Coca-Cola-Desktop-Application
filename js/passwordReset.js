
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

    let data = {id,securityAnswer};

    let options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
    }

    // newSecurity answer will be ok if sec aanswers match
    // securityIndex corresponds with the number associated with the question 
    // the question selected by the user must match the question in db
    // both the quesition (securityQuestionIndex === securityQuestion) and the answer must match
    let checkSecurityAnswer = await fetch("http://localhost:3001/checkSecurityAnswer",options);
    let user = await response.json();
    let securityQuestionIndex = user.security_question; 

    console.log(checkSecurityAnswer,securityQuestionIndex,securityQuestion);

    if (!checkSecurityAnswer.ok || securityQuestionIndex != securityQuestion)
    {
        securityQuestionAnswer.classList.add('is-invalid'); 
        invalidSecurityAnswerText.innerText = 'Incorrect answer';
        invalidSecurityAnswerText.style.display = 'block';
        return;
    }

    
    data = {id,password};
    
    options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
    }

    let setPassword = await fetch("http://localhost:3001/setPassword",options);

    if (!setPassword.ok)
        return; 


    
    form.action = '../views/signIn.html'; 

    form.submit();

})