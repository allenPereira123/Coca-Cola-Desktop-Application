const {getCurrentWindow} = require('electron');

const productFeed = document.getElementById('product-feed');
const blankMagazine = document.getElementById('blank-magazine');
const collatingSystem = document.getElementById('collating-system');
const blankSuction = document.getElementById('blank_suction');
const gluing = document.getElementById('gluing');
const filmWrap = document.getElementById('film-wrap');
const hmi = document.getElementById('hmi');
const blankFeed = document.getElementById('blank-feed')
const folding = document.getElementById('folding');
const s1ProgressBar = document.getElementById('s1-progress-bar');
const s1ProgressPercentage = document.getElementById('s1-progress-percentage');
const s2ProgressBar = document.getElementById('s2-progress-bar');
const s2ProgressPercentage = document.getElementById('s2-progress-percentage');
const s3ProgressBar = document.getElementById('s3-progress-bar');
const s3ProgressPercentage = document.getElementById('s3-progress-percentage');
const greeting = document.getElementById('greeting'); 
const userType = document.getElementById('userType'); 
const logout = document.getElementById('logout');
const deleteUserMessage = document.getElementById('deleteUserMessage');
const deleteModalButton = document.getElementById('deleteModalButton')
const tableBody = document.getElementById('tableBody');
const displayAddUserModalButton = document.getElementById('launch-button');
const addUserButton = document.getElementById('addUserButton');
const idInput = document.getElementById('idInput'); 
const invalidIdText = document.getElementById('invalidIdText'); 
const fnameInput = document.getElementById('fnameInput'); 
const invalidFnameText = document.getElementById('invalidFnameText'); 
const lnameInput = document.getElementById('lnameInput'); 
const invalidLnameText = document.getElementById('invalidLnameText'); 
const selectUserType = document.getElementById('selectUserType'); 
const selectQuestion = document.getElementById('selectQuestion'); 
const invalidSelectText = document.getElementById('invalidSelectText'); 
const toast = document.getElementById('toast'); 
const viewUserProgress = document.getElementById('viewUserProgress');
const backButton = document.getElementById('back-button'); 
const passwordInput = document.getElementById('passwordInput'); 
const invalidPasswordText = document.getElementById('invalidPassword'); 
const rePassword = document.getElementById('re-enter'); 
const invalidRePassword = document.getElementById('invalidRePassword'); 
const invalidRoleText = document.getElementById('invalidRoleText'); 
const secAnswer = document.getElementById('secAnswer'); 
const invalidSecAnswerText = document.getElementById('invalidSecAnswerText'); 


var users = []; 
var selectedUser = null; // global variable watchout
var userCnt = 0; 


loadData(); 

deleteModalButton.addEventListener('click',async (event) => {
    
    console.log(selectedUser.id);
    await fetch(`http://localhost:3001/deleteUser/${selectedUser.id}`,{method:'DELETE'});
    //http://localhost:3001/deleteUser/7462
    window.location.reload(); 
    console.log("hello");
    
})


async function handleDelete(event){

    let targetUser = null; 

    for (let index = 0; index < users.length; index++){
        if (event.target.id == index){
            targetUser = users[index]; 
            break;
        }
    }

    console.log(targetUser);

    deleteUserMessage.innerText = `Deleting user ${targetUser.id} cannot be undone.`

    selectedUser = targetUser; 
}

