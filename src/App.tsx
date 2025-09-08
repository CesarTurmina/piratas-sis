import React, { useState } from "react";
import Contas from "./components/Contas";
import Entregas from "./components/Entregas";
import Cadastro from "./components/Cadastro";
import Relatorios from "./components/Relatorios";
import logoSrc from "./assets/logo.png";

type Tab = "contas" | "entregas" | "cadastro" | "relatorios";

export default function App() {
  const [tab, setTab] = useState<Tab>("contas");
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
    window.api.toggleWindow(expanded ? "shrink" : "expand");
  };

  if (!expanded) {
    // 👉 estado recolhido: logo fixa no canto inferior direito
    return (
      <div
        style={{
          background: "transparent",
          width: "100%",
          height: "100%",
        }}
      >
        <img
          src={logoSrc}
          alt="logo"
          onClick={toggleExpand}
          onMouseEnter={() => window.api.setIgnoreMouseEvents(false)}
          onMouseLeave={() => window.api.setIgnoreMouseEvents(true)} 
          style={{
            height: 70,
            cursor: "pointer",
            position: "fixed",
            bottom: 20,
            right: 20,
            borderRadius: "50%", // 🔵 logo arredondada
            userSelect: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)", // sombra leve
          }}
          draggable={false}
        />
      </div>
    );
  }

  // 👉 estado expandido
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        overflow: "hidden",
        borderRadius: 12,
        padding: 4,
        boxSizing: "border-box",
      }}
    >
      {/* Cabeçalho + conteúdo */}
      <div
        style={{
          width: "100%",
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
            src={logoSrc}
            alt="logo"
            onClick={toggleExpand}
            style={{
              height: 60,
              cursor: "pointer",
              borderRadius: "50%",
            }}
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
