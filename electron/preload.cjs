const { contextBridge, ipcRenderer } = require("electron");

console.log("⚡ Preload carregado!");

contextBridge.exposeInMainWorld("api", {
  addEmployee: (name, role) => ipcRenderer.invoke("add-employee", { name, role }),
  listEmployees: (activeOnly) => ipcRenderer.invoke("list-employees", activeOnly),
  addCharge: (p) => ipcRenderer.invoke("add-charge", p),
  listCharges: (p) => ipcRenderer.invoke("list-charges", p),
  sumCharges: (p) => ipcRenderer.invoke("sum-charges", p),
  addDelivery: (p) => ipcRenderer.invoke("add-delivery", p),
  listDeliveries: (p) => ipcRenderer.invoke("list-deliveries", p),
  printReport: (html) => ipcRenderer.invoke("print-report", html),
});