async function handleView(event){
    //console.log(event.target.id); 
    let targetUser = null; 

    for (let index = 0; index < users.length; index++){
        if (event.target.id == index){
            targetUser = users[index]; 
            break;
        }
    }

    let response = await fetch(`http://localhost:3001/getUserProgress/${targetUser.id}`);

    if (!response.ok)
        return; 

    viewUserProgress.innerText = `User ${targetUser.id} Progress Log`;


    let userProgress = await response.json(); 

    productFeed.innerText = (userProgress.product_feed == 0) ? 'Incomplete' : 'Complete';
    blankMagazine.innerText = (userProgress.blank_magazine == 0) ? 'Incomplete' : 'Complete';
    collatingSystem.innerText = (userProgress.collating_system == 0) ? 'Incomplete' : 'Complete';
    blankSuction.innerText = (userProgress.blank_suction == 0) ? 'Incomplete' : 'Complete';
    gluing.innerText = (userProgress.gluing == 0) ? 'Incomplete' : 'Complete';
    filmWrap.innerText = (userProgress.film_wrap == 0) ? 'Incomplete' : 'Complete';
    hmi.innerText = (userProgress.hmi == 0) ? 'Incomplete' : 'Complete';
    blankFeed.innerText = (userProgress.blank_feed == 0) ? 'Incomplete' : 'Complete';
    folding.innerText = (userProgress.folding == 0) ? 'Incomplete' : 'Complete';

    s1ProgressBar.style = `width:${userProgress.s1}%`; 
    s1ProgressPercentage.innerText = `${userProgress.s1}%`; 

    s2ProgressBar.style = `width:${userProgress.s2}%`; 
    s2ProgressPercentage.innerText = `${userProgress.s2}%`;

    s3ProgressBar.style = `width:${userProgress.s3}%`; 
    s3ProgressPercentage.innerText = `${userProgress.s3}%`;
}

function displayUsers(){

    users.forEach((user,index) => {
        const tableRow = document.createElement('tr'); 
        const th = document.createElement('th'); 
        th.setAttribute("scope","row");
        th.innerText = `${user.id}`; 
        
        const tdFname = document.createElement('td'); 
        tdFname.innerText = `${user.fname}`; 
        
        const tdLname = document.createElement('td'); 
        tdLname.innerText = `${user.lname}`; 
       
        const tdUserType = document.createElement('td'); 
        tdUserType.innerText = `${user.role}`; 
        
        const tdView = document.createElement('td'); 
        const viewButton = document.createElement('button'); 
        viewButton.setAttribute("class","btn btn-sm btn-dark"); 
        viewButton.addEventListener('click',handleView);
        viewButton.setAttribute("data-bs-toggle","modal");
        viewButton.setAttribute("id",`${index}`); 
        viewButton.setAttribute("data-bs-target","#viewUserModal")
        viewButton.innerText = `View`; 
        tdView.append(viewButton); 
        
        const tdDelete = document.createElement('td');
        const deleteButton = document.createElement('button'); 
        deleteButton.setAttribute("class","btn btn-sm btn-danger");
        deleteButton.setAttribute('data-bs-target','#deleteUserModal');  
        deleteButton.setAttribute('data-bs-toggle','modal');
        deleteButton.setAttribute('id',`${index}`);  
        deleteButton.addEventListener('click',handleDelete); 
        deleteButton.innerText = `Delete`
        tdDelete.append(deleteButton);
        
        tableRow.append(th,tdFname,tdLname,tdUserType,tdView,tdDelete); 
        tableBody.append(tableRow)
    });
}


async function loadData(){

    let response = await fetch(`http://localhost:3001/getSignedInId`);
    
    if (!response.ok)
        return;

    let result = await response.json(); 
    console.log(result);

    greeting.innerText = `Hello, ${result.fname} ${result.lname}`; 
    userType.innerText = `User role: ${result.role}`;

    let usersResponse = await fetch('http://localhost:3001/getAllUsers'); 

    if (!usersResponse.ok)
        return; 

    users = await usersResponse.json(); 
    console.log(users);

    displayUsers(); 
}

idInput.addEventListener('input', () => {
    idInput.classList.remove('is-invalid'); 
    invalidIdText.style.display = 'none'; 
})

fnameInput.addEventListener('input',() => {
    fnameInput.classList.remove('is-invalid'); 
    invalidFnameText.style.display = 'none'; 
})

lnameInput.addEventListener('input', () => {
    lnameInput.classList.remove('is-invalid'); 
    invalidLnameText.style.display = 'none'; 
})

selectUserType.addEventListener('input', () => {
    selectUserType.classList.remove('is-invalid'); 
    invalidRoleText.style.display = 'none'; 
})

passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove("is-invalid"); 
    invalidPasswordText.style.display = 'none'; 
})

rePassword.addEventListener('input',() => {
    rePassword.classList.remove('is-invalid'); 
    invalidRePassword.style.display = 'none';
})

selectQuestion.addEventListener('input',() => {
    selectQuestion.classList.remove('is-invalid'); 
    invalidSelectText.style.display = 'none';
}); 

secAnswer.addEventListener('input', () => {
    secAnswer.classList.remove('is-invalid'); 
    invalidSecAnswerText.style.display = 'none';
})

