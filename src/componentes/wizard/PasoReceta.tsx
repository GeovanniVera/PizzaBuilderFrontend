import { useCatalogo } from "../../contextos/CatalogoContext.tsx";
import TarjetaOpcion from "../layout/TarjetaOpcion.tsx";
import EncabezadoPaso from "../layout/EncabezadoPaso.tsx";
import { formatearNombre } from "../../utils/formatear.ts";
import { PANTALLA } from "../../utils/constantes.ts";
import type { Construccion } from "../../types/index.ts";
import { IconPizza } from "@tabler/icons-react";

interface Props {
  construccion: Construccion;
  actualizar: (cambios: Partial<Construccion>) => void;
  irA: (pantalla: string) => void;
}

export default function PasoReceta({ construccion, actualizar, irA }: Props) {
  const { recetas, cargando, error } = useCatalogo();

  function elegir(nombreReceta: string) {
    actualizar({ nombreReceta, pantalla: PANTALLA.TAMANO });
  }

  if (cargando) return <p>Cargando recetas...</p>;
  if (error) return <p style={{ color: "var(--error)" }}>{error}</p>;

  return (
    <div>
      <EncabezadoPaso
        titulo="Elige una receta"
        subtitulo="Nuestras combinaciones favoritas"
        leyenda="El precio incluye la base más los ingredientes de la receta. Podés personalizar el tamaño y agregar extra queso después."
        onAtras={() => irA(PANTALLA.TIPO)}
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

const estilos = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
    gap: 18,
    maxWidth: 720,
  },
};
