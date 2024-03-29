//const {getCurrentWindow} = require('electron');

const productFeed = document.getElementById('product-feed');
const blankMagazine = document.getElementById('blank-magazine');
const collatingSystem = document.getElementById('collating-system-ob1');
const filmWrap = document.getElementById('film-wrap');
const blankFeed = document.getElementById('blank-feed')
const folding = document.getElementById('folding-gluing');
const overhead2 = document.getElementById('overhead2'); 
const heatTunnel = document.getElementById('heat-tunnel');
const s1ProgressBar = document.getElementById('s1-progress-bar');
const s1ProgressPercentage = document.getElementById('s1-progress-percentage');
const s2ProgressBar = document.getElementById('s2-progress-bar');
const s2ProgressPercentage = document.getElementById('s2-progress-percentage');
const s3ProgressBar = document.getElementById('s3-progress-bar');
const s3ProgressPercentage = document.getElementById('s3-progress-percentage');
const s4ProgressBar = document.getElementById('s4-progress-bar');
const s4ProgressPercentage = document.getElementById('s4-progress-percentage');
const tutorial = document.getElementById('tutorial'); 
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
//const selectQuestion = document.getElementById('selectQuestion'); 
//const invalidSelectText = document.getElementById('invalidSelectText'); 
//const toast = document.getElementById('toast'); 
const viewUserProgress = document.getElementById('viewUserProgress');
const backButton = document.getElementById('back-button'); 
const passwordInput = document.getElementById('passwordInput'); 
const invalidPasswordText = document.getElementById('invalidPassword'); 
const rePassword = document.getElementById('re-enter'); 
const invalidRePassword = document.getElementById('invalidRePassword'); 
const invalidRoleText = document.getElementById('invalidRoleText'); 
////const secAnswer = document.getElementById('secAnswer'); 
//const invalidSecAnswerText = document.getElementById('invalidSecAnswerText'); 
const addUserModal = document.getElementById('addUserModal'); 
const errorAddingUserText = document.getElementById('errorAddingUserText');
const resetPasswordModal = document.getElementById('resetPasswordModal'); 
const resetPasswordModalButton = document.getElementById('resetPasswordModalButton'); // button
const modalPasswordInput = document.getElementById('modalPasswordInput'); // modal password input
const invalidModalPassword = document.getElementById('invalidModalPassword');// invalid modal password text 
const modalRePasswordInput = document.getElementById('modalRePasswordInput')// reenter modal passwod input
const invalidReModalPassword = document.getElementById('invalidReModalPassword');// reeenter invalid text
const userTypeInput = document.getElementById('userTypeInput'); 
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const addedUserToast = document.getElementById('added-user-toast');
const deletedUserToast = document.getElementById('deleted-user-toast');
const changedPassword = document.getElementById('changed-password-toast');
var addedUser = false; 
var users = []; 
var selectedUser = null; // global variable watchout

function handleResetPassword(event){

    let targetUser = null; 

    for (let index = 0; index < users.length; index++){
        if (event.target.id == index){
            targetUser = users[index]; 
            break;
        }
    }

    console.log(targetUser);
    selectedUser = targetUser; 
}

function handleModalEmptyFields(){
    let isEmpty = false; 
    
    if (modalPasswordInput.value === ''){
        modalPasswordInput.classList.add('is-invalid'); 
        invalidModalPassword.innerText = "Please enter a password";
        invalidModalPassword.style.display = 'block';
        isEmpty = true;  
    }

    if (modalRePasswordInput.value === ""){
        modalRePasswordInput.classList.add('is-invalid'); 
        invalidReModalPassword.innerText = "Please enter a password"; 
        invalidReModalPassword.style.display = 'block';
        isEmpty = true; 
    }

    return isEmpty;
}

function modalPasswordIncorrect(){
    if (modalPasswordInput.value != modalRePasswordInput.value)
    {   
        modalPasswordInput.classList.add('is-invalid'); 
        invalidModalPassword.innerText = "Passwords do not match";
        invalidModalPassword.style.display = 'block'; 
        modalRePasswordInput.classList.add('is-invalid'); 
        invalidReModalPassword.innerText = "Passwords do not match";
        invalidReModalPassword.style.display = 'block'; 
        return true;  
    }

    const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);
    console.log(passwordInput.value);
    if (!regex.test(modalPasswordInput.value)){
        modalPasswordInput.classList.add('is-invalid'); 
        invalidModalPassword.innerText = "Passwords must be atleast 8 characters,atleast one letter, one number, and one special character"
        invalidModalPassword.style.display = 'block'; 
        modalRePasswordInput.classList.add('is-invalid'); 
        invalidReModalPassword.innerText = "Passwords must be atleast 8 characters,atleast one letter, one number, and one special character";
        invalidReModalPassword.style.display = 'block'; 
        return true; 
    }

    return false;
}

