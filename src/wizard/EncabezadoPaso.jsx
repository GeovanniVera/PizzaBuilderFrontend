import React from "react";

export default function EncabezadoPaso({ titulo, subtitulo, onAtras }) {
  return (
    <div style={estilos.contenedor}>
      {onAtras && (
        <button type="button" onClick={onAtras} style={estilos.botonAtras}>
          ← Atrás
        </button>
      )}
      <h2 style={estilos.titulo}>{titulo}</h2>
      {subtitulo && <p style={estilos.subtitulo}>{subtitulo}</p>}
    </div>
  );
}

const estilos = {
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
};
