import React from "react";

import { useCatalogo } from "../catalogo/CatalogoContext.jsx";
import TarjetaOpcion from "./TarjetaOpcion.jsx";
import EncabezadoPaso from "./EncabezadoPaso.jsx";
import { IconPizza } from "@tabler/icons-react";

export default function PasoReceta({ construccion, actualizar, irA }) {
  const { recetas, cargando, error } = useCatalogo();

  function elegir(nombreReceta) {
    actualizar({ nombreReceta, pantalla: "TAMANO" });
  }

  if (cargando) return <p>Cargando recetas...</p>;
  if (error) return <p style={{ color: "var(--error)" }}>{error}</p>;

  return (
    <div>
      <EncabezadoPaso
        titulo="Elige una receta"
        subtitulo="Nuestras combinaciones favoritas"
        onAtras={() => irA("TIPO")}
      />

      <div style={estilos.grid}>
        {recetas.map((receta) => (
          <TarjetaOpcion
            key={receta.nombre}
            emoji={<IconPizza size={36}/>}
            titulo={formatearNombre(receta.nombre)}
            subtitulo={receta.toppings.join(", ")}
            seleccionada={construccion.nombreReceta === receta.nombre}
            onClick={() => elegir(receta.nombre)}
          />
        ))}
      </div>
    </div>
  );
}

function formatearNombre(nombre) {
  return nombre.charAt(0) + nombre.slice(1).toLowerCase();
}

const estilos = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 18,
    maxWidth: 720,
  },
};
