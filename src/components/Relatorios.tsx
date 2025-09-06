import React, { useState, useEffect } from "react";

type Employee = { id: number; name: string; active: 1 | 0 };

export default function Relatorios() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [motoboys, setMotoboys] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedMotoboy, setSelectedMotoboy] = useState<number | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Busca funcionários e motoboys
  useEffect(() => {
    const load = async () => {
      const emps = await window.api.listEmployees(false);
      setEmployees(emps);
      setMotoboys(emps.filter((e: any) => e.role?.toLowerCase() === "motoboy")); // 👈 agora usa role
    };
    load();
  }, []);

  const printEmployeeReport = async () => {
    if (!selectedEmployee) return;
  
    const charges = await window.api.listCharges({
      employeeId: selectedEmployee,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

    const chargesOrdenados = [...charges].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  
    console.log("Charges retornadas:", charges);
  
    const html = `
  <div style="width:280px; font-family: monospace; font-size:16px; color:#000;">
    
    <div style="text-align:center; font-weight:bold; font-size:20px; margin-bottom:10px;">
      PIRATAS LANCHES
    </div>

    <div style="text-align:center; font-weight:bold; margin-bottom:8px; font-size:16px;">
      RELATÓRIO DE CONTAS
    </div>

    ${chargesOrdenados
      .map(
        (c: any) => `
        <div style="display:flex; justify-content:space-between; font-weight:bold; margin:4px 0;">
          <span>${new Date(c.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
          <span>${c.item}</span>
          <span>R$ ${(c.amountCents / 100).toFixed(2)}</span>
        </div>`
      )
      .join("")}

    <hr style="border:1px dashed #000; margin:8px 0;" />

    <div style="text-align:right; font-weight:bold; font-size:16px; margin-top:8px;">
      Total c/ desconto (10%): R$ ${(
        (chargesOrdenados.reduce((s: number, c: any) => s + c.amountCents, 0) / 100) * 0.9
      ).toFixed(2)}
    </div>

    <div style="text-align:center; margin-top:12px; font-size:14px;">
      Obrigado e volte sempre!
    </div>
  </div>
`;
  
    await window.api.printReport(html);
  };

  const printMotoboyReport = async () => {
    if (!selectedMotoboy) return;
    const deliveries = await window.api.listDeliveries({
      employeeId: selectedMotoboy,
      startDate,
      endDate,
    });
  const deliveriesOrdenados = [...deliveries].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const html = `
  <div style="width:280px; font-family: monospace; font-size:16px; color:#000;">
    
    <div style="text-align:center; font-weight:bold; font-size:20px; margin-bottom:10px;">
      PIRATAS LANCHES
    </div>

    <div style="text-align:center; font-weight:bold; margin-bottom:8px; font-size:16px;">
      RELATÓRIO MOTOBOY
    </div>
    <div style="font-size:16px;">
    <p><b>Motoboy:</b> <b>${
      motoboys.find((m) => m.id === selectedMotoboy)?.name ?? "?"
    }</b></p>
    </div>

    <hr style="border:1px dashed #000; margin:8px 0;" />

    ${deliveriesOrdenados 
      .map(
        (d: any) => `
        <div style="display:flex; justify-content:space-between; font-weight:bold; margin:4px 0;">
          <span>${new Date(d.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
          <span>${d.count} teles</span>
        </div>`
      )
      .join("")}

    <hr style="border:1px dashed #000; margin:8px 0;" />

    <div style="font-weight:bold; font-size:16px; margin-top:8px;">
      Total teles: ${deliveriesOrdenados .reduce((s: number, d: any) => s + d.count, 0)}
    </div>
    <div style="font-weight:bold; font-size:16px;">
      Valor gorjetas: R$ ${(deliveriesOrdenados .reduce((s: number, d: any) => s + d.tipsCents, 0) / 100).toFixed(2)}
    </div>
    <div style="font-weight:bold; font-size:16px;">
      Valor descontos: R$ ${(deliveriesOrdenados .reduce((s: number, d: any) => s + d.discountCents, 0) / 100).toFixed(2)}
    </div>

    <div style="text-align:center; margin-top:12px; font-size:14px;">
      Obrigado e volte sempre!
    </div>
  </div>
`;
  
    await window.api.printReport(html);
  };

  const printFechamentoMes = async () => {
    const charges = await window.api.listCharges({ startDate, endDate });
    const deliveries = await window.api.listDeliveries({ startDate, endDate });
  
    const totalContas = charges.reduce((s: number, c: any) => s + c.amountCents, 0);
    const totalEntregas = deliveries.reduce(
      (s: number, d: any) => s + d.tipsCents - d.discountCents,
      0
    );
  
    const html = `
      <h2 style="text-align:center">PIRATAS LANCHES</h2>
      <h3>Fechamento do Mês</h3>
      <p><b>Período:</b> ${startDate || "?"} até ${endDate || "?"}</p>
      <p><b>Total Contas (com desconto 10%):</b> R$ ${((totalContas / 100) * 0.9).toFixed(2)}</p>
      <p><b>Total Entregas:</b> R$ ${(totalEntregas / 100).toFixed(2)}</p>
    `;
  
    await window.api.printReport(html);
  };

  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 600 }}>
      {/* Filtros de data */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <label>
          Data inicial:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>
        <label>
          Data final:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>

      {/* Relatório de contas funcionário */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <select
          value={selectedEmployee ?? ""}
          onChange={(e) => setSelectedEmployee(Number(e.target.value))}
          style={{ flex: 1, padding: 8 }}
        >
          <option value="">Selecione Funcionário</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
        <button
          onClick={printEmployeeReport}
          disabled={!selectedEmployee}
          style={{
            padding: "8px 16px",
            background: selectedEmployee ? "#ddd" : "#eee",
            border: "1px solid #aaa",
            cursor: selectedEmployee ? "pointer" : "not-allowed",
          }}
        >
          Imprimir Relatório de Contas
        </button>
      </div>

      {/* Relatório motoboy */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <select
          value={selectedMotoboy ?? ""}
          onChange={(e) => setSelectedMotoboy(Number(e.target.value))}
          style={{ flex: 1, padding: 8 }}
        >
          <option value="">Selecione Motoboy</option>
          {motoboys.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <button
          onClick={printMotoboyReport}
          disabled={!selectedMotoboy}
          style={{
            padding: "8px 16px",
            background: selectedMotoboy ? "#ddd" : "#eee",
            border: "1px solid #aaa",
            cursor: selectedMotoboy ? "pointer" : "not-allowed",
          }}
        >
          Imprimir Relatório Motoboy
        </button>
      </div>

      {/* Fechamento mês */}
      <div>
        <button
          onClick={printFechamentoMes}
          style={{
            width: "100%",
            padding: "12px 20px",
            background: "#ddd",
            border: "1px solid #aaa",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Imprimir Fechamento do Mês
        </button>
      </div>
    </div>
  );
}