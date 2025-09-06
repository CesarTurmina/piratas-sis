import React, { useState } from "react";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [funcao, setFuncao] = useState("Caixa");

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("window.api no renderer:", window.api);
    e.preventDefault();
    if (!nome.trim() || !funcao.trim()) return;

    const novo = await window.api.addEmployee(nome.trim(), funcao.trim());
    console.log("✅ Funcionário cadastrado:", novo);

    setNome("");
    setFuncao("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 400 }}>
      <label>
        NOME:
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ width: "100%" }}
        />
      </label>

      <label>
        FUNÇÃO:
        <select
          value={funcao}
          onChange={(e) => setFuncao(e.target.value)}
         style={{ width: "100%", padding: 8 }}
        >
          <option value="Caixa">Caixa</option>
          <option value="Garçom">Garçom</option>
         <option value="Cozinha">Cozinha</option>
          <option value="Motoboy">Motoboy</option>
        </select>
      </label>

      <button
        type="submit"
        style={{
          padding: "8px 16px",
          background: "#ddd",
          border: "1px solid #aaa",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        CADASTRAR
      </button>
    </form>
  );
}