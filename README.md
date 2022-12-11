# Coca-Cola Desktop Application 
The desktop application portion of the VR training platform manages/creates user accounts, launches the VR simulation, and displays progress the users have made in the VR section of the training platform.

## Installations/Dependencies 
* NodeJS
* Visual Studio 2019
  * Upon installation, check off all python options. Sqlite3 requires python installation, and this method worked for us. Seperate python installation would throw error.
* DB Browser for SQLite (not required)
  * DB Browser is a simple database GUI we used that worked well with our project

After cloning the repo, use node package manager to download all dependencies. 
``` bash
npm i
```

## Running The Application
Use the command below to start the desktop application
``` bash
npm run start
```
## Building Distributable 
Running this make script allows Electron Forge to generate platform specific distributables. This script creates a directory named "out" in your project that contains the .exe and installer needed for installation of application.
``` bash
npm run make
```

## Installing The Application
From the out directory travel this path out --> make --> Squirrel.windows --> x64 --> Setup.exe. By clicking Setup.exe, this launches the Squirrel.Windows installer which officially installs the application on your machine. 

## Launching Installed Application 
The application can now be launched via clicking the desktop shortcut or clicking the windows start menu shortcut. 



