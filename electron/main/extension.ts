// import { BrowserView, BrowserWindow } from "electron";
// import { Height, Width } from "./cons";

// let view: BrowserView

// const createView = (preload: string, mainWin: BrowserWindow) => {
//   view = new BrowserView(
//     {
//       webPreferences: {
//         preload,
//         webSecurity: false,
//         nodeIntegration: true,
//         contextIsolation: false,
//         devTools: true,
//         webviewTag: true,
//       }
//     }
//   )

//   mainWin.setBrowserView(view)
//   mainWin.loadURL('http://localhost:5173')
//   mainWin.webContents.openDevTools()
// }

// const getView = () => {
//   return view
// }


// export { createView, getView }
