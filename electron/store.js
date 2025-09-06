import fs from "node:fs";
import path from "node:path";
import { app } from "electron";

const file = path.join(app.getPath("userData"), "db.json");
console.log("📂 DB path:", file);

function load() {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return { employees: [], charges: [], deliveries: [], settings: {} };
  }
}

function save(db) {
  fs.writeFileSync(file, JSON.stringify(db, null, 2), "utf-8");
}

let db = load();

// --- ID sequencial por coleção (employees, charges, deliveries)
function ensureCounters() {
  db.settings = db.settings || {};
  const maxId = (arr) => (arr.length ? Math.max(...arr.map(x => Number(x.id) || 0)) : 0);
  db.settings.nextEmployeeId = Math.max(db.settings.nextEmployeeId || 1, maxId(db.employees) + 1);
  db.settings.nextChargeId    = Math.max(db.settings.nextChargeId    || 1, maxId(db.charges) + 1);
  db.settings.nextDeliveryId  = Math.max(db.settings.nextDeliveryId  || 1, maxId(db.deliveries) + 1);
}
ensureCounters();
const nextId = (key) => {
  const map = {
    employees: "nextEmployeeId",
    charges:   "nextChargeId",
    deliveries:"nextDeliveryId",
  };
  const k = map[key];
  const id = db.settings[k]++;
  save(db);
  return id;
};

export const store = {
  addEmployee(name, role) {
    const e = { id: nextId("employees"), name, role, active: 1 };
    db.employees.push(e);
    save(db);
    console.log("✅ Funcionário cadastrado:", e);
    return e;
  },

  listEmployees(activeOnly = true) {
    return db.employees
      .filter((e) => (activeOnly ? e.active === 1 : true))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  addCharge(employeeId, item, amountCents, whenISO) {
        const c = {
            id: nextId("charges"),
            employeeId: Number(employeeId),
            item,
            amountCents: Number(amountCents),
            createdAt: whenISO,
          };
    db.charges.push(c);
    save(db);
    return c;
  },

  listCharges(employeeId, ym, startDate, endDate) {
    return db.charges
      .filter((c) => {
        if (employeeId && Number(c.employeeId) !== Number(employeeId)) return false;
        if (ym && ym !== "" && c.createdAt.slice(0, 7) !== ym) return false;

        if (startDate && startDate !== "") {
          const start = new Date(startDate + "T00:00:00");
          if (new Date(c.createdAt) < start) return false;
        }

        if (endDate && endDate !== "") {
          const end = new Date(endDate + "T23:59:59");
          if (new Date(c.createdAt) > end) return false;
        }

        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  sumCharges(employeeId, ym, startDate, endDate) {
    return this.listCharges(employeeId, ym, startDate, endDate).reduce(
      (s, c) => s + c.amountCents,
      0
    );
  },

  addDelivery(employeeId, count, tipsCents, discountCents, whenISO) {
        const d = {
            id: nextId("deliveries"),
               employeeId: Number(employeeId),
               count: Number(count),
               tipsCents: Number(tipsCents || 0),
               discountCents: Number(discountCents || 0),
            createdAt: whenISO,
          };
    db.deliveries.push(d);
    save(db);
    console.log("✅ Entrega adicionada:", d);
    return d;
  },

  listDeliveries(ym, startDate, endDate, employeeId) {
    return db.deliveries
      .filter((d) => {
        if (employeeId && Number(d.employeeId) !== Number(employeeId)) return false;
        if (ym && ym !== "" && d.createdAt.slice(0, 7) !== ym) return false;

        if (startDate && startDate !== "") {
          const start = new Date(startDate + "T00:00:00");
          if (new Date(d.createdAt) < start) return false;
        }

        if (endDate && endDate !== "") {
          const end = new Date(endDate + "T23:59:59");
          if (new Date(d.createdAt) > end) return false;
        }

        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  setSetting(key, value) {
    db.settings[key] = value;
    save(db);
    return true;
  },

  getSetting(key) {
    return db.settings[key] ?? null;
  },
};
