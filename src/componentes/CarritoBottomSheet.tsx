import { useState, useMemo, useCallback } from "react";
import type { CSSProperties } from "react";
import { IconX, IconShoppingCart, IconChevronDown } from "@tabler/icons-react";

import { useCarrito } from "../contextos/CarritoContext.tsx";
import { useCatalogo } from "../contextos/CatalogoContext.tsx";
import { desglosarPrecio } from "../servicios/calcularPrecio.ts";
import { formatearNombre, formatoMoneda } from "../utils/formatear.ts";
import { TIPO_BACKEND, TIPO } from "../utils/constantes.ts";
import { confirmarPedido as confirmarPedidoApi } from "../api/pedidos.ts";
import type { Ticket, ItemCarrito, Construccion, Pantalla, TipoPizza } from "../types/index.ts";

interface Props {
  abierto: boolean;
  onCerrar: () => void;
}

function descripcionItem(tipo: string, tamano: string, nombreReceta?: string) {
  if (tipo === TIPO_BACKEND.PIZZA_GUSTO) return `Pizza ${tamano} al gusto`;
  if (tipo === TIPO_BACKEND.PIZZA_RECETA) return `Pizza ${tamano} · ${formatearNombre(nombreReceta || "")}`;
  return `Combo · ${formatearNombre(nombreReceta || "")}`;
}

function itemAConstruccion(item: ItemCarrito): Construccion {
  const tipo: TipoPizza =
    item.tipo === TIPO_BACKEND.PIZZA_GUSTO ? TIPO.GUSTO
      : item.tipo === TIPO_BACKEND.PIZZA_RECETA ? TIPO.RECETA
      : TIPO.COMBO;
  return {
    pantalla: "RESUMEN" as Pantalla,
    tipo,
    nombreReceta: item.nombreReceta ?? null,
    tamano: item.tamano,
    masa: item.masa,
    toppings: item.toppings ?? [],
    extraQueso: item.extraQueso,
    nombreBebida: item.nombreBebida ?? null,
    nombrePostre: item.nombrePostre ?? null,
  };
}

function ItemDesglose({ item }: { item: ItemCarrito }) {
  const catalogo = useCatalogo();
  const desglose = useMemo(() => desglosarPrecio(itemAConstruccion(item), catalogo), [item, catalogo]);

  const renglones: { etiqueta: string; valor: string }[] = [];
  if (desglose.precioBasePizza > 0) renglones.push({ etiqueta: "Base", valor: formatoMoneda(desglose.precioBasePizza) });
  if (desglose.cargoTamano > 0) renglones.push({ etiqueta: formatearNombre(item.tamano), valor: formatoMoneda(desglose.cargoTamano) });

  if (desglose.nombresToppingsPizza.length > 0) {
    if (item.tipo === TIPO_BACKEND.PIZZA_GUSTO) {
      for (const nombre of desglose.nombresToppingsPizza) {
        const topping = catalogo.toppings.find((t) => t.nombre === nombre);
        const precio = topping ? Number(topping.precio) : 0;
        renglones.push({ etiqueta: formatearNombre(nombre), valor: formatoMoneda(precio) });
      }
    } else {
      renglones.push({ etiqueta: `Toppings (${desglose.nombresToppingsPizza.length})`, valor: formatoMoneda(desglose.precioToppings) });
    }
  }

  if (desglose.cargoExtraQueso > 0) renglones.push({ etiqueta: "Extra queso", valor: formatoMoneda(desglose.cargoExtraQueso) });
  if (desglose.precioBebida > 0) renglones.push({ etiqueta: "Bebida", valor: formatoMoneda(desglose.precioBebida) });
  if (desglose.precioPostre > 0) renglones.push({ etiqueta: "Postre", valor: formatoMoneda(desglose.precioPostre) });

  return (
    <div style={estilos.desglose}>
      {renglones.map((r) => (
        <div key={r.etiqueta} style={estilos.desgloseRow}>
          <span style={estilos.desgloseEtiqueta}>{r.etiqueta}</span>
          <span style={estilos.desgloseValor}>{r.valor}</span>
        </div>
      ))}
    </div>
  );
}

