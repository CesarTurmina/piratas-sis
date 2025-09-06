import React, { useState, useEffect } from "react";
import { localNowISO } from "../utils/date";

type Employee = { id: number; name: string; active: 1 | 0 };

export default function Contas() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [produto, setProduto] = useState("");
  const [qt, setQt] = useState("");
  const [valor, setValor] = useState("");

  useEffect(() => {
    const load = async () => {
      const emps = await window.api.listEmployees(false);
      setEmployees(emps); // todos
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    const cents = Math.round(parseFloat(valor) * 100);
        await window.api.addCharge({
        employeeId: selectedEmployee,
        item: produto,
        amountCents: cents,
        whenISO: localNowISO(), // ⏰ salva data e hora
        });
    console.log({ employeeId: selectedEmployee, produto, qt, valor });
    // depois: window.api.addCharge(...)
    setProduto("");
    setQt("");
    setValor("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 400 }}>
      <label>
        FUNCIONÁRIO:
        <select
          value={selectedEmployee ?? ""}
          onChange={(e) => setSelectedEmployee(Number(e.target.value))}
          style={{ width: "100%", padding: 8 }}
        >
          <option value="">Selecione Funcionário</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        PRODUTOS:
        <input
          type="text"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
          style={{ width: "100%" }}
        />
      </label>

      <label>
        QT:
        <input
          type="number"
          value={qt}
          onChange={(e) => setQt(e.target.value)}
          style={{ width: "100px" }}
        />
      </label>

      <label>
        VALOR:
        <input
          type="number"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={{ width: "100%" }}
        />
      </label>

      <button
        type="submit"
        disabled={!selectedEmployee}
        style={{
          padding: "8px 16px",
          background: selectedEmployee ? "#ddd" : "#eee",
          border: "1px solid #aaa",
          cursor: selectedEmployee ? "pointer" : "not-allowed",
          fontWeight: 600,
        }}
      >
        CADASTRAR
      </button>
    </form>
  );
}