import React, { useState } from "react";

import { useCarrito } from "./CarritoContext.jsx";

const URL_BASE = "http://localhost:8080/api";

function formatoMoneda(valor) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(valor) || 0);
}

function descripcionItem(item) {
  if (item.tipo === "PIZZA_GUSTO") return `Pizza ${item.tamano} al gusto`;
  if (item.tipo === "PIZZA_RECETA") return `Pizza ${item.tamano} · ${formatearNombre(item.nombreReceta)}`;
  return `Combo · ${formatearNombre(item.nombreReceta)}`;
}

function formatearNombre(nombre) {
  if (!nombre) return "";
  return nombre.charAt(0) + nombre.slice(1).toLowerCase();
}

export default function CarritoPanel({ totalEnConstruccion, hayItemEnProgreso }) {
  const { items, quitarItem, total, obtenerItemsParaBackend, vaciarCarrito } = useCarrito();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [ticket, setTicket] = useState(null);

  async function confirmarPedido() {
    setEnviando(true);
    setError(null);
    setTicket(null);

    try {
      const respuesta = await fetch(`${URL_BASE}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: obtenerItemsParaBackend() }),
      });

      const cuerpo = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(cuerpo.mensaje || "No se pudo confirmar el pedido.");
      }

      setTicket(cuerpo.datos);
      vaciarCarrito();
    } catch (err) {
      setError(err.message || "Ocurrió un error al confirmar el pedido.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <aside style={estilos.panel}>
      <h2 style={estilos.titulo}>Tu pedido</h2>

      {hayItemEnProgreso && (
        <div style={estilos.enProgresoBox}>
          <p style={estilos.enProgresoEtiqueta}>Armando ahora</p>
          <p style={estilos.enProgresoValor}>{formatoMoneda(totalEnConstruccion)}</p>
        </div>
      )}

      {items.length === 0 && !ticket && !hayItemEnProgreso && <p style={estilos.vacio}>Aún no has agregado nada</p>}

      <div style={estilos.lista}>
        {items.map((item) => (
          <div key={item.idTemporal} style={estilos.itemRow}>
            <div>
              <p style={estilos.itemDescripcion}>{descripcionItem(item)}</p>
              <p style={estilos.itemPrecio}>{formatoMoneda(item.precioEstimado)}</p>
            </div>
            <button type="button" onClick={() => quitarItem(item.idTemporal)} style={estilos.botonQuitar}>
              ×
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <>
          <div style={estilos.totalRow}>
            <span>Total</span>
            <span style={estilos.totalValor}>{formatoMoneda(total)}</span>
          </div>

          <button type="button" onClick={confirmarPedido} disabled={enviando} style={estilos.botonConfirmar}>
            {enviando ? "Confirmando..." : "Confirmar pedido"}
          </button>
        </>
      )}

      {error && <p style={estilos.error}>{error}</p>}

      {ticket && (
        <div style={estilos.ticket}>
          <p style={estilos.ticketTitulo}>¡Pedido confirmado!</p>
          <p style={estilos.ticketDato}>Folio: {ticket.id.slice(0, 8)}</p>
          <p style={estilos.ticketDato}>Total cobrado: {formatoMoneda(ticket.totalCobrado)}</p>
        </div>
      )}
    </aside>
  );
}

const estilos = {
  panel: {
    width: 320,
    flexShrink: 0,
    background: "var(--terracota-oscuro)",
    color: "#ffffff",
    padding: "32px 24px",
    overflowY: "auto",
  },
  titulo: {
    margin: "0 0 20px",
    fontFamily: "var(--fuente-display)",
    fontSize: 22,
    fontWeight: 700,
  },
  vacio: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },
  enProgresoBox: {
    marginBottom: 20,
    padding: "14px 16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px dashed rgba(255,255,255,0.3)",
    borderRadius: 10,
  },
  enProgresoEtiqueta: {
    margin: "0 0 4px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
  },
  enProgresoValor: {
    margin: 0,
    fontFamily: "var(--fuente-mono)",
    fontSize: 18,
    fontWeight: 600,
    color: "var(--queso)",
  },
  lista: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 20,
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "10px 12px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: 10,
  },
  itemDescripcion: {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
  },
  itemPrecio: {
    margin: "4px 0 0",
    fontFamily: "var(--fuente-mono)",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  botonQuitar: {
    border: "none",
    background: "none",
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
    cursor: "pointer",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 14,
    borderTop: "1px solid rgba(255,255,255,0.15)",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 16,
  },
  totalValor: {
    fontFamily: "var(--fuente-mono)",
    fontSize: 18,
    color: "var(--queso)",
  },
  botonConfirmar: {
    width: "100%",
    padding: "12px 0",
    borderRadius: 10,
    border: "none",
    background: "var(--queso)",
    color: "var(--terracota-oscuro)",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  error: {
    marginTop: 14,
    fontSize: 12.5,
    color: "#ffb4ad",
  },
  ticket: {
    marginTop: 20,
    padding: "16px 18px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: 10,
  },
  ticketTitulo: {
    margin: "0 0 8px",
    fontWeight: 700,
    fontSize: 14,
  },
  ticketDato: {
    margin: "2px 0",
    fontSize: 12.5,
    color: "rgba(255,255,255,0.85)",
  },
};