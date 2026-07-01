import { useCatalogo } from "../../contextos/CatalogoContext.tsx";
import TarjetaOpcion from "../layout/TarjetaOpcion.tsx";
import EncabezadoPaso from "../layout/EncabezadoPaso.tsx";
import { PANTALLA } from "../../utils/constantes.ts";
import { formatoMoneda } from "../../utils/formatear.ts";
import type { Construccion } from "../../types/index.ts";
import { IconCake } from "@tabler/icons-react";

interface Props {
  construccion: Construccion;
  actualizar: (cambios: Partial<Construccion>) => void;
  irA: (pantalla: string) => void;
}

export default function PasoPostre({ construccion, actualizar, irA }: Props) {
  const { postres, cargando, error } = useCatalogo();

  function elegir(nombrePostre: string) {
    actualizar({ nombrePostre, pantalla: PANTALLA.RESUMEN });
  }

  if (cargando) return <p>Cargando postres...</p>;
  if (error) return <p style={{ color: "var(--error)" }}>{error}</p>;

  return (
    <div>
      <EncabezadoPaso
        titulo="Elige tu postre"
        leyenda="Elegí un postre para completar tu combo. El precio se suma al total."
        onAtras={() => irA(PANTALLA.BEBIDA)}
      />

      <div style={estilos.grid}>
        {postres.map((postre) => (
          <TarjetaOpcion
            key={postre.nombre}
            emoji={<IconCake size={36} stroke={1.5} />}
            titulo={postre.nombre}
            precio={formatoMoneda(postre.precio)}
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
    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
    gap: 18,
    maxWidth: 720,
  },
};
