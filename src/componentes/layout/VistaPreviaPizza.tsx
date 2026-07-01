import { useMemo } from "react";
import type { CSSProperties } from "react";
import type { Construccion } from "../../types/index.ts";
import { formatearNombre } from "../../utils/formatear.ts";

interface Props {
  construccion: Construccion;
  toppingsReceta?: string[];
}

const TAMANO_DIAMETRO: Record<string, number> = {
  CHICA: 160,
  MEDIANA: 200,
  GRANDE: 240,
};

const COLOR_TOPPING: Record<string, string> = {
  Piña: "#f0c75e",
  Jamón: "#e89a8a",
  "Queso mozzarella": "#f5f0dc",
  Albahaca: "#5a8f4a",
  Pepperoni: "#b8301a",
  Champiñones: "#c4a882",
  Cebolla: "#b084b0",
  Aceitunas: "#3d3d3d",
  Tocino: "#a0522d",
};

const COLOR_FALLBACK = "#e0a87c";

function conicGradient(toppings: string[]): string {
  const partes = toppings.length;
  const grado = 360 / partes;
  const stops = toppings.map((nombre, i) => {
    const color = COLOR_TOPPING[nombre] ?? COLOR_FALLBACK;
    const desde = i * grado;
    const hasta = (i + 1) * grado;
    return `${color} ${desde}deg ${hasta}deg`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

export default function VistaPreviaPizza({ construccion, toppingsReceta }: Props) {
  const diametro = TAMANO_DIAMETRO[construccion.tamano ?? ""] ?? 160;

  const toppings = useMemo(() => {
    if (toppingsReceta && toppingsReceta.length > 0) return toppingsReceta;
    if (construccion.toppings.length > 0) return construccion.toppings;
    return null;
  }, [toppingsReceta, construccion.toppings]);

  const gradient = useMemo(() => toppings && toppings.length > 0 ? conicGradient(toppings) : null, [toppings]);

  const sinTamano = !construccion.tamano;

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.etiqueta}>Tu pizza</div>
      <div style={{ ...estilos.molde, width: diametro, height: diametro }}>
        {sinTamano ? (
          <div style={estilos.placeholder}>
            <span style={estilos.placeholderEmoji}>🍕</span>
            <span style={estilos.placeholderTexto}>Elegí un tamaño</span>
          </div>
        ) : (
          <div style={{ ...estilos.base, width: diametro, height: diametro, borderWidth: construccion.masa === "GRUESA" ? 8 : 4 }}>
            <div style={estilos.salsa}>
              <div style={{ ...estilos.queso, background: gradient ?? estilos.queso.background }}>
                {construccion.extraQueso && <div style={estilos.extraQueso} />}
              </div>
            </div>
          </div>
        )}
      </div>
      {construccion.tamano && (
        <div style={estilos.detalles}>
          {[construccion.tamano, construccion.masa, construccion.extraQueso && "Extra queso"]
            .filter(Boolean)
            .map(formatearNombre)
            .join(" · ")}
        </div>
      )}
    </div>
  );
}

const estilos: Record<string, CSSProperties> = {
  contenedor: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    paddingTop: 20,
  },
  etiqueta: {
    fontFamily: "var(--fuente-display)",
    fontSize: 13,
    fontWeight: 700,
    color: "var(--texto-secundario)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  molde: {
    position: "relative",
    borderRadius: "50%",
    overflow: "hidden",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    background: "var(--masa-oscura)",
    borderRadius: "50%",
  },
  placeholderEmoji: {
    fontSize: 32,
    opacity: 0.4,
  },
  placeholderTexto: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--texto-secundario)",
    opacity: 0.5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  base: {
    position: "absolute",
    borderRadius: "50%",
    background: "#e8c48a",
    borderStyle: "solid",
    borderColor: "#d4a76a",
    top: 0,
    left: 0,
  },
  salsa: {
    position: "absolute",
    width: "84%",
    height: "84%",
    borderRadius: "50%",
    background: "#b53b1a",
    top: "8%",
    left: "8%",
  },
  queso: {
    position: "absolute",
    width: "92%",
    height: "92%",
    borderRadius: "50%",
    background: "#f5e6b8",
    top: "4%",
    left: "4%",
    overflow: "hidden",
    opacity: 0.85,
  },
  extraQueso: {
    position: "absolute",
    width: "96%",
    height: "96%",
    borderRadius: "50%",
    background: "rgba(255, 230, 150, 0.3)",
    top: "2%",
    left: "2%",
  },
  detalles: {
    fontSize: 11.5,
    color: "var(--texto-secundario)",
    fontWeight: 500,
    textAlign: "center",
  },
};
