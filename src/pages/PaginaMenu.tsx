import { useState, useMemo } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { IconPizza, IconPaperBag, IconChefHat } from "@tabler/icons-react";

import { useCatalogo } from "../contextos/CatalogoContext.tsx";
import { useCarrito } from "../contextos/CarritoContext.tsx";
import { desglosarPrecio } from "../servicios/calcularPrecio.ts";
import { TIPO } from "../utils/constantes.ts";
import { formatearNombre, formatoMoneda } from "../utils/formatear.ts";
import type { Construccion, Receta } from "../types/index.ts";
import TarjetaProducto from "../componentes/layout/TarjetaProducto.tsx";
import CarritoFlotante from "../componentes/CarritoFlotante.tsx";
import CarritoBottomSheet from "../componentes/CarritoBottomSheet.tsx";

type CategoriaId = "pizzas" | "combos";

const CATEGORIAS: { id: CategoriaId; etiqueta: string; icono: typeof IconPizza }[] = [
  { id: "pizzas", etiqueta: "Pizzas", icono: IconPizza },
  { id: "combos", etiqueta: "Combos", icono: IconPaperBag },
];

export default function PaginaMenu() {
  const navigate = useNavigate();
  const catalogo = useCatalogo();
  const { items, total } = useCarrito();
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaId>("pizzas");
  const [cartAbierto, setCartAbierto] = useState(false);

  const preciosRecetas = useMemo(() => {
    const mapa: Record<string, number> = {};
    if (!catalogo.configuracionPrecios) return mapa;
    for (const r of catalogo.recetas) {
      const c: Construccion = {
        pantalla: "RESUMEN" as const,
        tipo: "RECETA" as const,
        nombreReceta: r.nombre,
        tamano: "MEDIANA",
        masa: "DELGADA",
        toppings: [],
        extraQueso: false,
        nombreBebida: null,
        nombrePostre: null,
      };
      mapa[r.nombre] = desglosarPrecio(c, catalogo).total;
    }
    return mapa;
  }, [catalogo.recetas, catalogo.configuracionPrecios, catalogo]);

  const precioComboMinimo = useMemo(() => {
    if (!catalogo.configuracionPrecios || catalogo.bebidas.length === 0 || catalogo.postres.length === 0) return 0;
    const bebidaMin = Math.min(...catalogo.bebidas.map((b) => Number(b.precio)));
    const postreMin = Math.min(...catalogo.postres.map((p) => Number(p.precio)));
    return bebidaMin + postreMin;
  }, [catalogo.bebidas, catalogo.postres, catalogo.configuracionPrecios]);

  function abrirPersonalizar(receta: Receta, tipo: "RECETA" | "COMBO") {
    navigate("/armar", { state: { receta: receta.nombre, tipo } });
  }

  function abrirArmaTuPizza() {
    navigate("/armar", { state: { receta: null, tipo: "GUSTO" } });
  }

  if (catalogo.cargando) {
    return (
      <div style={estilos.estadoContenedor}>
        <p style={estilos.estadoTexto}>Cargando menú…</p>
      </div>
    );
  }

  if (catalogo.error) {
    return (
      <div style={estilos.estadoContenedor}>
        <p style={estilos.estadoError}>Error al cargar: {catalogo.error}</p>
        <button type="button" onClick={catalogo.recargar} style={estilos.botonReintentar}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={estilos.pagina}>
      <div style={estilos.cabecera}>
        <div style={estilos.cabeceraContenido}>
          <IconPizza size={32} stroke={1.5} style={{ color: "var(--queso)" }} />
          <div>
            <h1 style={estilos.tituloPagina}>Menú</h1>
            <p style={estilos.subtituloPagina}>Elegí lo que se te antoje</p>
          </div>
        </div>
      </div>

      <div style={estilos.tabsWrapper}>
        <div style={estilos.tabs}>
          {CATEGORIAS.map((cat) => {
            const Icono = cat.icono;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoriaActiva(cat.id)}
                style={{
                  ...estilos.tab,
                  ...(categoriaActiva === cat.id ? estilos.tabActiva : {}),
                }}
              >
                <Icono size={16} stroke={1.8} />
                {cat.etiqueta}
              </button>
            );
          })}
        </div>
      </div>

      <div style={estilos.secciones}>
        {categoriaActiva === "pizzas" && (
          <section>
            <div style={estilos.gridProductos}>
              {catalogo.recetas.map((receta) => (
                <TarjetaProducto
                  key={receta.nombre}
                  icono={<IconPizza size={24} stroke={1.6} />}
                  titulo={formatearNombre(receta.nombre)}
                  descripcion={receta.toppings.map(formatearNombre).join(", ")}
                  precio={formatoMoneda(preciosRecetas[receta.nombre] ?? 0)}
                  imagen={receta.imagen}
                  accion={{ etiqueta: "Seleccionar", onClick: () => abrirPersonalizar(receta, "RECETA") }}
                />
              ))}

              <TarjetaProducto
                icono={<IconChefHat size={24} stroke={1.6} />}
                titulo="Arma tu pizza"
                descripcion="Elegí tamaño, masa y toppings a tu gusto"
                imagen="/imagenes/arma-tu-pizza.webp"
                precio={`Desde ${formatoMoneda(
                  desglosarPrecio(
                    { pantalla: "RESUMEN" as const, tipo: "GUSTO" as const, nombreReceta: null, tamano: "CHICA", masa: "DELGADA", toppings: [], extraQueso: false, nombreBebida: null, nombrePostre: null },
                    catalogo
                  ).total
                )}`}
                accion={{ etiqueta: "Armar", onClick: abrirArmaTuPizza }}
              />
            </div>
          </section>
        )}

        {categoriaActiva === "combos" && (
          <section>
            <div style={estilos.gridProductos}>
              {catalogo.recetas.map((receta) => {
                const precioBase = preciosRecetas[receta.nombre] ?? 0;
                return (
                  <TarjetaProducto
                    key={receta.nombre}
                    icono={<IconPaperBag size={24} stroke={1.6} />}
                    titulo={formatearNombre(receta.nombre)}
                    descripcion={`${receta.toppings.map(formatearNombre).join(", ")} + bebida + postre`}
                    precio={`Desde ${formatoMoneda(precioBase + precioComboMinimo)}`}
                    imagen={receta.imagen}
                    accion={{ etiqueta: "Armar combo", onClick: () => abrirPersonalizar(receta, "COMBO") }}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>

      <CarritoFlotante cantidad={items.length} total={total} onClick={() => setCartAbierto(true)} />
      <CarritoBottomSheet abierto={cartAbierto} onCerrar={() => setCartAbierto(false)} />
    </div>
  );
}

const estilos: Record<string, CSSProperties> = {
  pagina: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "0 16px 100px",
  },
  cabecera: {
    paddingTop: 28,
    paddingBottom: 20,
  },
  cabeceraContenido: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  tituloPagina: {
    margin: 0,
    fontFamily: "var(--fuente-display)",
    fontSize: 28,
    fontWeight: 700,
    color: "var(--carbon)",
  },
  subtituloPagina: {
    margin: "2px 0 0",
    fontSize: 13,
    color: "var(--texto-secundario)",
  },
  tabsWrapper: {
    overflowX: "auto",
    marginBottom: 20,
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none",
  },
  tabs: {
    display: "flex",
    gap: 8,
    paddingBottom: 4,
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    borderRadius: 100,
    border: "1.5px solid var(--borde)",
    background: "#ffffff",
    color: "var(--texto-secundario)",
    fontWeight: 600,
    fontSize: 13.5,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s",
  },
  tabActiva: {
    background: "var(--tomate)",
    borderColor: "var(--tomate)",
    color: "#ffffff",
  },
  secciones: {},
  gridProductos: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 14,
  },
  estadoContenedor: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    minHeight: "60vh",
    padding: "0 16px",
  },
  estadoTexto: {
    fontSize: 15,
    color: "var(--texto-secundario)",
  },
  estadoError: {
    fontSize: 14,
    color: "var(--error)",
    textAlign: "center",
  },
  botonReintentar: {
    padding: "10px 24px",
    borderRadius: 10,
    border: "none",
    background: "var(--tomate)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
};
