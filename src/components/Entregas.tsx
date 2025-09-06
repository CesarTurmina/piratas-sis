import React, { useState, useEffect } from "react";
import { localNowISO } from "../utils/date";

type Employee = { id: number; name: string; active: 1 | 0 };

export default function Entregas() {
  const [motoboys, setMotoboys] = useState<Employee[]>([]);
  const [selectedMotoboy, setSelectedMotoboy] = useState<number | null>(null);
  const [quantidade, setQuantidade] = useState("");
  const [gorjeta, setGorjeta] = useState("");
  const [desconto, setDesconto] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    const load = async () => {
      const emps = await window.api.listEmployees(false);
      setMotoboys(emps.filter((e: any) => e.role?.toLowerCase() === "motoboy"));
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMotoboy) return;
    await window.api.addDelivery({
      employeeId: Number(selectedMotoboy),
      count: Number(quantidade),
      tipsCents: Math.round(parseFloat(gorjeta || "0") * 100),
      discountCents: Math.round(parseFloat(desconto || "0") * 100),
      whenISO: data ? `${data}T12:00:00` : localNowISO(),
    });
    console.log({ motoboyId: selectedMotoboy, quantidade, gorjeta, desconto });
    // depois: window.api.addDelivery(...)
    setQuantidade("");
    setGorjeta("");
    setDesconto("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 400 }}>
      <label>
        Data:
        <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      </label>
      <label>
        MOTOBOY:
        <select
          value={selectedMotoboy !== null ? String(selectedMotoboy) : ""}
          onChange={(e) => setSelectedMotoboy(Number(e.target.value))}
          style={{ width: "100%", padding: 8 }}
        >
          <option value="">Selecione Motoboy</option>
          {motoboys.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        QUANTIDADE ENTREGA:
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          style={{ width: "100px" }}
        />
      </label>

      <label>
        GORJETA:
        <input
          type="number"
          step="0.01"
          value={gorjeta}
          onChange={(e) => setGorjeta(e.target.value)}
          style={{ width: "100%" }}
        />
      </label>

      <label>
        DESCONTO:
        <input
          type="number"
          step="0.01"
          value={desconto}
          onChange={(e) => setDesconto(e.target.value)}
          style={{ width: "100%" }}
        />
      </label>

      <button
        type="submit"
        disabled={!selectedMotoboy}
        style={{
          padding: "8px 16px",
          background: selectedMotoboy ? "#ddd" : "#eee",
          border: "1px solid #aaa",
          cursor: selectedMotoboy ? "pointer" : "not-allowed",
          fontWeight: 600,
        }}
      >
        CADASTRAR
      </button>
    </form>
  );
}