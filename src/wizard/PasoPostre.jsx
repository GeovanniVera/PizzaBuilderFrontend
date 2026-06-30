import React from "react";

import { useCatalogo } from "../catalogo/CatalogoContext.jsx";
import TarjetaOpcion from "./TarjetaOpcion.jsx";
import EncabezadoPaso from "./EncabezadoPaso.jsx";

export default function PasoPostre({ construccion, actualizar, irA }) {
  const { postres, cargando, error } = useCatalogo();

  function elegir(nombrePostre) {
    actualizar({ nombrePostre, pantalla: "RESUMEN" });
  }

  if (cargando) return <p>Cargando postres...</p>;
  if (error) return <p style={{ color: "var(--error)" }}>{error}</p>;

  return (
    <div>
      <EncabezadoPaso titulo="Elige tu postre" onAtras={() => irA("BEBIDA")} />

      <div style={estilos.grid}>
        {postres.map((postre) => (
          <TarjetaOpcion
            key={postre.nombre}
            emoji="🍰"
            titulo={postre.nombre}
            seleccionada={construccion.nombrePostre === postre.nombre}
            onClick={() => elegir(postre.nombre)}
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
