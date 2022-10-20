const path = require('path'); 


// child  process required to launch VR application from desktop app
// https://ourcodeworld.com/articles/read/154/how-to-execute-an-exe-file-system-application-using-electron-framework
var child = require('child_process').execFile;
//var executablePath = "C:\\Users\\al511555\\Documents\\Simulator\\Simulator.exe"
var executablePath = path.join(__dirname,'..\VR\VR-Placeholder.exe')

console.log(executablePath);

const productFeed = document.getElementById('product-feed');
const blankMagazine = document.getElementById('blank-magazine');
const collatingSystem = document.getElementById('collating-system-ob1');
const filmWrap = document.getElementById('film-wrap');
const blankFeed = document.getElementById('blank-feed')
const folding = document.getElementById('folding-gluing');
const overhead2 = document.getElementById('overhead2'); 
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
const launch = document.getElementById('launch-button'); 


// loads the table and nav header information
async function loadData(){
    
    let response = await fetch(`http://localhost:3001/getSignedInId`);
    
    if (!response.ok)
        return;

    let result = await response.json(); 
    console.log(result);

    greeting.innerText = `Welcome, ${result.fname} ${result.lname}`; 
    userType.innerText = `User Type : ${result.role}`

    response = await fetch(`http://localhost:3001/getUserProgress/${result.id}`); 

    if (!response.ok)
        return; 

    let userProgress = await response.json(); 

    // sets status of completion of sections from information hub 
    // 0 == incomplete 1 == complete
    productFeed.innerText = (userProgress.product_feed == 0) ? 'Incomplete' : 'Complete';
    blankMagazine.innerText = (userProgress.blank_magazine == 0) ? 'Incomplete' : 'Complete';
    collatingSystem.innerText = (userProgress.collating_system == 0) ? 'Incomplete' : 'Complete';
    filmWrap.innerText = (userProgress.film_wrap == 0) ? 'Incomplete' : 'Complete';
    blankFeed.innerText = (userProgress.blank_feed == 0) ? 'Incomplete' : 'Complete';
    folding.innerText = (userProgress.folding == 0) ? 'Incomplete' : 'Complete';
    overhead2.innerText = (userProgress.overhead2 == 0) ? 'Incomplete' : 'Complete';

    // widths of progress bars for scenario 1-4 determined by completion status
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

// launches the VR application once user clicks "launch application button"
launch.addEventListener('click', () => {
    child(executablePath, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }

        console.log(data.toString());
    });
})

