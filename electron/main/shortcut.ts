import {BrowserWindow, globalShortcut} from "electron";
import { LauncherApi } from "../preload/api";

const initShortCut = (win: BrowserWindow, loadMainView: () => void) => {
  const a = new LauncherApi(win,loadMainView)
  globalShortcut.register('Alt+Space', () => {
    if (win.isVisible()) {
      a.hide()
    } else {
      a.show()
    }
  })
}

export { initShortCut }
