import { app, BrowserWindow } from "electron";
import path from "node:path";

let win = null;

async function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    await win.loadURL("http://localhost:5173");
  } else {
    await win.loadFile(path.join(process.cwd(), "dist", "index.html"));
  }
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });