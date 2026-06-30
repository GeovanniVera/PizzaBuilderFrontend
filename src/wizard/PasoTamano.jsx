import React from "react";

import TarjetaOpcion from "./TarjetaOpcion.jsx";
import EncabezadoPaso from "./EncabezadoPaso.jsx";
import { IconPizza } from "@tabler/icons-react";

const TAMANOS = [
  { valor: "CHICA", emoji: "🍕" },
  { valor: "MEDIANA", emoji: "🍕" },
  { valor: "GRANDE", emoji: "🍕" },
];

export default function PasoTamano({ construccion, actualizar, irA }) {
  function elegir(tamano) {
    actualizar({ tamano, pantalla: "MASA" });
  }

  function pasoAnterior() {
    if (construccion.tipo === "GUSTO") {
      irA("TIPO");
    } else {
      irA("RECETA");
    }
  }

  return (
    <div>
      <EncabezadoPaso titulo="Elige el tamaño" onAtras={pasoAnterior} />

      <div style={estilos.grid}>
        {TAMANOS.map((t) => (
          <TarjetaOpcion
            key={t.valor}
            emoji={<IconPizza size={36} />}
            titulo={formatearNombre(t.valor)}
            seleccionada={construccion.tamano === t.valor}
            onClick={() => elegir(t.valor)}
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
