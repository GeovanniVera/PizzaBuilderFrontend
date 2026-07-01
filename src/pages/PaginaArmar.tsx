import { useState, useMemo } from "react";
import type { CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconArrowLeft, IconPizza } from "@tabler/icons-react";

import { useCarrito } from "../contextos/CarritoContext.tsx";
import { useCatalogo } from "../contextos/CatalogoContext.tsx";
import { calcularPrecioConstruccion, desglosarPrecio, obtenerToppingsDeReceta } from "../servicios/calcularPrecio.ts";
import { PANTALLA, TIPO, TIPO_BACKEND } from "../utils/constantes.ts";
import { formatoMoneda } from "../utils/formatear.ts";
import type { Construccion, TipoPizza } from "../types/index.ts";
import PasoReceta from "../componentes/wizard/PasoReceta.tsx";
import PasoTamano from "../componentes/wizard/PasoTamano.tsx";
import PasoMasa from "../componentes/wizard/PasoMasa.tsx";
import PasoToppings from "../componentes/wizard/PasoToppings.tsx";
import PasoExtraQueso from "../componentes/wizard/PasoExtraQueso.tsx";
import PasoBebida from "../componentes/wizard/PasoBebida.tsx";
import PasoPostre from "../componentes/wizard/PasoPostre.tsx";
import PasoResumenItem from "../componentes/wizard/PasoResumenItem.tsx";
import VistaPreviaPizza from "../componentes/layout/VistaPreviaPizza.tsx";
import CarritoFlotante from "../componentes/CarritoFlotante.tsx";
import CarritoBottomSheet from "../componentes/CarritoBottomSheet.tsx";

interface EstadoNavegacion {
  receta?: string | null;
  tipo?: TipoPizza | null;
}

function estadoInicial(estado: EstadoNavegacion | null): Construccion {
  if (estado?.receta) {
    return {
      pantalla: PANTALLA.TAMANO,
      tipo: (estado.tipo ?? "RECETA") as TipoPizza,
      nombreReceta: estado.receta,
      tamano: null,
      masa: null,
      toppings: [],
      extraQueso: false,
      nombreBebida: null,
      nombrePostre: null,
    };
  }
  if (estado?.tipo) {
    return {
      pantalla: estado.tipo === "GUSTO" ? PANTALLA.TAMANO : PANTALLA.RECETA,
      tipo: estado.tipo as TipoPizza,
      nombreReceta: null,
      tamano: null,
      masa: null,
      toppings: [],
      extraQueso: false,
      nombreBebida: null,
      nombrePostre: null,
    };
  }
  return {
    pantalla: PANTALLA.TAMANO,
    tipo: "GUSTO",
    nombreReceta: null,
    tamano: null,
    masa: null,
    toppings: [],
    extraQueso: false,
    nombreBebida: null,
    nombrePostre: null,
  };
}

