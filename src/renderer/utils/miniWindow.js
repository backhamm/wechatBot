import {remote, screen} from 'electron'
const { BrowserWindow, Menu } = remote

export let miniWindow

export function createMiniWindow(params) {
  const viewWidth = 650
  const viewHeight = 62
  const {width, height} = screen.getPrimaryDisplay().size
  Menu.setApplicationMenu(null) // 关闭子窗口菜单栏
  const modalPath = process.env.NODE_ENV === 'development' ? `http://localhost:9080/#/ProgressBar?params=${params}` : `file://${__dirname}/index.html#/ProgressBar?params=${params}`
  miniWindow = new BrowserWindow({
    width: viewWidth,
    height: viewHeight,
    x: (width - viewWidth) / 2,
    y: height - 110,
    frame: false,
    transparent: true,
    resizable: false,
    show: false,
    webPreferences: {
      webSecurity: false
    }
    // parent: mainWindow // mainWindow是主窗口
  })

  miniWindow.once('ready-to-show', () => {
    miniWindow.show()
  })

  miniWindow.loadURL(modalPath)

  miniWindow.setAlwaysOnTop(true)

  miniWindow.on('closed', () => {
    miniWindow = null
  })
}
