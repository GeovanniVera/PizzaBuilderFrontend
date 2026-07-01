import { post } from "./cliente.ts";
import type { Ticket } from "../types/index.ts";

export async function confirmarPedido(items: unknown) {
  return post<Ticket>("/pedidos", { items });
}
