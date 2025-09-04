// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  addEmployee: (name) => ipcRenderer.invoke("add-employee", name),
  listEmployees: (activeOnly) => ipcRenderer.invoke("list-employees", activeOnly),

  addCharge: (p) => ipcRenderer.invoke("add-charge", p),
  listCharges: (p) => ipcRenderer.invoke("list-charges", p),
  sumCharges: (p) => ipcRenderer.invoke("sum-charges", p),
});