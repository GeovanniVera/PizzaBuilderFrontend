import React from "react";

import TarjetaOpcion from "./TarjetaOpcion.jsx";
import EncabezadoPaso from "./EncabezadoPaso.jsx";
import { IconPackage, IconPaperBag, IconPizza, IconToolsKitchen2 } from '@tabler/icons-react';

export default function PasoTipoItem({ actualizar, irA }) {
  function elegir(tipo) {
    if (tipo === "GUSTO") {
      actualizar({ tipo: "GUSTO", pantalla: "TAMANO" });
    } else {
      actualizar({ tipo, pantalla: "RECETA" });
    }
  }

  return (
    <div>
      <EncabezadoPaso titulo="¿Qué quieres pedir?" subtitulo="Elige cómo armar tu pizza" />

      <div style={estilos.grid}>
        <TarjetaOpcion
          emoji={<IconPizza size={36} />}
          titulo="Arma tu pizza"
          subtitulo="Elige cada topping a tu gusto"
          onClick={() => elegir("GUSTO")}
        />
        <TarjetaOpcion
          emoji={<IconToolsKitchen2 size={36} />}
          titulo="Pizza por receta"
          subtitulo="Nuestras combinaciones favoritas"
          onClick={() => elegir("RECETA")}
        />
        <TarjetaOpcion
          emoji={<IconPaperBag size={36} />}
          titulo="Combo"
          subtitulo="Pizza + bebida + postre"
          onClick={() => elegir("COMBO")}
        />
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