resetPasswordModalButton.addEventListener('click',async () => {
    //console.log(selectedUser);

    if (handleModalEmptyFields() || modalPasswordIncorrect()){
        return; 
    }

    
    let id = selectedUser.id; 
    let password = modalPasswordInput.value; 
    let data = {id,password};
    console.log(data);


    let options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
    }

    let response = await fetch('http://localhost:3001/setPassword',options); 
    sessionStorage.setItem("changedPassword","true");
    window.location.reload();
});

resetPasswordModal.addEventListener('hidden.bs.modal',() => {
    let inputs = [modalPasswordInput,modalRePasswordInput];
    let messages = [invalidModalPassword,invalidReModalPassword];

    for (let i = 0; i < inputs.length; i++){
        inputs[i].classList.remove('is-invalid'); 
        inputs[i].value = ''; 
    }

    for (let i = 0; i < messages.length; i++){
        messages[i].style.display = 'none'; 
    }
});



addUserModal.addEventListener('hidden.bs.modal',() => {
    let inputs = [idInput,fnameInput,lnameInput,selectUserType,passwordInput,rePassword]; 

    let messages = [invalidIdText,invalidFnameText,invalidLnameText,invalidRoleText,invalidPasswordText,invalidRePassword];
    
    errorAddingUserText.style.display = 'none';

    for (let i = 0; i < inputs.length; i++){
        inputs[i].classList.remove('is-invalid'); 
        
        if (i === 3 || i === 6){
            inputs[i].value = 0; 
        }
        else
            inputs[i].value = ''; 
    }

    for (let i = 0; i < messages.length; i++){
        messages[i].style.display = 'none'; 
    }
});

loadData(); 

deleteModalButton.addEventListener('click',async (event) => {
    
    console.log(selectedUser.id);
    await fetch(`http://localhost:3001/deleteUser/${selectedUser.id}`,{method:'DELETE'});
    //http://localhost:3001/deleteUser/7462
    //loadData();
    //console.log("hello");
    sessionStorage.setItem('deletedUser',"true");
    loadData();
    
})


function handleDelete(event){

    let targetUser = null; 

    for (let index = 0; index < users.length; index++){
        if (event.target.id == index){
            targetUser = users[index]; 
            break;
        }
    }

    //console.log(targetUser);

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
    filmWrap.innerText = (userProgress.film_wrap == 0) ? 'Incomplete' : 'Complete';
    blankFeed.innerText = (userProgress.blank_feed == 0) ? 'Incomplete' : 'Complete';
    folding.innerText = (userProgress.folding == 0) ? 'Incomplete' : 'Complete';
    overhead2.innerText = (userProgress.overhead2 == 0) ? 'Incomplete' : 'Complete';
    heatTunnel.innerText = (userProgress.heat_tunnel == 0) ? 'Incomplete' : 'Complete';
    tutorial.innerText = (userProgress.tutorial == 0) ? 'Incomplete' : 'Complete';

    s1ProgressBar.style = `width:${userProgress.s1}%`; 
    s1ProgressPercentage.innerText = `${userProgress.s1}%`; 

    s2ProgressBar.style = `width:${userProgress.s2}%`; 
    s2ProgressPercentage.innerText = `${userProgress.s2}%`;

    s3ProgressBar.style = `width:${userProgress.s3}%`; 
    s3ProgressPercentage.innerText = `${userProgress.s3}%`;

    s4ProgressBar.style = `width:${userProgress.s4}%`; 
    s4ProgressPercentage.innerText = `${userProgress.s4}%`;
}

