const { contextBrige, ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    loadPage: (title) => ipcRenderer.send('loadPage', title)

})


// preload scripts use context bridge to set communication from render to main process 

// the content that is displayed by the render window (html,js) can now use windows.loadPage defined above. This is used on the onClick button.

// .loadPage is a function attached to the button in index.html that sends the name of the file back to the main process, so that the main process can load that html file after the button is clicked 

// index.js code in ran because index.html is in rendered process and refers to it with its <script></script> tags



/*
    ---Context Isolation---

    allows for electrons logic and prelaod scripts to run seperatley from the contents loaded into browswer window 

    prevents the website from acessing node api that preload scripts has access too. 

    context isolation enabled allows the preload script and the render process to share the same window object 

    ---InterProcess Communication---

*/