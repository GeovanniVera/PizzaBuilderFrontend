import type { CSSProperties } from "react";
import { IconInfoCircle } from "@tabler/icons-react";

interface Props {
  titulo: string;
  subtitulo?: string;
  leyenda?: string;
  onAtras?: () => void;
}

export default function EncabezadoPaso({ titulo, subtitulo, leyenda, onAtras }: Props) {
  return (
    <div style={estilos.contenedor}>
      {onAtras && (
        <button type="button" onClick={onAtras} style={estilos.botonAtras}>
          ← Atrás
        </button>
      )}
      <h2 style={estilos.titulo}>{titulo}</h2>
      {subtitulo && <p style={estilos.subtitulo}>{subtitulo}</p>}
      {leyenda && (
        <div style={estilos.leyenda}>
          <IconInfoCircle size={14} stroke={1.8} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{leyenda}</span>
        </div>
      )}
    </div>
  );
}

const estilos: Record<string, CSSProperties> = {
  contenedor: {
    marginBottom: 28,
  },
  botonAtras: {
    border: "none",
    background: "none",
    color: "var(--texto-secundario)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
    marginBottom: 14,
  },
  titulo: {
    margin: 0,
    fontFamily: "var(--fuente-display)",
    fontSize: 28,
    fontWeight: 700,
    color: "var(--terracota-oscuro)",
  },
  subtitulo: {
    margin: "6px 0 0",
    fontSize: 14,
    color: "var(--texto-secundario)",
  },
  leyenda: {
    display: "flex",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 10,
    padding: "10px 12px",
    background: "rgba(193, 67, 42, 0.06)",
    borderRadius: 10,
    fontSize: 12.5,
    color: "var(--texto-secundario)",
    lineHeight: 1.5,
  },
};
