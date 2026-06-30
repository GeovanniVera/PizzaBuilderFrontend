import React from "react";
import TarjetaOpcion from "./TarjetaOpcion.jsx";
import EncabezadoPaso from "./EncabezadoPaso.jsx";
// 1. IMPORTACIÓN CORREGIDA: Traemos el icono de Tabler
import { IconCircle } from '@tabler/icons-react';

// 2. CONSTANTE CORREGIDA: Se eliminan las llaves sueltas dentro del objeto
// y se cierra correctamente el objeto de GRUESA.
const MASAS = [
  { valor: "DELGADA", emoji: <IconCircle size={36} stroke={1} /> },
  { valor: "GRUESA", emoji: <IconCircle size={36} stroke={3.5} /> },
];

export default function PasoMasa({ construccion, actualizar, irA }) {
  function elegir(masa) {
    const siguientePantalla = construccion.tipo === "GUSTO" ? "TOPPINGS" : "EXTRA_QUESO";
    actualizar({ masa, pantalla: siguientePantalla });
  }

  return (
    <div>
      <EncabezadoPaso titulo="Elige la masa" onAtras={() => irA("TAMANO")} />

      <div style={estilos.grid}>
        {MASAS.map((m) => (
          <TarjetaOpcion
            key={m.valor}
            emoji={m.emoji}
            titulo={formatearNombre(m.valor)}
            seleccionada={construccion.masa === m.valor}
            onClick={() => elegir(m.valor)}
          />
        ))}
      </div>
    </div>
  );
}

// 3. MEJORA EN LA FUNCIÓN: Tu función original dejaba el texto como "Delgada" o "Gruesa"
// pero si el string original es "DELGADA", .slice(1).toLowerCase() lo convierte en "elgada", 
// dando como resultado "Delgada". ¡Funciona perfecto!
function formatearNombre(nombre) {
  return nombre.charAt(0) + nombre.slice(1).toLowerCase();
}

const estilos = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 18,
    maxWidth: 480,
  },
};