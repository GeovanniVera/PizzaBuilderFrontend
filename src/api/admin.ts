import { get, post, put, del } from "./cliente.ts";
import type { Bebida, Postre, Topping, Pedido, ConfiguracionPrecios } from "../types/index.ts";

export async function listarPedidos(desde: string, hasta: string) {
  const params = new URLSearchParams({ desde, hasta });
  return get<Pedido[]>(`/pedidos?${params}`);
}

export async function crearBebida(datos: { nombre: string; precio: number }) {
  return post<Bebida>("/bebidas", datos);
}

export async function eliminarBebida(nombre: string) {
  return del(`/bebidas/${encodeURIComponent(nombre)}`);
}

export async function crearPostre(datos: { nombre: string; precio: number }) {
  return post<Postre>("/postres", datos);
}

export async function eliminarPostre(nombre: string) {
  return del(`/postres/${encodeURIComponent(nombre)}`);
}

export async function crearTopping(datos: { nombre: string; precio: number }) {
  return post<Topping>("/toppings", datos);
}

export async function eliminarTopping(nombre: string) {
  return del(`/toppings/${encodeURIComponent(nombre)}`);
}

export async function actualizarConfiguracionPrecios(datos: ConfiguracionPrecios) {
  return put<ConfiguracionPrecios>("/configuracion-precios", datos);
}
