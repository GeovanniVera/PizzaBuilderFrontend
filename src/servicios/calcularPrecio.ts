import { TIPO } from "../utils/constantes.ts";
import type { Construccion, Topping, Bebida, Postre, Receta, ConfiguracionPrecios } from "../types/index.ts";

interface CatalogoParaPrecio {
  toppings: Topping[];
  bebidas: Bebida[];
  postres: Postre[];
  recetas: Receta[];
  configuracionPrecios: ConfiguracionPrecios | null;
}

export function desglosarPrecio(construccion: Construccion, catalogo: CatalogoParaPrecio) {
  const { toppings, bebidas, postres, recetas, configuracionPrecios } = catalogo;

  if (!configuracionPrecios || !construccion.tamano) {
    return {
      precioBasePizza: 0,
      cargoTamano: 0,
      cargoExtraQueso: 0,
      precioToppings: 0,
      precioBebida: 0,
      precioPostre: 0,
      total: 0,
      nombresToppingsPizza: [],
    };
  }

  const precioBasePizza = Number(configuracionPrecios.precioBasePizza || 0);
  const cargoTamano = Number(configuracionPrecios.cargosPorTamano[construccion.tamano] || 0);
  const cargoExtraQueso = construccion.extraQueso ? Number(configuracionPrecios.cargoExtraQueso) : 0;

  const nombresToppingsPizza =
    construccion.tipo === TIPO.GUSTO ? construccion.toppings : obtenerToppingsDeReceta(construccion.nombreReceta ?? "", recetas);

  const precioToppings = nombresToppingsPizza.reduce((acc: number, nombreTopping: string) => {
    const topping = toppings.find((t) => t.nombre === nombreTopping);
    return acc + Number(topping?.precio || 0);
  }, 0);

  const bebidaSeleccionada = bebidas.find((b: Bebida) => b.nombre === construccion.nombreBebida);
  const postreSeleccionado = postres.find((p: Postre) => p.nombre === construccion.nombrePostre);
  const precioBebida = construccion.tipo === TIPO.COMBO ? Number(bebidaSeleccionada?.precio || 0) : 0;
  const precioPostre = construccion.tipo === TIPO.COMBO ? Number(postreSeleccionado?.precio || 0) : 0;

  const total = precioBasePizza + cargoTamano + cargoExtraQueso + precioToppings + precioBebida + precioPostre;

  return { precioBasePizza, cargoTamano, cargoExtraQueso, precioToppings, precioBebida, precioPostre, total, nombresToppingsPizza };
}

export function calcularPrecioConstruccion(construccion: Construccion, catalogo: CatalogoParaPrecio): number {
  return desglosarPrecio(construccion, catalogo).total;
}

export function obtenerToppingsDeReceta(nombreReceta: string, recetas: Receta[]): string[] {
  const receta = recetas.find((r: Receta) => r.nombre === nombreReceta);
  return receta ? receta.toppings : [];
}