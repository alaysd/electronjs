const {app, BrowserWindow} = require('electron')
const path = require('path');
const url = require('url');
require('electron-reload')(__dirname)
let win;

var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        console.log('Mypassowrd',hash);
    });
});
// require('devtron').install()
function createWindow(){
  win = new BrowserWindow({width:800,height:600})

  win.loadURL(url.format({
    pathname: path.join(__dirname,'index.html'),
    protocol: 'file:',
    slashes:true
  }))

  win.on("closed",()=>{
    win = null;
  })
}

app.on('ready',createWindow);
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
