console.log('Welcome ');
alert('WElcome welcome')

const {ipcRenderer} = require('electron');

ipcRenderer.send('chan','Hello from renderer.js');
ipcRenderer.on('chan',(e,args)=>{
  console.log(args+' from renderer');
})

// const {ipcRenderer} = require('electron')
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
//
// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   console.log(arg) // prints "pong"
// })
// ipcRenderer.send('asynchronous-message', 'ping')
