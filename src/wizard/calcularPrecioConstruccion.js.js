export function obtenerToppingsDeReceta(nombreReceta, recetas) {
  const receta = recetas.find((r) => r.nombre === nombreReceta);
  return receta ? receta.toppings : [];
}

export function calcularPrecioConstruccion(construccion, catalogo) {
  const { toppings, bebidas, postres, recetas, configuracionPrecios } = catalogo;

  if (!configuracionPrecios || !construccion.tamano) {
    return 0;
  }

  const precioBasePizza = Number(configuracionPrecios.precioBasePizza || 0);
  const cargoTamano = Number(configuracionPrecios.cargosPorTamano[construccion.tamano] || 0);
  const cargoExtraQueso = construccion.extraQueso ? Number(configuracionPrecios.cargoExtraQueso) : 0;

  const nombresToppingsPizza =
    construccion.tipo === "GUSTO" ? construccion.toppings : obtenerToppingsDeReceta(construccion.nombreReceta, recetas);

  const precioToppings = nombresToppingsPizza.reduce((acc, nombreTopping) => {
    const topping = toppings.find((t) => t.nombre === nombreTopping);
    return acc + Number(topping?.precio || 0);
  }, 0);

  const subtotalPizza = precioBasePizza + cargoTamano + cargoExtraQueso + precioToppings;

  const bebidaSeleccionada = bebidas.find((b) => b.nombre === construccion.nombreBebida);
  const postreSeleccionado = postres.find((p) => p.nombre === construccion.nombrePostre);
  const precioBebida = construccion.tipo === "COMBO" ? Number(bebidaSeleccionada?.precio || 0) : 0;
  const precioPostre = construccion.tipo === "COMBO" ? Number(postreSeleccionado?.precio || 0) : 0;

  return subtotalPizza + precioBebida + precioPostre;
}