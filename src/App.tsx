import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import { IconPizza } from "@tabler/icons-react";

import { CatalogoProvider } from "./contextos/CatalogoContext.tsx";
import { CarritoProvider } from "./contextos/CarritoContext.tsx";

import PaginaMenu from "./pages/PaginaMenu.tsx";
import PaginaArmar from "./pages/PaginaArmar.tsx";

export default function App() {
  return (
    <CatalogoProvider>
      <CarritoProvider>
        <AppContent />
      </CarritoProvider>
    </CatalogoProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const esArmar = location.pathname === "/armar";

  return (
    <div style={estilos.shell}>
      {!esArmar && (
        <header style={estilos.header}>
          <div style={estilos.headerContenido}>
            <IconPizza size={24} stroke={1.5} style={{ color: "var(--queso)" }} />
            <span style={estilos.logo}>La Toscana</span>
          </div>
          <p style={estilos.slogan}>Pizzas artesanales</p>
        </header>
      )}

      <main style={estilos.main}>
        <Routes>
          <Route path="/" element={<PaginaMenu />} />
          <Route path="/armar" element={<PaginaArmar />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

const estilos: Record<string, CSSProperties> = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "transparent",
  },
  header: {
    background: "var(--terracota-oscuro)",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContenido: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    fontFamily: "var(--fuente-display)",
    fontSize: 20,
    fontWeight: 700,
    color: "#ffffff",
  },
  slogan: {
    margin: 0,
    fontSize: 11.5,
    color: "rgba(255,255,255,0.55)",
    fontWeight: 500,
    letterSpacing: 0.3,
  },
  main: {
    flex: 1,
  },
};