async function displayUsers(userType,filterCriteria){ 
    //let userTypesArr = ['All','Admin','Leader','Operator'];

    let response = await fetch(`http://localhost:3001/getSignedInId`);
    let signedInId = await response.json(); 
    console.log(signedInId.id);
    
    let tempUsers = users.filter((user) => {
        if (userType != null && userTypeInput.value != 'All' && userTypeInput.value != user.role){
            return false; 
        }
        
        if (filterCriteria != null && filterCriteria != user.fname && filterCriteria != user.lname && filterCriteria != user.id){
            return false; 
        }
        

        return true; 
    });
    
    while(tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }

    tempUsers.forEach((user,index) => {

        if (user.id == '0' || user.id === signedInId.id){
            return
        }

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

        const tdResetpassword = document.createElement('td'); 
        const resetPasswordButton = document.createElement('button'); 
        resetPasswordButton.setAttribute("class","btn btn-sm btn-secondary");
        resetPasswordButton.addEventListener('click',handleResetPassword); 
        resetPasswordButton.setAttribute('data-bs-toggle','modal'); 
        resetPasswordButton.setAttribute('data-bs-target','#resetPasswordModal');
        resetPasswordButton.setAttribute("id",`${index}`);  
        resetPasswordButton.innerText = 'Reset Password'; 
        tdResetpassword.append(resetPasswordButton); 
        
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
        
        tableRow.append(th,tdFname,tdLname,tdUserType,tdView,tdDelete,tdResetpassword); 
        tableBody.append(tableRow)
    });
}


async function loadData(){

    if (sessionStorage.getItem("addedUser") === 'true'){
        let toast = new bootstrap.Toast(addedUserToast); 
        toast.show();
        sessionStorage.removeItem("addedUser"); 
    }
    
    if (sessionStorage.getItem("deletedUser") === 'true'){
        let toast = new bootstrap.Toast(deletedUserToast); 
        toast.show();
        sessionStorage.removeItem("deletedUser"); 
    }
    
    if (sessionStorage.getItem("changedPassword") === 'true'){
        let toast = new bootstrap.Toast(changedPassword); 
        toast.show();
        sessionStorage.removeItem("changedPassword"); 
    }
    

    users = []; 
    let response = await fetch(`http://localhost:3001/getSignedInId`);
    
    if (!response.ok)
        return;

    let result = await response.json(); 

    
    //console.log(result);
    greeting.innerText = `${result.fname} ${result.lname}`; 
    userType.innerText = `User Type: ${result.role}`;

    let usersResponse = await fetch('http://localhost:3001/getAllUsers'); 

    if (!usersResponse.ok)
        return; 

    users = await usersResponse.json(); 
    //console.log(users);


    displayUsers(null,null); 
}

userTypeInput.addEventListener('change',() => {
    console.log(userTypeInput.value);
    displayUsers(userTypeInput.value);

})

searchInput.addEventListener('input',() => {
    if (searchInput.value === ''){
        displayUsers(userTypeInput.value); 
    }
})

searchButton.addEventListener('click',() => {
    if (searchInput.value != ''){
        displayUsers(userTypeInput.value,searchInput.value);
    }
})

modalPasswordInput.addEventListener('input',() => {
    modalPasswordInput.classList.remove('is-invalid'); 
    invalidModalPassword.style.display = 'none'; 
})

modalRePasswordInput.addEventListener('input', () => {
    modalRePasswordInput.classList.remove('is-invalid'); 
    invalidReModalPassword.style.display = 'none';
})

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

    if (selectUserType.value == 0){
        selectUserType.classList.add('is-invalid'); 
        invalidRoleText.innerText = "Please select a user role."; 
        invalidRoleText.style.display = 'block'; 
        isEmpty =  true;
    }

    if (isEmpty){
        errorAddingUserText.style.display = 'block';
    }
    
    return isEmpty;
}

function validatePassword(){
    if (passwordInput.value != rePassword.value)
    {   
        errorAddingUserText.style.display = 'block';
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

    if (handleEmptyFields() || validatePassword()){ 
        return;
    }
        

    let id = idInput.value; 
    let fname = fnameInput.value; 
    let lname = lnameInput.value;
    let password = passwordInput.value; 
    let role = ''; 
    
    if (selectUserType.value == 1)
        role = 'Operator'; 
    else if (selectUserType.value == 2)
        role = 'Leader'; 
    else
        role = 'Admin'; 


    data = {id,fname,lname,role,password,role};
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
        errorAddingUserText.style.display = 'block';
        return; 
    }

    sessionStorage.setItem("addedUser","true"); 
    window.location.reload();
})
