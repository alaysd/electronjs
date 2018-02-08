const electron = require('electron');
const {app, BrowserWindow, session, dialog, globalShortcut, Menu, MenuItem, Tray, ipcMain} = require('electron')
const path = require('path');
const url = require('url');
require('electron-reload')(__dirname)
let win;
let childWindow;
let altWindow;
var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'xyz';
const someOtherPlaintextPassword = 'not_bacon';
const windowStateKeeper = require('electron-window-state');

global['app_version'] =1.1;

app.dock.setIcon('icon.png')

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        console.log('Mypassowrd',hash);
    });
});

app.disableHardwareAcceleration()

let bgWin;

// require('devtron').install()

// app.on('browser-window-focus',()=>{
//   console.log("---------------\nApp focused\n---------------");
// })


// function showDialog(){
//   dialog.showOpenDialog({defaultPath:'/Users/alay.dhagia/Documents/', buttonLabel:'Select Logo',properties:['openFile', 'multiSelections', 'createDirectory']},(openPath)=>{
//     console.log('Open path',openPath);
//   })
// }

// function showDialog(){
//   dialog.showSaveDialog({defaultPath:'/Users/alay.dhagia/Documents/'},(filename)=>{
//     console.log(filename);
//   });
// }

  function showDialog(){
    let buttons = ['Yes','No','Maybe']
    dialog.showMessageBox({ buttons, title: 'Message dailog example', message:'please select an answer',detail:'More details'},(buttonIndex)=>{
      console.log('Button index',buttons[buttonIndex]);
    })
  }

  // Create App menu
  // let mainMenu = new Menu();

  // let menuItem1 = new MenuItem({
  //   label:'Electron',
  //   submenu:[
  //     {label:'Item 1'},
  //     {label:'Item 2'}
  //   ]
  // });
  // mainMenu.append(menuItem1)

  // let mainMenu = Menu.buildFromTemplate([{
  //   label:'Electron',
  //   submenu:[
  //     {label:'Item 1'},
  //     {label:'Item 2'}
  //   ]
  // },{
  //   label:'Action',
  //   submenu:[
  //     {label:'Action 1'},
  //     {label:'Action 2'}
  //   ]
  // }]);

  // From other file
  let mainMenu = Menu.buildFromTemplate(require('./mainMenu.js'));
  let contextMenu = Menu.buildFromTemplate(require('./contextMenu.js'));

  // tray
  let tray;
  function createTray(){
    tray = new Tray('icon.png');

    // const trayMenu = Menu.buildFromTemplate([
    //   {label:'Tray menu item'},
    //   {role:'quit'}
    // ]);
    //
    // tray.setContextMenu(trayMenu);

    tray.on('click',()=>{
      console.log('tray clicked man xD');
      win.isVisible() ? win.hide() : win.show();
    })

    tray.setToolTip('AlayDhagia')
  }


  // ipcMain.on('chan',(e, args)=>{
  //   console.log('Args:',args);
  //   e.sender.send('chan','Message recieved man')
  // })
  //
  // ipcMain.on('chan2',(e,args)=>{
  //   console.log(args);
  //   e.sender.send('chan2','Message received from 2');
  //   });
  //
  // // Synchronous ipcMain
  // ipcMain.on('sync-channel',(e,args)=>{
  //       console.log('Sync message:',args.name);
  //       e.returnValue =  'a synchronous response from the main process';
  // })
