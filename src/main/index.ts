import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { promise } from 'ping'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { NodeSSH } from 'node-ssh'

function escapeAnsi(text: string): string {
  text = (text + "")
    .trim()
    .replace(
      // eslint-disable-next-line no-control-regex
      /[\u001B\u009B][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ""
    );
    return text
}

function getToltecStatusString(status: string): string {
  switch (status) {
    case "Yes": return "Installed"
    case "No": return "Not installed"
    case "Partial": return "Partially installed (opt.mount not running)"
    default: return "toltecctl had one job and he failed at it"
  }
}

async function doPingReMarkable(): Promise<boolean> {
  const result = await promise.probe("10.11.99.1")
  return result.alive
}

async function getToltecStatus(_event, keyPath): Promise<string> {
  const ssh = new NodeSSH()
  await ssh.connect(
    {
      host: '10.11.99.1',
      port: 22,
      username: 'root',
      privateKeyPath: keyPath
    }
  )
  const result = await ssh.execCommand('/home/root/.local/bin/toltecctl status | grep Enabled | sed "s/Enabled: //"')
  // const result = await ssh.execCommand('systemctl --quiet is-enabled "opt.mount" 2> /dev/null')
  ssh.dispose()
  return getToltecStatusString(escapeAnsi(result.stdout))
}

async function getOsVersion(_event, keyPath): Promise<string> {
  const ssh = new NodeSSH()
  await ssh.connect(
    {
      host: '10.11.99.1',
      port: 22,
      username: 'root',
      privateKeyPath: keyPath
    }
  )
  const result = await ssh.execCommand("awk -F= '/RELEASE_VERSION/{print $2}' /usr/share/remarkable/update.conf")

  ssh.dispose()
  return escapeAnsi(result.stdout)
}

async function doesSshWork(_event, keyPath): Promise<boolean> {
  const ssh = new NodeSSH()
  try {

    await ssh.connect(
      {
        host: '10.11.99.1',
        port: 22,
        username: 'root',
        privateKeyPath: keyPath
      }
      )
      ssh.dispose()
      return true
    }
    catch {
      return false
    }
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Ping reMarkable
  ipcMain.handle('ping', async () => {
    console.log("called IPC ping");
    return await doPingReMarkable();
  })

  // Check if Toltec is installed
  ipcMain.handle('checkToltecStatus', async (event, keyPath) => {
    return await getToltecStatus(event, keyPath);
  })

  // Check if SSH works
  ipcMain.handle('checkSshWorks', async (event, keyPath) => {
    console.log("called IPC doesSshWork");
    return await doesSshWork(event, keyPath);
  })

  // Get OS version
  ipcMain.handle('getOsVersion', async (event, keyPath) => {
    console.log("called IPC getOsVersion");
    return await getOsVersion(event, keyPath);
  })


  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
