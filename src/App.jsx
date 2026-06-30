import React from "react";
import { NavLink, Route, Routes, Navigate } from "react-router-dom";

import { CatalogoProvider } from "./catalogo/CatalogoContext.jsx";
import { CarritoProvider } from "./carrito/CarritoContext.jsx";

import PaginaVender from "./paginas/PaginaVender.jsx";
import PaginaCatalogo from "./paginas/PaginaCatalogo.jsx";
import PaginaCorteCaja from "./paginas/PaginaCorteCaja.jsx";

export default function App() {
  return (
    <CatalogoProvider>
      <CarritoProvider>
        <div style={estilos.shell}>
          <header style={estilos.header}>
            <div style={estilos.logo}>La Toscana</div>
            <nav style={estilos.nav}>
              <NavLink to="/vender" style={({ isActive }) => navLinkStyle(isActive)}>
                Vender
              </NavLink>
              <NavLink to="/catalogo" style={({ isActive }) => navLinkStyle(isActive)}>
                Catálogo
              </NavLink>
              <NavLink to="/corte-caja" style={({ isActive }) => navLinkStyle(isActive)}>
                Corte de caja
              </NavLink>
            </nav>
          </header>

          <main style={estilos.main}>
            <Routes>
              <Route path="/" element={<Navigate to="/vender" replace />} />
              <Route path="/vender" element={<PaginaVender />} />
              <Route path="/catalogo" element={<PaginaCatalogo />} />
              <Route path="/corte-caja" element={<PaginaCorteCaja />} />
            </Routes>
          </main>
        </div>
      </CarritoProvider>
    </CatalogoProvider>
  );
}

function navLinkStyle(isActive) {
  return {
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    color: isActive ? "#ffffff" : "var(--terracota)",
    background: isActive ? "var(--tomate)" : "transparent",
  };
}

const estilos = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    background: "#ffffff",
    borderBottom: "1px solid var(--borde)",
  },
  logo: {
    fontFamily: "var(--fuente-display)",
    fontSize: 22,
    fontWeight: 700,
    color: "var(--terracota)",
  },
  nav: {
    display: "flex",
    gap: 8,
  },
  main: {
    flex: 1,
  },
};
