import React, { useState } from "react";

import { useCarrito } from "../carrito/CarritoContext.jsx";
import { useCatalogo } from "../catalogo/CatalogoContext.jsx";
import { calcularPrecioConstruccion } from "../wizard/calcularPrecioConstruccion.js.js";
import PasoTipoItem from "../wizard/PasoTipoItem.jsx";
import PasoReceta from "../wizard/PasoReceta.jsx";
import PasoTamano from "../wizard/PasoTamano.jsx";
import PasoMasa from "../wizard/PasoMasa.jsx";
import PasoToppings from "../wizard/PasoToppings.jsx";
import PasoExtraQueso from "../wizard/PasoExtraQueso.jsx";
import PasoBebida from "../wizard/PasoBebida.jsx";
import PasoPostre from "../wizard/PasoPostre.jsx";
import PasoResumenItem from "../wizard/PasoResumenItem.jsx";
import CarritoPanel from "../carrito/CarritoPanel.jsx";

function construccionVacia() {
  return {
    pantalla: "TIPO",
    tipo: null, // "GUSTO" | "RECETA" | "COMBO"
    nombreReceta: null,
    tamano: null,
    masa: null,
    toppings: [],
    extraQueso: false,
    nombreBebida: null,
    nombrePostre: null,
  };
}

export default function PaginaVender() {
  const { agregarItem } = useCarrito();
  const catalogo = useCatalogo();
  const [construccion, setConstruccion] = useState(construccionVacia());

  const totalEnConstruccion = calcularPrecioConstruccion(construccion, catalogo);
  const hayItemEnProgreso = construccion.pantalla !== "TIPO";

  function actualizar(cambios) {
    setConstruccion((prev) => ({ ...prev, ...cambios }));
  }

  function irA(pantalla) {
    actualizar({ pantalla });
  }

  function reiniciar() {
    setConstruccion(construccionVacia());
  }

  function confirmarItem(precioEstimado) {
    const { pantalla, ...itemParaCarrito } = construccion;

    const tipoBackend =
      construccion.tipo === "GUSTO" ? "PIZZA_GUSTO" : construccion.tipo === "RECETA" ? "PIZZA_RECETA" : "COMBO";

    agregarItem({
      tipo: tipoBackend,
      tamano: construccion.tamano,
      masa: construccion.masa,
      toppings: construccion.tipo === "GUSTO" ? construccion.toppings : undefined,
      nombreReceta: construccion.tipo !== "GUSTO" ? construccion.nombreReceta : undefined,
      extraQueso: construccion.extraQueso,
      nombreBebida: construccion.tipo === "COMBO" ? construccion.nombreBebida : undefined,
      nombrePostre: construccion.tipo === "COMBO" ? construccion.nombrePostre : undefined,
      precioEstimado,
    });

    reiniciar();
  }

  return (
    <div style={estilos.contenedor}>
      <CarritoPanel totalEnConstruccion={totalEnConstruccion} hayItemEnProgreso={hayItemEnProgreso} />

      <div style={estilos.panelWizard}>
        {construccion.pantalla === "TIPO" && <PasoTipoItem actualizar={actualizar} irA={irA} />}

        {construccion.pantalla === "RECETA" && (
          <PasoReceta construccion={construccion} actualizar={actualizar} irA={irA} />
        )}

        {construccion.pantalla === "TAMANO" && (
          <PasoTamano construccion={construccion} actualizar={actualizar} irA={irA} />
        )}

        {construccion.pantalla === "MASA" && (
          <PasoMasa construccion={construccion} actualizar={actualizar} irA={irA} />
        )}

        {construccion.pantalla === "TOPPINGS" && (
          <PasoToppings construccion={construccion} actualizar={actualizar} irA={irA} />
        )}

        {construccion.pantalla === "EXTRA_QUESO" && (
          <PasoExtraQueso construccion={construccion} actualizar={actualizar} irA={irA} />
        )}

        {construccion.pantalla === "BEBIDA" && (
          <PasoBebida construccion={construccion} actualizar={actualizar} irA={irA} />
        )}

        {construccion.pantalla === "POSTRE" && (
          <PasoPostre construccion={construccion} actualizar={actualizar} irA={irA} />
        )}

        {construccion.pantalla === "RESUMEN" && (
          <PasoResumenItem construccion={construccion} confirmarItem={confirmarItem} reiniciar={reiniciar} />
        )}
      </div>
    </div>
  );
}

const estilos = {
  contenedor: {
    display: "flex",
    minHeight: "calc(100vh - 65px)",
  },
  panelWizard: {
    flex: 1,
    padding: "40px 48px",
    background: "var(--masa)",
  },
};