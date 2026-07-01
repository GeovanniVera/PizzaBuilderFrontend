import { get } from "./cliente.ts";
import type { Topping, Bebida, Postre, Receta, ConfiguracionPrecios } from "../types/index.ts";

export async function obtenerCatalogo() {
  const [toppings, bebidas, postres, recetas, configPrecios] = await Promise.all([
    get<Topping[]>("/toppings"),
    get<Bebida[]>("/bebidas"),
    get<Postre[]>("/postres"),
    get<Receta[]>("/recetas"),
    get<ConfiguracionPrecios>("/configuracion-precios"),
  ]);

  return {
    toppings: toppings.datos,
    bebidas: bebidas.datos,
    postres: postres.datos,
    recetas: recetas.datos,
    configuracionPrecios: configPrecios.datos,
  };
}
