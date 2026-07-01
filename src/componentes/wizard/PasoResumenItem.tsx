import { useMemo } from "react";
import { useCatalogo } from "../../contextos/CatalogoContext.tsx";
import VistaPreviaPizza from "../layout/VistaPreviaPizza.tsx";
import { desglosarPrecio, obtenerToppingsDeReceta } from "../../servicios/calcularPrecio.ts";
import { formatearNombre, formatoMoneda } from "../../utils/formatear.ts";
import { TIPO } from "../../utils/constantes.ts";
import type { Construccion } from "../../types/index.ts";

interface Props {
  construccion: Construccion;
  confirmarItem: (total: number) => void;
  reiniciar: () => void;
}

export default function PasoResumenItem({ construccion, confirmarItem, reiniciar }: Props) {
  const catalogo = useCatalogo();

  const toppingsReceta = useMemo(
    () => obtenerToppingsDeReceta(construccion.nombreReceta ?? "", catalogo.recetas),
    [construccion.nombreReceta, catalogo.recetas],
  );

  const {
    precioBasePizza, cargoTamano, cargoExtraQueso,
    precioToppings, precioBebida, precioPostre,
    total, nombresToppingsPizza,
  } = desglosarPrecio(construccion, catalogo);

  const esCombo = construccion.tipo === TIPO.COMBO;
  const gustoProps = construccion.tipo === TIPO.GUSTO;
  const toppingsList = gustoProps
    ? construccion.toppings
    : nombresToppingsPizza;

  return (
    <div className="resumen-layout">
      <div className="resumen-preview">
        <div style={estilos.previewCard}>
          <VistaPreviaPizza
            construccion={construccion}
            toppingsReceta={construccion.tipo !== TIPO.GUSTO ? toppingsReceta : undefined}
          />
        </div>
        <p style={estilos.tituloPizza}>
          {construccion.nombreReceta
            ? formatearNombre(construccion.nombreReceta)
            : "Pizza personalizada"}
        </p>
        <p style={estilos.subtituloPizza}>
          {formatearNombre(construccion.tamano ?? "")} · {formatearNombre(construccion.masa ?? "")}
        </p>
      </div>

      <div className="resumen-right">
        <div style={estilos.tarjeta}>
          <div style={estilos.seccionTitulo}>
            <span style={estilos.seccionLabel}>Detalle del pedido</span>
          </div>

          <Linea etiqueta="Tipo" valor={formatearTipo(construccion.tipo ?? "")} />

          {construccion.nombreReceta && (
            <Linea etiqueta="Receta" valor={formatearNombre(construccion.nombreReceta)} />
          )}

          <Linea etiqueta="Extra queso" valor={construccion.extraQueso ? "Sí" : "No"} />

          {toppingsList.length > 0 && (
            <Linea
              etiqueta={gustoProps ? "Toppings" : "Lleva"}
              valor={toppingsList.join(", ")}
            />
          )}

          {esCombo && construccion.nombreBebida && (
            <Linea etiqueta="Bebida" valor={formatearNombre(construccion.nombreBebida)} />
          )}
          {esCombo && construccion.nombrePostre && (
            <Linea etiqueta="Postre" valor={formatearNombre(construccion.nombrePostre)} />
          )}

          <div style={estilos.separador} />

          <LineaPrecio etiqueta="Pizza base" valor={precioBasePizza} />
          <LineaPrecio etiqueta={`Tamaño ${formatearNombre(construccion.tamano ?? "")}`} valor={cargoTamano} />
          {toppingsList.length > 0 && <LineaPrecio etiqueta="Toppings" valor={precioToppings} />}
          {cargoExtraQueso > 0 && <LineaPrecio etiqueta="Extra queso" valor={cargoExtraQueso} />}
          {esCombo && (
            <>
              <LineaPrecio etiqueta="Bebida" valor={precioBebida} />
              <LineaPrecio etiqueta="Postre" valor={precioPostre} />
            </>
          )}

          <div style={estilos.totalRow}>
            <span style={estilos.totalLabel}>Total</span>
            <span style={estilos.totalValor}>{formatoMoneda(total)}</span>
          </div>
        </div>

        <div style={estilos.acciones}>
          <button type="button" onClick={reiniciar} style={estilos.botonSecundario}>
            Cancelar
          </button>
          <button type="button" onClick={() => confirmarItem(total)} style={estilos.botonPrimario}>
            Agregar al pedido — {formatoMoneda(total)}
          </button>
        </div>
      </div>
    </div>
  );
}

function Linea({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div style={estilos.linea}>
      <span style={estilos.etiqueta}>{etiqueta}</span>
      <span style={estilos.valor}>{valor}</span>
    </div>
  );
}

function LineaPrecio({ etiqueta, valor }: { etiqueta: string; valor: number }) {
  if (valor <= 0) return null;
  return (
    <div style={estilos.linea}>
      <span style={estilos.etiquetaPrecio}>{etiqueta}</span>
      <span style={estilos.valorPrecio}>{formatoMoneda(valor)}</span>
    </div>
  );
}

function formatearTipo(tipo: string) {
  if (tipo === TIPO.GUSTO) return "Pizza al gusto";
  if (tipo === TIPO.RECETA) return "Pizza por receta";
  return "Combo";
}

const estilos = {
  previewCard: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 12,
  },
  tituloPizza: {
    fontFamily: "var(--fuente-display)",
    fontSize: 20,
    fontWeight: 700,
    color: "var(--terracota-oscuro)",
    textAlign: "center" as const,
    margin: "0 0 2px",
  },
  subtituloPizza: {
    fontSize: 14,
    color: "var(--texto-secundario)",
    textAlign: "center" as const,
    margin: "0 0 4px",
  },
  tarjeta: {
    background: "#ffffff",
    border: "1px solid var(--borde)",
    borderRadius: 14,
    padding: "16px 20px",
  },
  seccionTitulo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottom: "1px solid var(--borde)",
  },
  seccionLabel: {
    fontFamily: "var(--fuente-display)",
    fontSize: 14,
    fontWeight: 700,
    color: "var(--carbon)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  linea: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0",
    fontSize: 13.5,
    gap: 16,
  },
  etiqueta: {
    color: "var(--texto-secundario)",
    flexShrink: 0,
  },
  valor: {
    fontWeight: 600,
    color: "var(--carbon)",
    textAlign: "right" as const,
    flex: 1,
  },
  separador: {
    height: 1,
    background: "var(--borde)",
    margin: "12px 0",
  },
  etiquetaPrecio: {
    color: "var(--texto-secundario)",
    fontSize: 13,
  },
  valorPrecio: {
    fontFamily: "var(--fuente-mono)",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--carbon)",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTop: "2px solid var(--tomate)",
  },
  totalLabel: {
    fontFamily: "var(--fuente-display)",
    fontSize: 16,
    fontWeight: 700,
    color: "var(--terracota-oscuro)",
  },
  totalValor: {
    fontFamily: "var(--fuente-mono)",
    fontSize: 22,
    fontWeight: 700,
    color: "var(--tomate)",
  },
  acciones: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
    marginTop: 20,
  },
  botonSecundario: {
    width: "100%",
    padding: "14px 24px",
    borderRadius: 12,
    border: "1px solid var(--borde)",
    background: "#ffffff",
    color: "var(--texto-secundario)",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  botonPrimario: {
    width: "100%",
    padding: "16px 28px",
    borderRadius: 12,
    border: "none",
    background: "var(--tomate)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
  },
};