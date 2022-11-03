const path = require('path'); 
var child = require('child_process').execFile;
var executablePath = path.join(__dirname,'..\\Builds\\Simulator.exe')

const refresh = document.getElementById('refresh');
const productFeed = document.getElementById('product-feed');
const blankMagazine = document.getElementById('blank-magazine');
const collatingSystem = document.getElementById('collating-system-ob1');
const blankSuction = document.getElementById('blank_suction');
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
const launch = document.getElementById('launch-button'); 



async function loadData(){
    
    let response = await fetch(`http://localhost:3001/getSignedInId`);
    
    if (!response.ok)
        return;

    let result = await response.json(); 
    console.log(result);

    greeting.innerText = `Welcome, ${result.fname} ${result.lname}`; 
    userType.innerText = `User Type : ${result.role}`

    //REMEBER TO USE ID FROM USER
    response = await fetch(`http://localhost:3001/getUserProgress/${result.id}`); 

    if (!response.ok)
        return; 

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

loadData(); 

refresh.addEventListener('click',() => {
    window.location.reload();
})

launch.addEventListener('click', () => {
    child(executablePath, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }

        console.log(data.toString());
    });
})
