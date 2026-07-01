import TarjetaOpcion from "../layout/TarjetaOpcion.tsx";
import EncabezadoPaso from "../layout/EncabezadoPaso.tsx";
import { formatearNombre, formatoMoneda } from "../../utils/formatear.ts";
import { PANTALLA, TIPO } from "../../utils/constantes.ts";
import type { Construccion } from "../../types/index.ts";
import { useCatalogo } from "../../contextos/CatalogoContext.tsx";
import { IconPizza } from "@tabler/icons-react";

const TAMANOS = [
  { valor: "CHICA", emoji: "🍕" },
  { valor: "MEDIANA", emoji: "🍕" },
  { valor: "GRANDE", emoji: "🍕" },
];

interface Props {
  construccion: Construccion;
  actualizar: (cambios: Partial<Construccion>) => void;
  irA: (pantalla: string) => void;
  onSalir?: () => void;
}

export default function PasoTamano({ construccion, actualizar, irA, onSalir }: Props) {
  const { configuracionPrecios } = useCatalogo();

  function precioTamano(valor: string): string {
    if (!configuracionPrecios) return "";
    const cargo = Number(configuracionPrecios.cargosPorTamano[valor] || 0);
    if (cargo <= 0) return "Incluido";
    return `+ ${formatoMoneda(cargo)}`;
  }

  function elegir(tamano: string) {
    actualizar({ tamano, pantalla: PANTALLA.MASA });
  }

  function pasoAnterior() {
    if (onSalir) {
      onSalir();
    } else if (construccion.tipo === TIPO.GUSTO) {
      irA(PANTALLA.TIPO);
    } else {
      irA(PANTALLA.RECETA);
    }
  }

  return (
    <div>
      <EncabezadoPaso
        titulo="Elige el tamaño"
        leyenda="El tamaño chico viene incluido en el precio base de tu pizza. Los tamaños más grandes tienen un costo adicional."
        onAtras={pasoAnterior}
      />

      <div style={estilos.grid}>
        {TAMANOS.map((t) => (
          <TarjetaOpcion
            key={t.valor}
            emoji={<IconPizza size={36} />}
            titulo={formatearNombre(t.valor)}
            precio={precioTamano(t.valor)}
            seleccionada={construccion.tamano === t.valor}
            onClick={() => elegir(t.valor)}
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
