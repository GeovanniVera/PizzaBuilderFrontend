import { useCatalogo } from "../../contextos/CatalogoContext.tsx";
import TarjetaOpcion from "../layout/TarjetaOpcion.tsx";
import EncabezadoPaso from "../layout/EncabezadoPaso.tsx";
import { PANTALLA } from "../../utils/constantes.ts";
import { formatoMoneda } from "../../utils/formatear.ts";
import type { Construccion } from "../../types/index.ts";
import { IconBottle } from "@tabler/icons-react";

interface Props {
  construccion: Construccion;
  actualizar: (cambios: Partial<Construccion>) => void;
  irA: (pantalla: string) => void;
}

export default function PasoBebida({ construccion, actualizar, irA }: Props) {
  const { bebidas, cargando, error } = useCatalogo();

  function elegir(nombreBebida: string) {
    actualizar({ nombreBebida, pantalla: PANTALLA.POSTRE });
  }

  if (cargando) return <p>Cargando bebidas...</p>;
  if (error) return <p style={{ color: "var(--error)" }}>{error}</p>;

  return (
    <div>
      <EncabezadoPaso
        titulo="Elige tu bebida"
        leyenda="Elegí una bebida para acompañar tu combo. El precio se suma al total."
        onAtras={() => irA(PANTALLA.EXTRA_QUESO)}
      />

      <div style={estilos.grid}>
        {bebidas.map((bebida) => (
          <TarjetaOpcion
            key={bebida.nombre}
            emoji={<IconBottle size={36} stroke={1.5} />}
            titulo={bebida.nombre}
            precio={formatoMoneda(bebida.precio)}
            seleccionada={construccion.nombreBebida === bebida.nombre}
            onClick={() => elegir(bebida.nombre)}
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
