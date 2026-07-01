import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

interface Props {
  titulo: string;
  descripcion?: string;
  precio: string;
  imagen?: string;
  icono?: ReactNode;
  accion: { etiqueta: string; onClick: () => void };
}

export default function TarjetaProducto({ titulo, descripcion, precio, imagen, icono, accion }: Props) {
  const [cargoError, setCargoError] = useState(false);

  return (
    <div data-tarjeta="true" style={estilos.tarjeta}>
      <div style={estilos.imagenContenedor}>
        {imagen && !cargoError ? (
          <img
            src={imagen}
            alt={titulo}
            style={estilos.imagen}
            onError={() => setCargoError(true)}
            loading="lazy"
          />
        ) : (
          <div style={estilos.placeholder}>
            <span style={estilos.placeholderEmoji}>🍕</span>
            <span style={estilos.placeholderTexto}>Próximamente</span>
          </div>
        )}
      </div>

      <div style={estilos.cuerpo}>
        <div style={estilos.cabecera}>
          {icono && <span style={estilos.icono}>{icono}</span>}
          <h3 style={estilos.titulo}>{titulo}</h3>
        </div>
        <span style={estilos.precio}>{precio}</span>
        {descripcion && <p style={estilos.descripcion}>{descripcion}</p>}
        <div style={estilos.accionFila}>
          <span style={estilos.spacer} />
          <button type="button" onClick={accion.onClick} style={estilos.boton}>
            {accion.etiqueta} +
          </button>
        </div>
      </div>
    </div>
  );
}

const estilos: Record<string, CSSProperties> = {
  tarjeta: {
    background: "#ffffff",
    borderRadius: 14,
    border: "1px solid var(--borde)",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
    transition: "box-shadow 0.25s, transform 0.25s",
    cursor: "default",
  },
  imagenContenedor: {
    width: "100%",
    height: 140,
    overflow: "hidden",
    background: "var(--masa-oscura)",
  },
  imagen: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    background: "linear-gradient(135deg, var(--masa) 0%, var(--masa-oscura) 100%)",
  },
  placeholderEmoji: {
    fontSize: 28,
    opacity: 0.5,
  },
  placeholderTexto: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--texto-secundario)",
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    opacity: 0.5,
  },
  cuerpo: {
    padding: "14px 18px 14px",
  },
  cabecera: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  icono: {
    display: "flex",
    color: "var(--tomate)",
    flexShrink: 0,
  },
  titulo: {
    margin: 0,
    fontFamily: "var(--fuente-display)",
    fontSize: 20,
    fontWeight: 700,
    color: "var(--carbon)",
    lineHeight: 1.2,
  },
  precio: {
    display: "block",
    fontFamily: "var(--fuente-mono)",
    fontSize: 15,
    fontWeight: 700,
    color: "var(--tomate)",
    marginTop: 2,
  },
  descripcion: {
    margin: "4px 0 0",
    fontSize: 12.5,
    color: "var(--texto-secundario)",
    lineHeight: 1.4,
  },
  accionFila: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid var(--borde)",
  },
  spacer: {
    flex: 1,
  },
  boton: {
    border: "1.5px solid var(--tomate)",
    background: "transparent",
    color: "var(--tomate)",
    fontWeight: 700,
    fontSize: 12.5,
    padding: "7px 16px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.15s",
  },
};
