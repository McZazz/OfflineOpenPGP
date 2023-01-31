### Completely offline encrypted message writing, message encryption and decryption and contacts management. 

Encrypt, decrypt, manage public keys of your contacts and manage multiple keysets of your own, completely in text format. You can see all your keys, all the public keys of your contacts and edit them directly. This data is saved as text in json files, nothing is hidden from you. 

No plugins, no links to any services are needed, do it all in text offline so you have control of your data. Public keys are safe to be sent over any service, encrypted messages are safe to be sent over any service. 

You are not fully protected if you are online while using this. You are not fully protected if your os / device is already hacked. You are not fully protected if you are using this on the same computer you use to access the internet. Private keys and their passwords are NOT safe to send at all. 

![image](https://raw.githubusercontent.com/McZazz/OfflineOpenPGP/main/incoming.jpg "incoming page of OfflineOpenPGP")

## 
![image](https://github.com/McZazz/OfflineOpenPGP/blob/main/outgoing.jpg "outgoing page of OfflineOpenPGP")

## 

## Install instructions: 

## Windows:
Go to nwjs.io, and download the "Normal" version of nwjs for Windows.

Copy the contents of the "src" folder of Offline Open PGP into the nwjs top level folder.

Make sure you have NPM installed, make sure you are still in the top level folder (package.json is present) and run:
npm install

nw.exe is the application that starts the app, double click it or make a shortcut.

Your saved data will be found in the appdata folder:
C:\Users\[your-windows-user-name]\AppData\Roaming\OfflineOpenPgp



## Mac:
go to nwjs.io, and download the "Normal" version of nwjs for Mac

Place the app in your applications folder and open a terminal in the Offline Open PGP application folder.

Set Mac titlebar buttons in main.js by finding this: "globals['is_mac'] = false;" and changing it to this:
"globals['is_mac'] = true;"

Make sure you have NPM installed, and enter the src folder with package.json and run:
npm install

Run the following command to start it, with the path pointing to the src folder in the Offline Open PGP folder:
open -n -a nwjs --args "[path/to/src]"

Example (src is separate, on the desktop):
open -n -a nwjs --args "Users/macbook/Desktop/src"

Your saved data can be found in your system level user data folder, inside a directory named "OfflineOpenPgp".



## Linux:
go to nwjs.io, and download the "Normal" version of nwjs for Linux.
Extract it to the directory of your choice.

copy the contents of the "src" folder of Offline Open PGP into the nwjs top level folder.

Make sure you have NPM installed, make sure you are still in the top level folder (package.json is present) and run:
npm install

(separate src inside nwjs folder)
./nw .

(all source files inside same nwjs folder)
./nw

/home/dev2/.config/OfflineOpenPgp

Your saved data can be found in your system level user data directory, inside a directory named "OfflineOpenPgp". This was tested on Linux Mint, however other versions of Linux may not be friendly with this concenpt so if it is not saving anything, you will have to modify the source to point to a hardcoded directoy.


## Dependencies:
              nwjs
https://github.com/nwjs/nw.js

              appdata-path
https://github.com/demurgos/appdata-path

                openpgpjs
https://github.com/openpgpjs/openpgpjs