function handleEmptyFields(){
    let isEmpty = false; 

    if (idInput.value === ''){
        idInput.classList.add('is-invalid'); 
        invalidIdText.innerText = 'Please enter an ID.'; 
        invalidIdText.style.display = 'block'; 
        isEmpty =  true;
    }
    if (fnameInput.value === ''){
        fnameInput.classList.add('is-invalid'); 
        invalidFnameText.innerText = 'Please enter a first name.';
        invalidFnameText.style.display = 'block';
        isEmpty =  true;                                                                            
    }
    if (lnameInput.value === ''){
        lnameInput.classList.add('is-invalid'); 
        invalidLnameText.innerText = 'Please enter a last name.'; 
        invalidLnameText.style.display = 'block'; 
    }
    if (passwordInput.value === ''){
        passwordInput.classList.add('is-invalid'); 
        invalidPasswordText.innerText = 'Please enter a password.'; 
        invalidPasswordText.style.display = 'block'; 
        isEmpty =  true; 
    }
    if (rePassword.value === ''){
        rePassword.classList.add('is-invalid'); 
        invalidRePassword.innerText = 'Please enter a password.'; 
        invalidRePassword.style.display = 'block';
        isEmpty =  true;  
    }
    if (selectQuestion.value == 0){
        selectQuestion.classList.add('is-invalid'); 
        invalidSelectText.innerText = 'Please select a security question.'; 
        invalidSelectText.style.display = 'block'; 
        isEmpty =  true; 
    }
    if (selectUserType.value == 0){
        selectUserType.classList.add('is-invalid'); 
        invalidRoleText.innerText = "Please select a user role."; 
        invalidRoleText.style.display = 'block'; 
        isEmpty =  true;
    }
    if (selectUserType.value == 0){
        selectUserType.classList.add('is-invalid'); 
        invalidRoleText.innerText = "Please select a user role."; 
        invalidRoleText.style.display = 'block'; 
        isEmpty =  true;
    }
    if (secAnswer.value == 0){
        secAnswer.classList.add('is-invalid'); 
        invalidSecAnswerText.innerText = "Please enter an answer."; 
        invalidSecAnswerText.style.display = 'block'; 
        isEmpty =  true;
    }
    return isEmpty;
}

function validatePassword(){
    if (passwordInput.value != rePassword.value)
    {
        passwordInput.classList.add('is-invalid'); 
        invalidPasswordText.innerText = "Passwords do not match";
        invalidPasswordText.style.display = 'block'; 
        rePassword.classList.add('is-invalid'); 
        invalidRePassword.innerText = "Passwords do not match";
        invalidRePassword.style.display = 'block'; 
        return true;  
    }

    //"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"

    const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);
    console.log(passwordInput.value);
    if (!regex.test(passwordInput.value)){
        passwordInput.classList.add('is-invalid'); 
        invalidPasswordText.innerText = "Passwords must be atleast 8 characters,atleast one letter, one number, and one special character"
        invalidPasswordText.style.display = 'block'; 
        rePassword.classList.add('is-invalid'); 
        invalidRePassword.innerText = "Passwords must be atleast 8 characters,atleast one letter, one number, and one special character";
        invalidRePassword.style.display = 'block'; 
        return true; 
    }

    return false; 
}

addUserButton.addEventListener('click',async () => {

    if (handleEmptyFields() || validatePassword())
        return;

    let id = idInput.value; 
    let fname = fnameInput.value; 
    let lname = lnameInput.value;
    let password = passwordInput.value; 
    let secQ = selectQuestion.value;
    let secA = secAnswer.value; 
    let role = ''; 
    
    if (selectUserType.value == 1)
        role = 'Operator'; 
    else if (selectUserType.value == 2)
        role = 'Leader'; 
    else
        role = 'Admin'; 


    data = {id,fname,lname,role,password,role,secQ,secA};
    console.log(data);



    let options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
    }

    
    let successfulAdd = await fetch(`http://localhost:3001/addUser`,options);

       
    if (!successfulAdd.ok){
        idInput.classList.add('is-invalid'); 
        invalidIdText.innerText = "User already exists."
        invalidIdText.style.display = "block";
        return; 
    }

    window.location.reload();

})
