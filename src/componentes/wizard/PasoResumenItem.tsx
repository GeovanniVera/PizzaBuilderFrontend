import { useCatalogo } from "../../contextos/CatalogoContext.tsx";
import EncabezadoPaso from "../layout/EncabezadoPaso.tsx";
import { desglosarPrecio } from "../../servicios/calcularPrecio.ts";
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
  const {
    precioBasePizza, cargoTamano, cargoExtraQueso,
    precioToppings, precioBebida, precioPostre,
    total, nombresToppingsPizza,
  } = desglosarPrecio(construccion, catalogo);

  return (
    <div>
      <EncabezadoPaso titulo="Resumen" subtitulo="Revisa antes de agregar al pedido" />

      <div style={estilos.tarjeta}>
        <Linea etiqueta="Tipo" valor={formatearTipo(construccion.tipo ?? "")} />
        {construccion.nombreReceta && <Linea etiqueta="Receta" valor={formatearNombre(construccion.nombreReceta)} />}
        <Linea etiqueta="Tamaño" valor={formatearNombre(construccion.tamano ?? "")} />
        <Linea etiqueta="Masa" valor={formatearNombre(construccion.masa ?? "")} />
        {construccion.tipo === TIPO.GUSTO && (
          <Linea
            etiqueta="Toppings"
            valor={construccion.toppings.length > 0 ? construccion.toppings.join(", ") : "Sin toppings"}
          />
        )}
        {construccion.tipo !== TIPO.GUSTO && nombresToppingsPizza.length > 0 && (
          <Linea etiqueta="Lleva" valor={nombresToppingsPizza.join(", ")} />
        )}
        <Linea etiqueta="Extra queso" valor={construccion.extraQueso ? "Sí" : "No"} />
        {construccion.tipo === TIPO.COMBO && (
          <>
            <Linea etiqueta="Bebida" valor={construccion.nombreBebida ?? ""} />
            <Linea etiqueta="Postre" valor={construccion.nombrePostre ?? ""} />
          </>
        )}

        <div style={estilos.separador} />

        <LineaPrecio etiqueta="Precio base" valor={precioBasePizza} />
        <LineaPrecio etiqueta="Cargo por tamaño" valor={cargoTamano} />
        {nombresToppingsPizza.length > 0 && <LineaPrecio etiqueta="Toppings" valor={precioToppings} />}
        {cargoExtraQueso > 0 && <LineaPrecio etiqueta="Extra queso" valor={cargoExtraQueso} />}
        {construccion.tipo === TIPO.COMBO && (
          <>
            <LineaPrecio etiqueta="Bebida" valor={precioBebida} />
            <LineaPrecio etiqueta="Postre" valor={precioPostre} />
          </>
        )}

        <div style={estilos.totalRow}>
          <span style={estilos.totalLabel}>Total estimado</span>
          <span style={estilos.totalValor}>{formatoMoneda(total)}</span>
        </div>
      </div>

      <div style={estilos.acciones}>
        <button type="button" onClick={reiniciar} style={estilos.botonSecundario}>
          Cancelar
        </button>
        <button type="button" onClick={() => confirmarItem(total)} style={estilos.botonPrimario}>
          Agregar al pedido
        </button>
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
  tarjeta: {
    maxWidth: 480,
    background: "#ffffff",
    border: "1px solid var(--borde)",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  linea: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: 14,
  },
  etiqueta: {
    color: "var(--texto-secundario)",
  },
  valor: {
    fontWeight: 600,
    color: "var(--carbon)",
    textAlign: "right" as const,
    maxWidth: "60%",
  },
  separador: {
    height: 1,
    background: "var(--borde)",
    margin: "14px 0",
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
    marginTop: 14,
    paddingTop: 14,
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
    gap: 12,
  },
  botonSecundario: {
    padding: "12px 24px",
    borderRadius: 10,
    border: "1px solid var(--borde)",
    background: "#ffffff",
    color: "var(--carbon)",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  botonPrimario: {
    padding: "12px 28px",
    borderRadius: 10,
    border: "none",
    background: "var(--tomate)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
};