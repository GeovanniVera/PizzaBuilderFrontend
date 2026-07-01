import type { CSSProperties } from "react";
import { IconShoppingCart } from "@tabler/icons-react";
import { formatoMoneda } from "../utils/formatear.ts";

interface Props {
  cantidad: number;
  total: number;
  onClick: () => void;
}

export default function CarritoFlotante({ cantidad, total, onClick }: Props) {
  if (cantidad === 0) return null;

  return (
    <button type="button" onClick={onClick} style={estilos.boton}>
      <div style={estilos.contenido}>
        <div style={estilos.iconoWrapper}>
          <IconShoppingCart size={22} stroke={1.8} />
          <span style={estilos.badge}>{cantidad}</span>
        </div>
        <span style={estilos.texto}>Ver pedido</span>
        <span style={estilos.total}>{formatoMoneda(total)}</span>
      </div>
    </button>
  );
}

const estilos: Record<string, CSSProperties> = {
  boton: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 100,
    border: "none",
    borderRadius: 14,
    background: "var(--terracota-oscuro)",
    color: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
    transition: "transform 0.15s, box-shadow 0.15s",
    padding: 0,
  },
  contenido: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 22px",
  },
  iconoWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -10,
    background: "var(--queso)",
    color: "var(--terracota-oscuro)",
    fontSize: 11,
    fontWeight: 800,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  },
  texto: {
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  total: {
    fontFamily: "var(--fuente-mono)",
    fontSize: 15,
    fontWeight: 700,
    color: "var(--queso)",
  },
};
