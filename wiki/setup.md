This page describes how to get started with running and editing the code now that you have a GitLab account. You have to be using Windows 7 or later.
### 1) GitHub Desktop
In order to avoid messing around in a terminal interface in order to observe or help with progress, you need a GUI that offers Git support. There's a program called GitHub Desktop which offers just that and although it's made by GitHub and designed for it's users, you should use it too. **[Download it here](https://desktop.github.com/)**.  
You do not have to make a GitHub account but bad things won't happen to you if you do. After you install GitHub Desktop you should be able to find GitHub and Git Shell via start menu and desktop shortcuts
### 2) Node.js
Decibel is written in Node.js which is pretty much JavaScript++. **[Download the 'For Most Users' option here](https://nodejs.org/en/)** and run the installer.
### 3) Windows terminal related fun
Decide on a folder to put all the Decibel related stuff in, keeping in mind that it will contain two folders named Decibel and Decibel-wiki respectively. Save a .bat file inside of the folder, and put this code in that .bat file.

```
git clone https://gitlab.com/BEARUK/Decibel.git
git clone https://gitlab.com/BEARUK/Decibel.wiki.git
cd Decibel
npm install
cd electron
npm install
```
If you were wondering what npm was, it's a package manager for Node.js. The install command installs all the packages that the Decibel code says it needs.  
You must now open the Git Shell that was installed along with GitHub Desktop and use cd commands to end up in the same folder as the .bat file. You should then run the .bat file with the command .\FILENAME.bat. Below is an example:
```
C:\Programs\Dev\GitHub> cd /
C:\> cd .\Users\Tom\Desktop\boop\
C:\Users\Tom\Desktop\boop> .\DONTRUNME.bat
```
When running the first command it will probably ask you for your GitLab username and password. When entering your password be aware that:

1.  You probably can't see what you are typing
2.  You almost definitely can't use the backspace key

At the end of this process you might get a warning about no repository field but that's probably unimportant.
### 4) Using GitHub Desktop
Open GitHub desktop and open a file explorer window showing you the newly created Decibel and Decibel-wiki folders. Drag the folders one by one to the left of the GitHub desktop window and they should appear there. You should be able to click on one of the folders and click sync at the top right to download the latest changes. You can open the folders from here by right clicking them in the GitHub desktop client and choose 'Open in Explorer'.  
At the top you can click Changes and History to switch between viewing the changes you've made and viewing the changes made in the past. It's super cool.  
Something that should probably be noted is that after committing a change it looks like you have to click Sync to actually get the server to notice your commit.
### 5) Running Decibel
Go to the decibel folder and double click client.bat (or server.bat). You may find you need to change the address that the client thinks the server is at, which is done by changing line 9 of app/client.js. For example if you want to connect to 123.54.76.89 . . .
```
var serverAddress = "127.0.0.1";
Should be changed to
var serverAddress = "123.54.76.89";
```
If you want your server to be accessible to clients on different networks then you must open [port 5040](https://portforward.com/).
