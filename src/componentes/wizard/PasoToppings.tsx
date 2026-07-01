import { useCatalogo } from "../../contextos/CatalogoContext.tsx";
import TarjetaOpcion from "../layout/TarjetaOpcion.tsx";
import EncabezadoPaso from "../layout/EncabezadoPaso.tsx";
import { PANTALLA } from "../../utils/constantes.ts";
import { formatoMoneda } from "../../utils/formatear.ts";
import type { Construccion } from "../../types/index.ts";

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

interface Props {
  construccion: Construccion;
  actualizar: (cambios: Partial<Construccion>) => void;
  irA: (pantalla: string) => void;
}

function normalizar(texto: string) {
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

export default function PasoToppings({ construccion, actualizar, irA }: Props) {
  const { toppings, cargando, error } = useCatalogo();

  function alternar(nombreTopping: string) {
    const listaActual = construccion.toppings || [];
    const yaSeleccionado = listaActual.includes(nombreTopping);
    const nuevaLista = yaSeleccionado
      ? listaActual.filter((t: string) => t !== nombreTopping)
      : [...listaActual, nombreTopping];
    actualizar({ toppings: nuevaLista });
  }

  function continuar() {
    actualizar({ pantalla: PANTALLA.EXTRA_QUESO });
  }

  if (cargando) return <p>Cargando toppings...</p>;
  if (error) return <p style={{ color: "var(--error)" }}>{error}</p>;

  const listaActual = construccion.toppings || [];

  const totalToppings = toppings.reduce((acc, t) => {
    return listaActual.includes(t.nombre) ? acc + Number(t.precio) : acc;
  }, 0);

  return (
    <div>
      <EncabezadoPaso
        titulo="Elige tus toppings"
        subtitulo="Puedes elegir varios, o ninguno"
        leyenda="Cada topping tiene un costo individual. Solo pagás por los que elijas."
        onAtras={() => irA(PANTALLA.MASA)}
      />

      <div style={estilos.grid}>
        {toppings &&
          toppings.map((topping: { nombre: string; precio: number }) => {
            const key = normalizar(topping.nombre);
            const iconoVisual = key in MAPA_ICONOS ? MAPA_ICONOS[key as keyof typeof MAPA_ICONOS] : undefined;
            return (
              <TarjetaOpcion
                key={topping.nombre}
                emoji={iconoVisual || <IconCheese />}
                titulo={topping.nombre}
                precio={formatoMoneda(topping.precio)}
                seleccionada={listaActual.includes(topping.nombre)}
                onClick={() => alternar(topping.nombre)}
              />
            );
          })}
      </div>

      {listaActual.length > 0 && (
        <p style={estilos.totalParcial}>Toppings: {formatoMoneda(totalToppings)}</p>
      )}

      <button type="button" onClick={continuar} style={estilos.botonContinuar}>
        Continuar
      </button>
    </div>
  );
}

const estilos = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 12,
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
  totalParcial: {
    marginTop: 0,
    marginBottom: 20,
    fontFamily: "var(--fuente-mono)",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--tomate)",
    textAlign: "right" as const,
    maxWidth: 760,
  },
};