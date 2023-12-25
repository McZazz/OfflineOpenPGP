### Desktop app providing completely offline encrypted Open PGP message writing, message encryption, decryption and contacts management. Utilizes NWJS, Openpgpjs, and Appdata-path.

Tested on NWJS v0.71.0.

Encrypt and decrypt messages, manage public keys of your contacts and manage multiple keysets of your own, completely in text format. You can see all your keys, all the public keys of your contacts and edit them directly. This data is saved as text in json files, nothing is hidden from you. 

No plugins, no links to any services are needed, do it all in text offline so you have control of your data. Public keys are safe to be sent over any service, encrypted messages are safe to be sent over any service, assuming that the OpenPGPJS library is not and does not become garbage. No safety is guaranteed, so don't trust your device, nor your software, verify that it works instead.

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

Place the unpacked nwjs app directory in your applications folder.

The OfflineOpenPGP source files can be dumped in the nwjs top level folder, or kept in a separate location.

In the OfflineOpenPGP src directory, set Mac titlebar buttons in main.js by finding this: "globals['is_mac'] = false;" and changing it to this:
"globals['is_mac'] = true;"

Make sure you have NPM installed, and inside the OfflineOpenPGP src folder with package.json run:
npm install

(the following will be what you do to start the app each time):
Open a terminal inside the nwjs executable app directory, run the following command to start it, with the path pointing to the src folder in the Offline Open PGP folder: 

open -n -a "[path/to/nwjs-sdk]" --args "[path/to/app-src]"

Example (src is separate, on the desktop. nwjs-sdk is also on desktop): 

open -n -a "/Users/macbook/Desktop/nwjs-sdk/nwjs.app/Contents/MacOS/nwjs" --args "/Users/macbook/Desktop/app-src"; 

Your saved data can be found in your system level user data folder, inside a directory named "OfflineOpenPgp".



## Linux:
go to nwjs.io, and download the "Normal" version of nwjs for Linux.
Extract it to the directory of your choice.

copy the contents of the "src" folder of Offline Open PGP into the nwjs top level folder.

Make sure you have NPM installed, make sure you are still in the top level folder (package.json is present) and run:
npm install

Run either of the following commands to start it: 

(separate src inside nwjs folder) 

./nw .

(all source files inside same nwjs folder) 

./nw

Your saved data can be found in your system level user data directory, inside a directory named "OfflineOpenPgp", likely here: "/home/dev2/.config/OfflineOpenPgp". This was tested on Linux Mint, however other versions of Linux may not be friendly with this concenpt so if it is not saving anything, you will have to modify the source to point to a hardcoded directoy.

## Development:
This project is written 100% in object oriented Vanilla JS.
If you find this project useful, feel free to dump a tiny bit of crypto in my wallet. Future public releases of this app are not guaranteed.

## 

ZEC: 

t1SFSSr6Da8jVLCq4GMqvuWtkBgLN6ssFho
## 
BTC: 

bc1q7q2ewrhw5wcmuc3gsd54vdkdywx60zamfj93qn

## 

## Dependencies:
              nwjs
https://github.com/nwjs/nw.js

              appdata-path
https://github.com/demurgos/appdata-path

                openpgpjs
https://github.com/openpgpjs/openpgpjs
