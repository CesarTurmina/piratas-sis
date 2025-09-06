// electron/main.js
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { store } from "./store.js";

// Employees
ipcMain.handle("add-employee", (_event, { name, role }) =>
  store.addEmployee(name, role)
);
ipcMain.handle("list-employees", (_event, activeOnly) =>
  store.listEmployees(activeOnly)
);
// Charges
ipcMain.handle("add-charge", (_event, p) =>
  store.addCharge(p.employeeId, p.item, p.amountCents, p.whenISO)
);
ipcMain.handle("list-charges", (_event, p) =>
  store.listCharges(p.employeeId, p.monthISO, p.startDate, p.endDate)
);
ipcMain.handle("sum-charges", (_event, p) =>
  store.sumCharges(p.employeeId, p.monthISO, p.startDate, p.endDate)
);

// Deliveries
ipcMain.handle("add-delivery", (_event, p) =>
  store.addDelivery(p.employeeId, p.count, p.tipsCents, p.discountCents, p.whenISO)
);
ipcMain.handle("list-deliveries", (_event, p) =>
store.listDeliveries(p.ym, p.startDate, p.endDate, Number(p.employeeId))
);

// Printing
ipcMain.handle("print-report", async (_event, html) => {
  const printWindow = new BrowserWindow({ show: false });
  await printWindow.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
  printWindow.webContents.print({
    silent: false,
    printBackground: true,
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;
let mainWindow;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function loadURLWithRetry(win, url, { retries = 40, delay = 250 } = {}) {
  for (let i = 0; i < retries; i++) {
    try {
      await win.loadURL(url);
      return;
    } catch {
      await sleep(delay);
    }
  }
  await win.loadURL(
    "data:text/html;charset=utf-8," +
      encodeURIComponent(`<h2>Servidor Vite não respondeu</h2>`)
  );
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"), // 👈 renomeia o preload.js para preload.cjs
    },
    show: false,
  });

  if (isDev) {
    await loadURLWithRetry(mainWindow, "http://localhost:5173");
    // mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    const indexPath = path.join(__dirname, "../dist/index.html");
    await mainWindow.loadFile(indexPath);
  }

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});