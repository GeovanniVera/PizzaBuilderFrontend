import type { CSSProperties, ReactNode } from "react";

interface Props {
  titulo: string;
  subtitulo?: string;
  precio?: string;
  emoji?: ReactNode;
  seleccionada?: boolean;
  onClick: () => void;
}

export default function TarjetaOpcion({ titulo, subtitulo, precio, emoji, seleccionada, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...estilos.tarjeta,
        ...(seleccionada ? estilos.tarjetaSeleccionada : {}),
      }}
    >
      {emoji && <span style={estilos.emoji}>{emoji}</span>}
      <span style={estilos.titulo}>{titulo}</span>
      {subtitulo && <span style={estilos.subtitulo}>{subtitulo}</span>}
      {precio && <span style={estilos.precio}>{precio}</span>}
    </button>
  );
}

const estilos: Record<string, CSSProperties> = {
  tarjeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "28px 20px",
    minHeight: 140,
    borderRadius: 16,
    border: "2px solid var(--borde)",
    background: "#ffffff",
    cursor: "pointer",
    transition: "transform 0.12s, border-color 0.12s",
  },
  tarjetaSeleccionada: {
    border: "2px solid var(--tomate)",
    background: "#fdf3ee",
    transform: "translateY(-2px)",
  },
  emoji: {
    fontSize: 36,
  },
  titulo: {
    fontFamily: "var(--fuente-display)",
    fontSize: 17,
    fontWeight: 700,
    color: "var(--carbon)",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 12.5,
    color: "var(--texto-secundario)",
    textAlign: "center",
  },
  precio: {
    fontFamily: "var(--fuente-mono)",
    fontSize: 13,
    fontWeight: 700,
    color: "var(--tomate)",
    textAlign: "center",
  },
};