export default function PaginaArmar() {
  const navigate = useNavigate();
  const location = useLocation();
  const estado = location.state as EstadoNavegacion | null;
  const { agregarItem, items, total } = useCarrito();
  const catalogo = useCatalogo();
  const [construccion, setConstruccion] = useState(estadoInicial(estado));
  const [cartAbierto, setCartAbierto] = useState(false);

  const totalEnVivo = calcularPrecioConstruccion(construccion, catalogo);
  const desglose = desglosarPrecio(construccion, catalogo);
  const mostrarPrecio = construccion.pantalla !== PANTALLA.RESUMEN;

  const toppingsReceta = useMemo(
    () => obtenerToppingsDeReceta(construccion.nombreReceta ?? "", catalogo.recetas),
    [construccion.nombreReceta, catalogo.recetas],
  );

  function actualizar(cambios: Partial<Construccion>) {
    setConstruccion((prev) => ({ ...prev, ...cambios }));
  }

  function irA(pantalla: string) {
    actualizar({ pantalla: pantalla as Construccion["pantalla"] });
  }

  function reiniciar() {
    navigate("/");
  }

  function confirmarItem(precioEstimado: number) {
    const tipoBackend =
      construccion.tipo === TIPO.GUSTO ? TIPO_BACKEND.PIZZA_GUSTO
        : construccion.tipo === TIPO.RECETA ? TIPO_BACKEND.PIZZA_RECETA
        : TIPO_BACKEND.COMBO;

    agregarItem({
      tipo: tipoBackend,
      tamano: construccion.tamano ?? "",
      masa: construccion.masa ?? "",
      toppings: construccion.tipo === TIPO.GUSTO ? construccion.toppings : undefined,
      nombreReceta: construccion.tipo !== TIPO.GUSTO ? (construccion.nombreReceta ?? undefined) : undefined,
      extraQueso: construccion.extraQueso,
      nombreBebida: construccion.tipo === TIPO.COMBO ? (construccion.nombreBebida ?? undefined) : undefined,
      nombrePostre: construccion.tipo === TIPO.COMBO ? (construccion.nombrePostre ?? undefined) : undefined,
      precioEstimado,
    });

    navigate("/");
  }

  return (
    <div style={estilos.pagina}>
      <div style={estilos.barraSuperior}>
        <button type="button" onClick={() => navigate("/")} style={estilos.botonVolver}>
          <IconArrowLeft size={20} stroke={1.8} />
          Volver al menú
        </button>
        <div style={estilos.logoPequeño}>
          <IconPizza size={20} stroke={1.5} style={{ color: "var(--queso)" }} />
          <span style={estilos.logoTexto}>La Toscana</span>
        </div>
      </div>

      {mostrarPrecio && (
        <div style={estilos.barraPrecio}>
          {totalEnVivo > 0 ? (
            <>
              <div style={estilos.barraPrecioItems}>
                {desglose.precioBasePizza > 0 && <span style={estilos.barraItem}>Base: {formatoMoneda(desglose.precioBasePizza)}</span>}
                {desglose.cargoTamano > 0 && <span style={estilos.barraItem}>{construccion.tamano}: {formatoMoneda(desglose.cargoTamano)}</span>}
                {desglose.precioToppings > 0 && <span style={estilos.barraItem}>Toppings: {formatoMoneda(desglose.precioToppings)}</span>}
                {desglose.cargoExtraQueso > 0 && <span style={estilos.barraItem}>Extra queso: {formatoMoneda(desglose.cargoExtraQueso)}</span>}
                {desglose.precioBebida > 0 && <span style={estilos.barraItem}>Bebida: {formatoMoneda(desglose.precioBebida)}</span>}
                {desglose.precioPostre > 0 && <span style={estilos.barraItem}>Postre: {formatoMoneda(desglose.precioPostre)}</span>}
              </div>
              <span style={estilos.barraTotal}>{formatoMoneda(totalEnVivo)}</span>
            </>
          ) : (
            <span style={estilos.barraPlaceholder}>Elegí un tamaño para ver el precio</span>
          )}
        </div>
      )}

      <div className="wizard-layout" style={estilos.contenedorWizard}>
        <div style={estilos.wizardColumn}>
          {construccion.pantalla === PANTALLA.RECETA && (
            <PasoReceta construccion={construccion} actualizar={actualizar} irA={irA} />
          )}

          {construccion.pantalla === PANTALLA.TAMANO && (
            <PasoTamano construccion={construccion} actualizar={actualizar} irA={irA} onSalir={() => navigate("/")} />
          )}

          {construccion.pantalla === PANTALLA.MASA && (
            <PasoMasa construccion={construccion} actualizar={actualizar} irA={irA} />
          )}

          {construccion.pantalla === PANTALLA.TOPPINGS && (
            <PasoToppings construccion={construccion} actualizar={actualizar} irA={irA} />
          )}

          {construccion.pantalla === PANTALLA.EXTRA_QUESO && (
            <PasoExtraQueso construccion={construccion} actualizar={actualizar} irA={irA} />
          )}

          {construccion.pantalla === PANTALLA.BEBIDA && (
            <PasoBebida construccion={construccion} actualizar={actualizar} irA={irA} />
          )}

          {construccion.pantalla === PANTALLA.POSTRE && (
            <PasoPostre construccion={construccion} actualizar={actualizar} irA={irA} />
          )}

          {construccion.pantalla === PANTALLA.RESUMEN && (
            <PasoResumenItem construccion={construccion} confirmarItem={confirmarItem} reiniciar={reiniciar} />
          )}
        </div>

        {construccion.pantalla !== PANTALLA.RESUMEN && (
          <div className="preview-col" style={estilos.previewColumn}>
            <VistaPreviaPizza
              construccion={construccion}
              toppingsReceta={construccion.tipo !== TIPO.GUSTO ? toppingsReceta : undefined}
            />
          </div>
        )}
      </div>

      <CarritoFlotante cantidad={items.length} total={total} onClick={() => setCartAbierto(true)} />
      <CarritoBottomSheet abierto={cartAbierto} onCerrar={() => setCartAbierto(false)} />
    </div>
  );
}

const estilos: Record<string, CSSProperties> = {
  pagina: {
    minHeight: "100vh",
    background: "transparent",
    paddingBottom: 100,
  },
  barraSuperior: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 20px",
    background: "#ffffff",
    borderBottom: "1px solid var(--borde)",
  },
  botonVolver: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "none",
    background: "none",
    color: "var(--tomate)",
    fontWeight: 600,
    fontSize: 13.5,
    cursor: "pointer",
    padding: 0,
  },
  logoPequeño: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  logoTexto: {
    fontFamily: "var(--fuente-display)",
    fontSize: 15,
    fontWeight: 700,
    color: "var(--terracota)",
  },
  barraPrecio: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "10px 20px",
    background: "var(--terracota-oscuro)",
    color: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 50,
    overflowX: "auto",
    scrollbarWidth: "none",
  },
  barraPrecioItems: {
    display: "flex",
    gap: 14,
    fontSize: 12,
    fontWeight: 500,
    color: "rgba(255,255,255,0.7)",
    whiteSpace: "nowrap",
  },
  barraItem: {},
  barraTotal: {
    fontFamily: "var(--fuente-mono)",
    fontSize: 18,
    fontWeight: 700,
    color: "var(--queso)",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  barraPlaceholder: {
    fontSize: 13,
    fontWeight: 500,
    color: "rgba(255,255,255,0.5)",
    fontStyle: "italic",
  },
  contenedorWizard: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  wizardColumn: {
    flex: 1,
    minWidth: 0,
  },
  previewColumn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
};
