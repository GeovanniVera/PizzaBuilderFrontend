import React from "react";

import { useCatalogo } from "../catalogo/CatalogoContext.jsx";
import TarjetaOpcion from "./TarjetaOpcion.jsx";
import EncabezadoPaso from "./EncabezadoPaso.jsx";

export default function PasoBebida({ construccion, actualizar, irA }) {
  const { bebidas, cargando, error } = useCatalogo();

  function elegir(nombreBebida) {
    actualizar({ nombreBebida, pantalla: "POSTRE" });
  }

  if (cargando) return <p>Cargando bebidas...</p>;
  if (error) return <p style={{ color: "var(--error)" }}>{error}</p>;

  return (
    <div>
      <EncabezadoPaso titulo="Elige tu bebida" onAtras={() => irA("EXTRA_QUESO")} />

      <div style={estilos.grid}>
        {bebidas.map((bebida) => (
          <TarjetaOpcion
            key={bebida.nombre}
            emoji="🥤"
            titulo={bebida.nombre}
            seleccionada={construccion.nombreBebida === bebida.nombre}
            onClick={() => elegir(bebida.nombre)}
          />
        ))}
      </div>
    </div>
  );
}

const estilos = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 18,
    maxWidth: 720,
  },
};
