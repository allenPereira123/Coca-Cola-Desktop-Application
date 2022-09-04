const form = document.getElementById('form');
const idDiv = document.getElementById('id');
const invalidPasswordText = document.getElementById('invalidPasswordText');
const passwordInput = document.getElementById('passwordInput');

idDiv.innerText = localStorage.getItem('id'); 

passwordInput.addEventListener('input', () => {

    if (passwordInput.classList.contains('is-invalid')){
        passwordInput.classList.remove('is-invalid'); 
        invalidPasswordText.style.display = 'none'; 
    }
})

function handleEmpty(){
    passwordInput.classList.add('is-invalid'); 
    invalidPasswordText.innerText = 'Please enter a password'; 
    invalidPasswordText.style.display = 'block';
}

function setInvalid(){
    invalidPasswordText.style.display = 'block';
    invalidPasswordText.innerText = 'Invalid Password';
}

form.addEventListener('submit',async (event) => {
    event.preventDefault(); 

    if (passwordInput.value === '')
    {
        handleEmpty(); 
        return; 
    }

    const password = passwordInput.value; 
    const id = localStorage.getItem('id'); 
    const data = {id,password};

    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
    }

    const response = await fetch("http://localhost:3001/login",options); 
    
    if (!response.ok)
    {
        setInvalid();
        return; 
    }
    else
        console.log(response);



    //form.submit(); 
    

 





    



    

    

    
        
    

    
})







