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
const select = document.getElementById('select'); 
const invalidSelectText = document.getElementById('invalidSelectText'); 
const toast = document.getElementById('toast'); 

var users = []; 
var selectedUser = null; // global variable watchout




deleteModalButton.addEventListener('click',async (event) => {
    
    console.log(selectedUser.id);
    await fetch(`http://localhost:3001/deleteUser/${selectedUser.id}`,{method:'DELETE'});
    //http://localhost:3001/deleteUser/7462
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

    deleteUserMessage.innerText = `Delete employee ${targetUser.id}: ${targetUser.fname} ${targetUser.lname}`

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
    //console.log(targetUser.id);
    let response = await fetch(`http://localhost:3001/getUserProgress/${targetUser.id}`);

    if (!response.ok)
        return; 


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

select.addEventListener('input', () => {
    select.classList.remove('is-invalid'); 
    invalidSelectText.style.display = 'none'; 
})

function handleEmptyFields(){
    
    if (idInput.value === ''){
        idInput.classList.add('is-invalid'); 
        invalidIdText.innerText = 'Please enter an ID.'; 
        invalidIdText.style.display = 'block'; 
    }
    if (fnameInput.value === ''){
        fnameInput.classList.add('is-invalid'); 
        invalidFnameText.innerText = 'Please enter a first name.';
        invalidFnameText.style.display = 'block'; 
    }
    if (lnameInput.value === ''){
        lnameInput.classList.add('is-invalid'); 
        invalidLnameText.innerText = 'Please enter a last name'; 
        invalidLnameText.style.display = 'block'; 
    }
    if (select.value == 0){
        select.classList.add('is-invalid'); 
        invalidSelectText.innerText = "Please select an employee role"; 
        invalidSelectText.style.display = 'block'; 
    }
}

addUserButton.addEventListener('click',async () => {

    if (idInput.value === '' || fnameInput === '' || lnameInput === '' || select.value == 0)
    {
        handleEmptyFields(); 
        return; 
    }

    let id = idInput.value; 
    let fname = fnameInput.value; 
    let lname = lnameInput.value;
    let role = '' 
    
    if (select.value == 1)
        role = 'Operator'; 
    else if (select.value == 2)
        role = 'Leader'; 
    else
        role = 'Admin'; 

    data = {id,fname,lname,role};
    
    console.log(data);

    
    let options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
    }

    //let successfulAdd = await fetch(`http://localhost:3001/addUser`,options); 

    let initToast = new bootstrap.Toast(toast); 
    initToast.show(); 

})


loadData(); 