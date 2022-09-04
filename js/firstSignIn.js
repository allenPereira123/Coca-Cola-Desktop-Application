//const idInput = document.getElementById('idInput');
const passwordInput = document.getElementById('passwordInput');
const reenterPasswordInput = document.getElementById('reenterPasswordInput');
const form = document.getElementById('form');
const id = document.getElementById('id');
const invalidPasswordText = document.getElementById('invalidPasswordText');
const invalidRePasswordText = document.getElementById('invalidRePasswordText');
//const invalidIdText = document.getElementById('invalidIdText');
//const verifyButton = document.getElementById('verifyButton');
//const loginForm = document.getElementById('loginForm');
//const alert = document.getElementById('alert');
// add class is-invalid when idInput,passwordInput,reenterpasswordInput are empty 
// set display block for every inccorect input field 
// if is-invalid is on and input changes, remove is-invalid from element 
// 

id.innerText = localStorage.getItem('id');

const inputs = [passwordInput,reenterPasswordInput]; 
const inputMessages = [invalidPasswordText,invalidRePasswordText]; 

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
            inputErrMsg.innerText = `Please enter a password`; 
            inputErrMsg.style.display = 'block';  
            isEmpty = true; 
        }   
    }

    return isEmpty; 
}

function checkIfPasswordsMatch(){
    if (passwordInput.value != reenterPasswordInput.value)
    {
        invalidRePasswordText.innerText = 'Passwords do not match';
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
    const data = {id,password};

    //console.log(data);
    
    const options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
    }

    await fetch("http://localhost:3001/setPassword",options); 
    //const userData = await fetch(`http://localhost:3001/getUser/${id}`).then(res => res.json()); 

    console.log(userData);

    

 





    



    

    

    
        
    

    
})


