import { app, shell, BrowserWindow, ipcMain, Notification } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const schedule = require('node-schedule')
import icon from '../../resources/icon.png?asset'
import Store from 'electron-store'
import { diffDay } from '../utiles/index'

const store = new Store()
let anniversaryObj = {}
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 670,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  console.log('app.getPath', app.getPath('userData'))

  // 获取json地址
  ipcMain.handle('electron-store-get-all', async (event) => {
    const config = store.store
    console.log('config: ', config)
    anniversaryObj = config
    return config
  })

  ipcMain.handle('electron-store-get', async (event, id) => {
    return anniversaryObj[id]
  })

  // 删除
  ipcMain.handle('electron-store-del', async (_event, id) => {
    if (store.has(id)) {
      await store.delete(id)
      new Notification({
        title: '删除成功'
      }).show()
      return 'success'
    } else {
      new Notification({
        title: '删除失败'
      }).show()
      return 'fail'
    }
  })

  // 新增加
  ipcMain.handle('electron-store-add', async (_event, id, date, countDownTit) => {
    await store.set(id, date)
    // 新增成功要去读一次json,刷新下数据
    new Notification({
      title: `新增纪念日`,
      body: `${date.title}`
    }).show()
    return true
  })

  ipcMain.on('electron-store-edite', async (_event, id, date) => {
    // 判断是否有id
    const isHas = store.has(id)
    if (isHas) {
      store.set(id, date)
      return '更新成功'
    } else {
      return '没有找个这个id'
    }
  })

  // const job = schedule.scheduleJob('30 * * * * *', function () {
  //   [1, 2, 3].forEach((item) => {
  //     console.log('Today is recognized by Rebecca Black!')
  //     new Notification({
  //       title: `测试`
  //     }).show()
  //   })
  // })

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
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app
  .whenReady()
  .then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  .then(async () => {
    const config = store.store
    anniversaryObj = config
    const notifications = Object.values(anniversaryObj).map((item) => {
      return +diffDay(item.date) === 0
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
