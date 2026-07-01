import TarjetaOpcion from "../layout/TarjetaOpcion.tsx";
import EncabezadoPaso from "../layout/EncabezadoPaso.tsx";
import { formatearNombre } from "../../utils/formatear.ts";
import { PANTALLA, TIPO } from "../../utils/constantes.ts";
import type { Construccion } from "../../types/index.ts";
import { IconCircle } from '@tabler/icons-react';

const MASAS = [
  { valor: "DELGADA", emoji: <IconCircle size={36} stroke={1} /> },
  { valor: "GRUESA", emoji: <IconCircle size={36} stroke={3.5} /> },
];

interface Props {
  construccion: Construccion;
  actualizar: (cambios: Partial<Construccion>) => void;
  irA: (pantalla: string) => void;
}

export default function PasoMasa({ construccion, actualizar, irA }: Props) {
  function elegir(masa: string) {
    const siguientePantalla = construccion.tipo === TIPO.GUSTO ? PANTALLA.TOPPINGS : PANTALLA.EXTRA_QUESO;
    actualizar({ masa, pantalla: siguientePantalla });
  }

  return (
    <div>
      <EncabezadoPaso
        titulo="Elige la masa"
        leyenda="Ambas masas tienen el mismo precio, elegí la que más te guste."
        onAtras={() => irA(PANTALLA.TAMANO)}
      />

      <div style={estilos.grid}>
        {MASAS.map((m) => (
          <TarjetaOpcion
            key={m.valor}
            emoji={m.emoji}
            titulo={formatearNombre(m.valor)}
            precio="Incluido"
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
const estilos = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 18,
    maxWidth: 480,
  },
};