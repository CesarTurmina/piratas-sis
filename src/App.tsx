import React, { useState } from "react";
import Contas from "./components/Contas";
import Entregas from "./components/Entregas";
import Cadastro from "./components/Cadastro";
import Relatorios from "./components/Relatorios";

type Tab = "contas" | "entregas" | "cadastro" | "relatorios";

export default function App() {
  const [tab, setTab] = useState<Tab>("contas");

  return (
    <div
      style={{
        background: "#222", // fundo da tela
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          width: "90%",
          maxWidth: 900,
          padding: 20,
        }}
      >
        {/* Cabeçalho */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>PIRATAS LANCHES</h2>
          <div style={{ fontWeight: 600 }}>
            {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            })}
        </div>
          <img
            src="/logo.png" // coloca tua logo aqui (pasta public/)
            alt="logo"
            style={{ height: 100 }}
          />
        </div>

        {/* Abas */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <TabButton active={tab === "contas"} onClick={() => setTab("contas")}>
            CONTAS
          </TabButton>
          <TabButton
            active={tab === "entregas"}
            onClick={() => setTab("entregas")}
          >
            ENTREGAS
          </TabButton>
          <TabButton
            active={tab === "cadastro"}
            onClick={() => setTab("cadastro")}
          >
            CADASTRO
          </TabButton>
          <TabButton
            active={tab === "relatorios"}
            onClick={() => setTab("relatorios")}
          >
            RELATÓRIOS
          </TabButton>
        </div>

        {/* Conteúdo da aba */}
        {tab === "contas" && <Contas />}
        {tab === "entregas" && <Entregas />}
        {tab === "cadastro" && <Cadastro />}
        {tab === "relatorios" && <Relatorios />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        border: "1px solid #ccc",
        borderBottom: active ? "2px solid #000" : "1px solid #ccc",
        background: active ? "#eef" : "#fff",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}