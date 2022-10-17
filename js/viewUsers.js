

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
const s4ProgressBar = document.getElementById('s4-progress-bar');
const s4ProgressPercentage = document.getElementById('s4-progress-percentage');
const greeting = document.getElementById('greeting'); 
const userType = document.getElementById('userType'); 
const logout = document.getElementById('logout');
const tableBody = document.getElementById('tableBody');
const viewUserProgress = document.getElementById('viewUserProgress');
const backButton = document.getElementById('back-button'); 
const userTypeInput = document.getElementById('userTypeInput'); 
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');


var users = []; 
var selectedUser = null; // global variable watchout


loadData(); 

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

    viewUserProgress.innerText = `User ${targetUser.id} Progress Log`

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

    s4ProgressBar.style = `width:${userProgress.s4}%`; 
    s4ProgressPercentage.innerText = `${userProgress.s4}%`;
}

function displayUsers(userType,filterCriteria){
    
    let tempUsers = users.filter((user) => {
        if (userType != null && userTypeInput.value != 'All' && userTypeInput.value != user.role){
            return false; 
        }
        
        if (filterCriteria != null && filterCriteria != user.fname && filterCriteria != user.lname && filterCriteria != user.id){
            return false; 
        }
        

        return true; 
    });

    console.log(tempUsers);
    
    while(tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }

    tempUsers.forEach((user,index) => {
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
        
        
        tableRow.append(th,tdFname,tdLname,tdUserType,tdView); 
        tableBody.append(tableRow)
    });
}


async function loadData(){

    let response = await fetch(`http://localhost:3001/getSignedInId`);
    
    if (!response.ok)
        return;

    let result = await response.json(); 
    console.log(result);

    greeting.innerText = `${result.fname} ${result.lname}`;
    userType.innerText = `User Type: ${result.role}`  
    //userType.innerText = `User role: ${result.role}`;

    let usersResponse = await fetch('http://localhost:3001/getAllUsers'); 

    if (!usersResponse.ok)
        return; 

    users = await usersResponse.json(); 
    console.log(users);

    displayUsers(); 
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

