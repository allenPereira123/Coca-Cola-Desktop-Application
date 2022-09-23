const form = document.getElementById('form');
const idInput = document.getElementById('idInput')
const invalidPasswordText = document.getElementById('invalidPasswordText');
const passwordInput = document.getElementById('passwordInput');
const invalidIdtext = document.getElementById('invalidIdText');


passwordInput.addEventListener('input', () => {

    if (passwordInput.classList.contains('is-invalid')){
        passwordInput.classList.remove('is-invalid'); 
        invalidPasswordText.style.display = 'none'; 
    }
})

idInput.addEventListener('input', () => {

    if (idInput.classList.contains('is-invalid')){
        idInput.classList.remove('is-invalid'); 
        invalidIdtext.style.display = 'none'; 
    }
})

function setInvalid(){
    invalidPasswordText.style.display = 'block';
    invalidPasswordText.innerText = 'Invalid Password.';
    passwordInput.classList.add('is-invalid');
}

function checkEmptyFields(){
    let isEmpty = false; 
    
    if (idInput.value === '')
    {
        idInput.classList.add('is-invalid'); 
        invalidIdtext.innerText = 'Please enter an employee id.'; 
        idInput.style.display = 'block';
        isEmpty = true; 
    }

    if (passwordInput.value === '')
    {
        passwordInput.classList.add('is-invalid'); 
        invalidPasswordText.innerText = 'Please enter a password.'; 
        invalidPasswordText.style.display = 'block';
        isEmpty = true; 
    }

    return isEmpty;

}

form.addEventListener('submit',async (event) => {
    event.preventDefault(); 

    if (checkEmptyFields())
        return; 
    

    let id = idInput.value; 
    let user = await fetch(`http://localhost:3001/getUser/${id}`);
    
    if (!user.ok)
    {
        idInput.classList.add('is-invalid'); 
        invalidIdText.innerText = 'Id not found';
        invalidIdText.style.display = 'block';
        return;
    } 

    const password = passwordInput.value; 
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

    let sendId = await fetch(`http://localhost:3001/setId/${id}`); 

    if (!sendId.ok)
        console.log('id not ok')

        let newUser = await user.json(); 
    
    if (newUser.role === "Operator")
        form.action = 'operator.html'; 
    else if (newUser.role === "Leader")
        form.action = 'leader.html'; 
    else
        form.action = 'admin.html'; 


    form.submit(); 
    
})