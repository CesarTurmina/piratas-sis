import React, { useState, useEffect } from "react";
import { localNowISO } from "../utils/date";

type Employee = { id: number; name: string; active: 1 | 0 };
type Charge = {
  id: number;
  item: string;
  amountCents: number;
  createdAt: string;
};

export default function Contas() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [produto, setProduto] = useState("");
  const [qt, setQt] = useState("");
  const [valor, setValor] = useState("");
  const [chargesDoMes, setChargesDoMes] = useState<Charge[]>([]);

  useEffect(() => {
    const load = async () => {
      const emps = await window.api.listEmployees(false);
      setEmployees(emps); // todos
    };
    load();
  }, []);

  useEffect(() => {
    const fetchCharges = async () => {
      // Se um funcionário estiver selecionado, busca os dados
      if (selectedEmployee) {
        // Pega o mês atual no formato YYYY-MM
        const currentMonthISO = new Date().toISOString().slice(0, 7);
        const charges = await window.api.listCharges({
          employeeId: selectedEmployee,
          monthISO: currentMonthISO,
        });
        setChargesDoMes(charges as Charge[]);
      } else {
        // Se nenhum funcionário estiver selecionado, limpa a lista
        setChargesDoMes([]);
      }
    };

    fetchCharges();
  }, [selectedEmployee]);

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

    const currentMonthISO = new Date().toISOString().slice(0, 7);
    const updatedCharges = await window.api.listCharges({
      employeeId: selectedEmployee,
      monthISO: currentMonthISO,
      });
      setChargesDoMes(updatedCharges as Charge[]);

    setProduto("");
    setQt("");
    setValor("");
  };
   
  const totalCents = chargesDoMes.reduce((sum, charge) => sum + charge.amountCents, 0);

  return (

<div style={{ display: "flex", gap: "24px", width: "100%" }}>
<div style={{ flex: 1 }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 400 }}>
          <label>
            FUNCIONÁRIO:
            <select
              value={selectedEmployee ?? ""}
              onChange={(e) => setSelectedEmployee(Number(e.target.value) || null)}
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
              placeholder="Consumo geral"
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
              required
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
      </div>

      {/* Coluna da Direita (Lista de Contas) */}
      <div style={{ flex: 1.5, borderLeft: '1px solid #eee', paddingLeft: '24px' }}>
        <h3>Lançamentos no Mês</h3>
        {selectedEmployee ? (
          <div>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
              {chargesDoMes.length > 0 ? (
                chargesDoMes.map(charge => (
                  <div key={charge.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px', borderBottom: '1px solid #f0f0f0' }}>
                    <span>{new Date(charge.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span>{charge.item}</span>
                    <span style={{ fontWeight: 'bold' }}>R$ {(charge.amountCents / 100).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p>Nenhum lançamento para este funcionário no mês atual.</p>
              )}
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #ccc' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em', marginTop: '16px' }}>
              <span>TOTAL DO MÊS:</span>
              <span>R$ {(totalCents / 100).toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <p>Selecione um funcionário para ver os lançamentos.</p>
        )}
      </div>
    </div>
  );
}