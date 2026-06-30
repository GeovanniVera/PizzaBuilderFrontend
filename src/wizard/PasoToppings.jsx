import React from "react";

import { useCatalogo } from "../catalogo/CatalogoContext.jsx";
import TarjetaOpcion from "./TarjetaOpcion.jsx";
import EncabezadoPaso from "./EncabezadoPaso.jsx";

// 1. ICONOS DE TABLER (verificados: todos existen en @tabler/icons-react)
import {
  IconApple,        // piña -> no hay ícono de piña, usamos fruta genérica
  IconMeat,         // jamón
  IconCheese,       // queso mozzarella
  IconLeaf,         // albahaca
  IconCircleDot,    // pepperoni
  IconMushroom,     // champiñones
  IconCircle,       // cebolla / aceitunas
} from "@tabler/icons-react";

function normalizar(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const MAPA_ICONOS = {
  "pina": <IconApple size={36} stroke={1.5} />,
  "jamon": <IconMeat size={36} stroke={1.5} />,
  "queso mozzarella": <IconCheese size={36} stroke={1.5} />,
  "albahaca": <IconLeaf size={36} stroke={1.5} />,
  "pepperoni": <IconCircleDot size={36} stroke={2} />,
  "champinones": <IconMushroom size={36} stroke={1.5} />,
  "cebolla": <IconCircle size={36} stroke={1.2} />,
  "aceitunas": <IconCircle size={24} stroke={2} />,
  "tocino": <IconMeat size={36} stroke={2} />
};

export default function PasoToppings({ construccion, actualizar, irA }) {
  const { toppings, cargando, error } = useCatalogo();

  function alternar(nombreTopping) {
    const listaActual = construccion.toppings || [];
    const yaSeleccionado = listaActual.includes(nombreTopping);
    const nuevaLista = yaSeleccionado
      ? listaActual.filter((t) => t !== nombreTopping)
      : [...listaActual, nombreTopping];
    actualizar({ toppings: nuevaLista });
  }

  function continuar() {
    actualizar({ pantalla: "EXTRA_QUESO" });
  }

  if (cargando) return <p>Cargando toppings...</p>;
  if (error) return <p style={{ color: "var(--error)" }}>{error}</p>;

  const listaActual = construccion.toppings || [];

  return (
    <div>
      <EncabezadoPaso
        titulo="Elige tus toppings"
        subtitulo="Puedes elegir varios, o ninguno"
        onAtras={() => irA("MASA")}
      />

      <div style={estilos.grid}>
        {toppings &&
          toppings.map((topping) => {
            const iconoVisual = MAPA_ICONOS[normalizar(topping.nombre)];
            return (
              <TarjetaOpcion
                key={topping.nombre}
                emoji={iconoVisual || <IconCheese />}
                titulo={topping.nombre}
                seleccionada={listaActual.includes(topping.nombre)}
                onClick={() => alternar(topping.nombre)}
              />
            );
          })}
      </div>

      <button type="button" onClick={continuar} style={estilos.botonContinuar}>
        Continuar
      </button>
    </div>
  );
}

const estilos = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
    maxWidth: 760,
    marginBottom: 28,
  },
  botonContinuar: {
    padding: "12px 28px",
    borderRadius: 10,
    border: "none",
    background: "var(--tomate)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
};