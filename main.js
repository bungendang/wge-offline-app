// Inital app
const { app, BrowserWindow, dialog , Menu, protocol, ipcMain} = require('electron')
const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;

let path = require('path')

let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      },
    ]
  })
}

let win;
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});
app.on('ready', function() {
  // Create the Menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createDefaultWindow();
});
app.on('window-all-closed', () => {
  app.quit();
});

//
// CHOOSE one of the following options for Auto updates
//

//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------
app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});

function sendStatusToWindow(message) {
    console.log(message);
}


function createDefaultWindow() {
  win = new BrowserWindow();
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/app/index.html#v${app.getVersion()}`);
  return win;
}


function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280, 
    height: 768,
    backgroundColor: '#ffffff',
    icon: path.join(__dirname,'app/favicon.ico'),
    webPreferences: {
      plugins: true,
      webSecurity:false
    }
    // icon: path.join(__dirname,'dist/assets/icons/logo-app-1024.icns') //only for mac
    // icon: path.join(__dirname,'app/wg-logo-app.png') //for linux
  })

  // win.openDevTools();
  win.loadURL(`file://${__dirname}/app/index.html`)
  // win.loadURL(url.format({ pathname: path.join(__dirname, 'dist/index.html'), protocol: 'file', slashes: true }))
  // win.loadURL(`file://${__dirname}/passenger-list-2018-04-16-all.pdf`)

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}


function printPdf(){
  console.log('printPdf')
}


// Create window on electron intialization
// app.on('ready', createWindow)



// // Quit when all windows are closed.
// app.on('window-all-closed', function () {

//   // On macOS specific close process
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', function () {
//   // macOS specific close process
//   if (win === null) {
//     createWindow()
//   }
// })