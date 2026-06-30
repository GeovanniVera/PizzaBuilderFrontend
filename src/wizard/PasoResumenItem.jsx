import React from "react";

import { useCatalogo } from "../catalogo/CatalogoContext.jsx";
import EncabezadoPaso from "./EncabezadoPaso.jsx";
import { calcularPrecioConstruccion, obtenerToppingsDeReceta } from "./calcularPrecioConstruccion.js";

function formatoMoneda(valor) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(valor) || 0);
}

export default function PasoResumenItem({ construccion, confirmarItem, reiniciar }) {
  const catalogo = useCatalogo();
  const { toppings, bebidas, postres, recetas, configuracionPrecios } = catalogo;

  const precioBasePizza = Number(configuracionPrecios.precioBasePizza || 0);
  const cargoTamano = Number(configuracionPrecios.cargosPorTamano[construccion.tamano] || 0);
  const cargoExtraQueso = construccion.extraQueso ? Number(configuracionPrecios.cargoExtraQueso) : 0;

  const nombresToppingsPizza =
    construccion.tipo === "GUSTO" ? construccion.toppings : obtenerToppingsDeReceta(construccion.nombreReceta, recetas);

  const precioToppings = nombresToppingsPizza.reduce((acc, nombreTopping) => {
    const topping = toppings.find((t) => t.nombre === nombreTopping);
    return acc + Number(topping?.precio || 0);
  }, 0);

  const bebidaSeleccionada = bebidas.find((b) => b.nombre === construccion.nombreBebida);
  const postreSeleccionado = postres.find((p) => p.nombre === construccion.nombrePostre);
  const precioBebida = construccion.tipo === "COMBO" ? Number(bebidaSeleccionada?.precio || 0) : 0;
  const precioPostre = construccion.tipo === "COMBO" ? Number(postreSeleccionado?.precio || 0) : 0;

  const total = calcularPrecioConstruccion(construccion, catalogo);

  return (
    <div>
      <EncabezadoPaso titulo="Resumen" subtitulo="Revisa antes de agregar al pedido" />

      <div style={estilos.tarjeta}>
        <Linea etiqueta="Tipo" valor={formatearTipo(construccion.tipo)} />
        {construccion.nombreReceta && <Linea etiqueta="Receta" valor={formatearNombre(construccion.nombreReceta)} />}
        <Linea etiqueta="Tamaño" valor={formatearNombre(construccion.tamano)} />
        <Linea etiqueta="Masa" valor={formatearNombre(construccion.masa)} />
        {construccion.tipo === "GUSTO" && (
          <Linea
            etiqueta="Toppings"
            valor={construccion.toppings.length > 0 ? construccion.toppings.join(", ") : "Sin toppings"}
          />
        )}
        {construccion.tipo !== "GUSTO" && nombresToppingsPizza.length > 0 && (
          <Linea etiqueta="Lleva" valor={nombresToppingsPizza.join(", ")} />
        )}
        <Linea etiqueta="Extra queso" valor={construccion.extraQueso ? "Sí" : "No"} />
        {construccion.tipo === "COMBO" && (
          <>
            <Linea etiqueta="Bebida" valor={construccion.nombreBebida} />
            <Linea etiqueta="Postre" valor={construccion.nombrePostre} />
          </>
        )}

        <div style={estilos.separador} />

        <LineaPrecio etiqueta="Precio base" valor={precioBasePizza} />
        <LineaPrecio etiqueta="Cargo por tamaño" valor={cargoTamano} />
        {nombresToppingsPizza.length > 0 && <LineaPrecio etiqueta="Toppings" valor={precioToppings} />}
        {cargoExtraQueso > 0 && <LineaPrecio etiqueta="Extra queso" valor={cargoExtraQueso} />}
        {construccion.tipo === "COMBO" && (
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

function Linea({ etiqueta, valor }) {
  return (
    <div style={estilos.linea}>
      <span style={estilos.etiqueta}>{etiqueta}</span>
      <span style={estilos.valor}>{valor}</span>
    </div>
  );
}

function LineaPrecio({ etiqueta, valor }) {
  return (
    <div style={estilos.linea}>
      <span style={estilos.etiquetaPrecio}>{etiqueta}</span>
      <span style={estilos.valorPrecio}>{formatoMoneda(valor)}</span>
    </div>
  );
}

function formatearNombre(nombre) {
  if (!nombre) return "";
  return nombre.charAt(0) + nombre.slice(1).toLowerCase();
}

function formatearTipo(tipo) {
  if (tipo === "GUSTO") return "Pizza al gusto";
  if (tipo === "RECETA") return "Pizza por receta";
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
    textAlign: "right",
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