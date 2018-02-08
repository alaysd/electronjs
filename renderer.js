// console.log('Welcome ');
// alert('WElcome welcome')
//
// const {ipcRenderer} = require('electron');
//
// // Sends the message asynchronously
// ipcRenderer.send('chan','Hello from renderer.js');
// ipcRenderer.on('chan',(e,args)=>{
//   console.log(args+' :FROM RENDERER');
// });
//
// ipcRenderer.send('chan2','Hello from channel 2');
// ipcRenderer.on('chan2',(e,args)=>{
//   console.log(args+' :FROM CHANNEL 2');
// })
// ipcRenderer.on('private',(e,args)=>{
//   console.log(args);
// })
//
// let syncMess = ipcRenderer.sendSync('sync-channel','The Dark Knight')
// console.log('Sync',syncMess);
//
// let syncMess2 = ipcRenderer.sendSync('sync-channel',{name:'Alay',surname:'sd'});
// console.log(syncMess2);

// Require api
// const {remote} = require('electron');
// console.log(remote);

// var {dialog, BrowserWindow} = require('electron').remote;
// dialog.showMessageBox({message:'A message dailog invoked via remove', buttons:['OK']})
// let win = new BrowserWindow({width:400,height:200})
// win.loadURL('http://google.com')
// const remote = require('electron').remote;
// console.log(remote.getGlobal('app_version'));
const {dialog, app} = require('electron').remote;
dialog.showMessageBox({message:'Quit', buttons:['Yes','No']},(buttonIndex)=>{
  if(buttonIndex ===0) app.quit();
})
