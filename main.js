const {app, BrowserWindow} = require('electron')
const path = require('path');
const url = require('url');
require('electron-reload')(__dirname)
let win;
let childWindow;

var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const windowStateKeeper = require('electron-window-state');


bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        console.log('Mypassowrd',hash);
    });
});
// require('devtron').install()

// app.on('browser-window-focus',()=>{
//   console.log("---------------\nApp focused\n---------------");
// })

function createWindow(){

  // let winState = windowStateKeeper({
  //   defaultWidth:1200,
  //   defaultHeight:600
  // })
  // This way we can save the past position of window
  // win = new BrowserWindow({width: winState.width,height: winState.height,x: winState.x,y:winState.y,minWidth:480,minHeight:600});
  // winState.manage(win);
  //win = new BrowserWindow({width:1200,height:600,frame:false,minWidth:480,minHeight:600})
  // childWindow = new BrowserWindow({width:800,height:500,parent:win, modal:true,show:false});
  //childWindow = new BrowserWindow({width:800,height:500,parent:win, show:false});
  win = new BrowserWindow({width:1200,height:800})
  win.loadURL(url.format({
    pathname: path.join(__dirname,'index.html'),
    protocol: 'file:',
    slashes:true
  }))

  // win.loadURL('http://www.github.com');
  // win.loadURL('file://${__dirname}/index.html');


  // childWindow.loadURL(url.format({
  //   pathname: path.join(__dirname,'index_child.html'),
  //   protocol:'file',
  //   slashes:true
  // }))

  //childWindow.loadURL('http://www.google.co.in');

  // childWindow.once('ready-to-show',()=>{
  //   childWindow.show();
  // })

  win.on("closed",()=>{
    win = null;
  })

  win.on("focus",()=>{
    // console.log("Main window focused\n-----------------");
  })

  // childWindow.on("focus",()=>{
  //   // console.log("child window focused");
  // })

  // childWindow.on('blur',()=>{
  //   win.close();
  // })

  // childWindow.on("closed",()=>{
  //   childWindow = null;
  // })

  // webContents
  // webContents is an EventEmitter. It is responsible for rendering and controlling a web page and is a property of the BrowserWindow object.
  let winContents = win.webContents;
  // console.log(winContents);
  // winContents.on('did-finish-load',()=>{
  //   console.log('github.com loaded');
  // });

  // winContents.on('new-window',(e,url)=>{
  //   console.log('new window created for:',url);
  // });
  winContents.on('new-window',(e,url)=>{
    console.log('new window created for:',url);
    e.preventDefault();
    let modalWindow = new BrowserWindow({width:500,height:500,modal:true,parent:win})
    modalWindow.loadURL(url);
    modalWindow.on('closed',function(){
      modalWindow=null;
    })
  });

}



console.log(app.getPath('userData'));

setTimeout(()=>{
  console.log(app.isReady());
},3000);


//quite usefull method :D
app.setBadgeCount(22);

// app.on('ready',function(e){
//   console.log('App ready FINE');
//   console.log(e);
//   win = new BrowserWindow({width:1200,height:600,backgroundColor: '#ff0000'})
//   // win = new BrowserWindow({width:1200, height:600, show:false})
//   childWindow = new BrowserWindow({width:800,height:600});
//   win.loadURL(url.format({
//     pathname: path.join(__dirname,'index.html'),
//     protocol: 'file:',
//     slashes:true
//   }))
//   // win.loadURL("http://www.github.com");
//
//   // win.once('ready-to-show',()=>{
//   //   win.show();
//   // });
//
//   win.on("closed",()=>{
//     win = null;
//   })
// });
app.on('ready',createWindow)
app.on('window-all-closed',()=>{
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('before-quit',function(e){
  console.log('Before-quit');
  // e.preventDefault();
});
//Listen the app for 3 seconds and if out of focus will quit
// app.on('browser-window-blur',function(e){
//   console.log('Window out of focus');
//   setTimeout(()=>{
//     app.quit();
//   },3000);
// })
//app.getPath() is an important method as it will help us get the working directory
console.log(app.getPath('userData'));
app.on('browser-window-focus',function(e){
  // console.log('Window in of focus');
})
