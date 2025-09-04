import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div style={{ padding: 16, fontFamily: "Inter, system-ui, Arial" }}>
      <h1>Piratas SIS — MVP</h1>
      <p>App carregado. (Vamos montar as abas nos próximos passos.)</p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);