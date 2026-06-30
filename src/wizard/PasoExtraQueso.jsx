import React from "react";

import TarjetaOpcion from "./TarjetaOpcion.jsx";
import EncabezadoPaso from "./EncabezadoPaso.jsx";
// Importamos el icono del queso y añadimos IconCircleX para la negativa
import { IconCheese, IconCircleX } from "@tabler/icons-react";

export default function PasoExtraQueso({ construccion, actualizar, irA }) {
  function elegir(extraQueso) {
    const siguientePantalla = construccion.tipo === "COMBO" ? "BEBIDA" : "RESUMEN";
    actualizar({ extraQueso, pantalla: siguientePantalla });
  }

  function pasoAnterior() {
    if (construccion.tipo === "GUSTO") {
      irA("TOPPINGS");
    } else {
      irA("MASA");
    }
  }

  return (
    <div>
      <EncabezadoPaso titulo="¿Quieres extra queso?" onAtras={pasoAnterior} />

      <div style={estilos.grid}>
        {/* Configurados con tamaños homogéneos */}
        <TarjetaOpcion 
          emoji={<IconCheese size={36} stroke={1.5} />} 
          titulo="Sí, por favor" 
          onClick={() => elegir(true)} 
        />
        <TarjetaOpcion 
          emoji={<IconCircleX size={36} stroke={1.5} />} 
          titulo="No, gracias" 
          onClick={() => elegir(false)} 
        />
      </div>
    </div>
  );
}

const estilos = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 18,
    maxWidth: 480,
  },
};