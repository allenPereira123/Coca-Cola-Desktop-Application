const launchVRButton = document.getElementById('launchVR');


var child = require('child_process').execFile;
//var executablePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";


var executablePath = "C:\\Users\\allec\\Downloads\\VR\\VR\\VR-Placeholder.exe";

launchVRButton.addEventListener('click', () => {
    
    
    
    console.log('hello')
    
    child(executablePath, function(err, data) {
        if(err){
           console.error(err);
           return;
        }
     
        console.log(data.toString());
    });

})



