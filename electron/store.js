import fs from "node:fs";
import path from "node:path";
import { app } from "electron";

const file = path.join(app.getPath("userData"), "db.json");

function load() {
  try { return JSON.parse(fs.readFileSync(file, "utf-8")); }
  catch { return { employees: [], charges: [], deliveries: [], settings: {} }; }
}
function save(db) { fs.writeFileSync(file, JSON.stringify(db, null, 2), "utf-8"); }

let db = load();
const uid = () => Date.now() + Math.floor(Math.random()*1000);

export const store = {
  addEmployee(name) {
    const e = { id: uid(), name, active: 1 };
    db.employees.push(e); save(db); return e;
  },
  listEmployees(activeOnly=true) {
    return db.employees.filter(e => activeOnly ? e.active === 1 : true).sort((a,b)=>a.name.localeCompare(b.name));
  },

  addCharge(employeeId, item, amountCents, whenISO) {
    const c = { id: uid(), employeeId, item, amountCents, createdAt: whenISO };
    db.charges.push(c); save(db); return c;
  },
  listCharges(employeeId, ym) {
    return db.charges
      .filter(c => c.employeeId===employeeId && c.createdAt.slice(0,7)===ym)
      .sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  },
  sumCharges(employeeId, ym) {
    return this.listCharges(employeeId, ym).reduce((s,c)=>s+c.amountCents,0);
  },

  addDelivery(name, count, tipsCents, discountCents, whenISO) {
    const d = { id: uid(), name, count, tipsCents, discountCents, createdAt: whenISO };
    db.deliveries.push(d); save(db); return d;
  },
  listDeliveries(ym) {
    return db.deliveries
      .filter(d => d.createdAt.slice(0,7)===ym)
      .sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  },

  setSetting(key, value){ db.settings[key]=value; save(db); return true; },
  getSetting(key){ return db.settings[key] ?? null; }
};