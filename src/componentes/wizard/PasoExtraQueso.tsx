import TarjetaOpcion from "../layout/TarjetaOpcion.tsx";
import EncabezadoPaso from "../layout/EncabezadoPaso.tsx";
import { PANTALLA, TIPO } from "../../utils/constantes.ts";
import { formatoMoneda } from "../../utils/formatear.ts";
import type { Construccion } from "../../types/index.ts";
import { useCatalogo } from "../../contextos/CatalogoContext.tsx";
import { IconCheese, IconCircleX } from "@tabler/icons-react";

interface Props {
  construccion: Construccion;
  actualizar: (cambios: Partial<Construccion>) => void;
  irA: (pantalla: string) => void;
}

export default function PasoExtraQueso({ construccion, actualizar, irA }: Props) {
  const { configuracionPrecios } = useCatalogo();
  const cargoExtra = Number(configuracionPrecios?.cargoExtraQueso || 0);

  function elegir(extraQueso: boolean) {
    const siguientePantalla = construccion.tipo === TIPO.COMBO ? PANTALLA.BEBIDA : PANTALLA.RESUMEN;
    actualizar({ extraQueso, pantalla: siguientePantalla });
  }

  function pasoAnterior() {
    if (construccion.tipo === TIPO.GUSTO) {
      irA(PANTALLA.TOPPINGS);
    } else {
      irA(PANTALLA.MASA);
    }
  }

  return (
    <div>
      <EncabezadoPaso
        titulo="¿Quieres extra queso?"
        leyenda="El extra queso tiene un costo adicional. Seleccioná 'No, gracias' si preferís no agregarlo."
        onAtras={pasoAnterior}
      />

      <div style={estilos.grid}>
        <TarjetaOpcion 
          emoji={<IconCheese size={36} stroke={1.5} />} 
          titulo="Sí, por favor"
          precio={`+ ${formatoMoneda(cargoExtra)}`}
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