function createWindow(){
  // Custom session- it will not be persisted by default
  // let appSession = session.fromPartition('parition1')//This partition1 is type of disk location and can be accesed by this string
  // To create persisted custom session save the name of string as persist:yourstring
  //let appSession = session.fromPartition('persist:parition1')

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
  win = new BrowserWindow({width:1400,height:1000})
  win.loadURL(url.format({
    pathname: path.join(__dirname,'index.html'),
    protocol: 'file:',
    slashes:true
  }))

  globalShortcut.register('CommandOrControl+g',()=>{
    console.log('User pressed CommandOrControl+g');

    // This unregister will stop after 1 CommanOrControl+g
    globalShortcut.unregister('CommandOrControl+g');
    console.log('CommandOrControl+g has been unregistered');
  })

  win.webContents.on('context-menu',(e)=>{
    e.preventDefault();
    contextMenu.popup();
  })
  setTimeout(showDialog, 2000);
  // win.loadURL("http://github.com")

  // win.webContents.on('did-finish-load',()=>{
  //   win.webContents.send('private','Message from the president Underwood');
  // })

  let defaultSession = session.defaultSession;

  // altWindow = new BrowserWindow({width:800,height:600,webPreferences:{session: appSession}});

  // Following method if we dont want to create a seperate variable instead bind in BrowserWindow constructor
  // altWindow = new BrowserWindow({width:800,height:600,webPreferences:{partition: 'persist:parition1'}});
  // altWindow.loadURL(url.format({
  //   pathname: path.join(__dirname,'index.html'),
  //   protocol: 'file:',
  //   slashes:true
  // }))

  // let altSession = altWindow.webContents.session;
  let winSession = win.webContents.session;
  // winSession.clearStorageData();

  //DownloadItem
  winSession.on('will-download',(e, downloadItem, webContents)=>{

    console.log('File name',downloadItem.getFilename());
    let file = downloadItem.getFilename();
    downloadItem.setSavePath('downloads/'+file);

    let size = downloadItem.getTotalBytes();
    console.log('Size',size);
    downloadItem.on('updated',(e, state)=>{
      let progress = Math.round((downloadItem.getReceivedBytes()/size) *100);
      if(state === 'progressing'){
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write('Downloaded '+progress+'%');
      }
    })
  });

  console.log(winSession);
  // console.log(altSession);
  // console.log('Session main and alt',Object.is(winSession,altSession));
  console.log('session default ',Object.is(winSession,defaultSession));

  // Cookies
  // winSession.cookies.get({},(error, cookies)=>{
  //   console.log('Cookies',cookies);
  // })
  winSession.cookies.set({url:'http://myapp.com',name:'cookie1', value: 'cookie_value', domain: 'myapp.com'}, (error)=>{
    console.log(error);
    console.log('Cookie created');
    winSession.cookies.get({name:'cookie1'},(error, cookies)=>{
      console.log('Cookies',cookies);
    })
  })



  // Custom Session
  // console.log('Custom session',Object.is(winSession,appSession));



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
  });
  // altWindow.on('closed',()=>{
  //   altWindow=null;
  // });

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

  // winContents.on('new-window',(e,url)=>{
  //   console.log('new window created for:',url);
  //   e.preventDefault();
  //   let modalWindow = new BrowserWindow({width:800,height:500,modal:true,parent:win, frame:true})
  //   modalWindow.loadURL(url);
  //   modalWindow.on('closed',function(){
  //     modalWindow=null;
  //   })
  // });

  // winContents.on('will-navigate',(e,url)=>{
  //   console.log('WILL navigate to',url);
  // });
  //
  // winContents.on('did-navigate',(e,url)=>{
  //     console.log('DID navigate to',url);
  // });
  // winContents.on('login',(e, req, authInfo, callback)=>{
  //   e.preventDefault();
  //   callback("admin","nosecret")
  // });
  // winContents.on('media-started-playing',()=>{
  //   console.log('Video stared');
  // });
  // winContents.on('media-paused',()=>{
  //   console.log('Video paused');
  // })
  // winContents.on('context-menu',(e,params)=>{
  //   console.log('Context menu opened on: '+params.mediaType+' y '+params.y+' x '+params.x);
  //   console.log('Selection ------------- '+params.selectionText);
  //   console.log('Selection can be copied '+params.editFlags.canCopy);
  // })

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
var fs = require('fs');
app.on('ready',()=>{
  createWindow();
  createTray();
  Menu.setApplicationMenu(mainMenu);

  electron.powerMonitor.on('suspend',()=>{
    console.log('System is suspended');
  });
  electron.powerMonitor.on('resume',()=>{
    console.log('System resumed');
  })

  bgWin = new BrowserWindow({
    show:false,
    width:1200,
    height:800,
    webPreferences:{
      offscreen: true
    }
  });
  bgWin.loadURL('http://github.com')
  // bgWin.webContents.on('did-finish-load',()=>{
  //   console.log('bgWin Contents',bgWin.getTitle());
  //   app.quit();
  // })
  let i=1;
  // bgWin.webContents.on('paint',(e, dirtyArea, nativeImage)=>{
  //
  //   let img = nativeImage.toPNG();
  //   fs.writeFile(`/Users/alay.dhagia/Documents/ElectronJs/udemtLectures/electronjs/screenshot_${i}.png`,img);
  //   i++;
  // })
});
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