export default function CarritoBottomSheet({ abierto, onCerrar }: Props) {
  const { items, quitarItem, total, obtenerItemsParaBackend, vaciarCarrito } = useCarrito();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  const toggleExpandido = useCallback((id: string) => {
    setExpandidos((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) nuevo.delete(id);
      else nuevo.add(id);
      return nuevo;
    });
  }, []);

  async function confirmar() {
    setEnviando(true);
    setError(null);
    setTicket(null);
    try {
      const respuesta = await confirmarPedidoApi(obtenerItemsParaBackend());
      setTicket(respuesta.datos);
      vaciarCarrito();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al confirmar el pedido.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      {abierto && <div style={estilos.overlay} onClick={onCerrar} />}
      <div style={{ ...estilos.sheet, transform: abierto ? "translateY(0)" : "translateY(100%)" }}>
        <div style={estilos.header}>
          <div style={estilos.headerIzq}>
            <IconShoppingCart size={20} stroke={1.8} />
            <h2 style={estilos.titulo}>Tu pedido</h2>
            {items.length > 0 && <span style={estilos.contador}>{items.length}</span>}
          </div>
          <button type="button" onClick={onCerrar} style={estilos.botonCerrar}>
            <IconX size={20} stroke={1.8} />
          </button>
        </div>

        {items.length === 0 && !ticket && (
          <div style={estilos.vacio}>
            <IconShoppingCart size={40} stroke={1.2} />
            <p style={estilos.vacioTexto}>Aún no has agregado nada</p>
          </div>
        )}

        <div style={estilos.lista}>
          {items.map((item) => {
            const expandido = expandidos.has(item.idTemporal);
            return (
              <div key={item.idTemporal} style={estilos.itemCard}>
                <button type="button" onClick={() => toggleExpandido(item.idTemporal)} style={estilos.itemHeader}>
                  <IconChevronDown
                    size={16}
                    stroke={2}
                    style={{
                      flexShrink: 0,
                      transition: "transform 0.2s",
                      transform: expandido ? "rotate(0deg)" : "rotate(-90deg)",
                    }}
                  />
                  <p style={estilos.itemNombre}>{descripcionItem(item.tipo, item.tamano, item.nombreReceta)}</p>
                  <span style={estilos.itemTotal}>{formatoMoneda(item.precioEstimado)}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); quitarItem(item.idTemporal); }}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); quitarItem(item.idTemporal); } }}
                    style={estilos.botonQuitar}
                  >
                    <IconX size={16} stroke={1.8} />
                  </span>
                </button>
                {expandido && <ItemDesglose item={item} />}
              </div>
            );
          })}
        </div>

        {items.length > 0 && (
          <>
            <div style={estilos.totalRow}>
              <span>Total</span>
              <span style={estilos.totalValor}>{formatoMoneda(total)}</span>
            </div>
            <button type="button" onClick={confirmar} disabled={enviando} style={estilos.botonConfirmar}>
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
      </div>
    </>
  );
}

const estilos: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 200,
  },
  sheet: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "85vh",
    background: "#ffffff",
    borderRadius: "20px 20px 0 0",
    zIndex: 201,
    padding: "20px 24px 28px",
    overflowY: "auto",
    transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
    boxShadow: "0 -4px 30px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerIzq: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  titulo: {
    margin: 0,
    fontFamily: "var(--fuente-display)",
    fontSize: 20,
    fontWeight: 700,
    color: "var(--carbon)",
  },
  contador: {
    background: "var(--queso)",
    color: "var(--terracota-oscuro)",
    fontSize: 12,
    fontWeight: 800,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  botonCerrar: {
    border: "none",
    background: "var(--masa)",
    borderRadius: 8,
    padding: 6,
    cursor: "pointer",
    color: "var(--texto-secundario)",
    display: "flex",
  },
  vacio: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    padding: "40px 0",
    color: "var(--texto-secundario)",
  },
  vacioTexto: {
    margin: 0,
    fontSize: 14,
  },
  lista: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 16,
  },
  itemCard: {
    background: "var(--masa)",
    borderRadius: 12,
    padding: "12px 14px",
  },
  itemHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    border: "none",
    background: "none",
    padding: 0,
    cursor: "pointer",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    textAlign: "left",
  },
  itemNombre: {
    margin: 0,
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--carbon)",
    flex: 1,
  },
  itemTotal: {
    fontFamily: "var(--fuente-mono)",
    fontSize: 13,
    fontWeight: 700,
    color: "var(--tomate)",
    flexShrink: 0,
  },
  botonQuitar: {
    border: "none",
    background: "rgba(0,0,0,0.05)",
    borderRadius: 6,
    padding: 4,
    cursor: "pointer",
    color: "var(--texto-secundario)",
    display: "flex",
    flexShrink: 0,
    lineHeight: 1,
  },
  desglose: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1px solid var(--borde)",
  },
  desgloseRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
  },
  desgloseEtiqueta: {
    color: "var(--texto-secundario)",
  },
  desgloseValor: {
    fontFamily: "var(--fuente-mono)",
    color: "var(--carbon)",
    fontWeight: 600,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 14,
    borderTop: "1.5px solid var(--borde)",
    fontSize: 15,
    fontWeight: 700,
    color: "var(--carbon)",
    marginBottom: 16,
  },
  totalValor: {
    fontFamily: "var(--fuente-mono)",
    fontSize: 20,
    color: "var(--tomate)",
  },
  botonConfirmar: {
    width: "100%",
    padding: "14px 0",
    borderRadius: 12,
    border: "none",
    background: "var(--tomate)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  error: {
    marginTop: 12,
    fontSize: 12.5,
    color: "var(--error)",
    textAlign: "center",
  },
  ticket: {
    textAlign: "center",
    padding: "24px 0",
  },
  ticketTitulo: {
    margin: "0 0 4px",
    fontFamily: "var(--fuente-display)",
    fontSize: 20,
    fontWeight: 700,
    color: "var(--exito)",
  },
  ticketDato: {
    margin: "2px 0",
    fontSize: 13,
    color: "var(--texto-secundario)",
  },
};
