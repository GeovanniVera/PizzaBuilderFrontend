import type { ApiRespuesta } from "../types/index.ts";

const BASE_URL = "http://localhost:8080/api";

async function peticion<T>(url: string, options: RequestInit = {}): Promise<ApiRespuesta<T>> {
  const respuesta = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const cuerpo: ApiRespuesta<T> = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(cuerpo.mensaje || "Error en la petición");
  }

  return cuerpo;
}

export function get<T>(url: string): Promise<ApiRespuesta<T>> {
  return peticion<T>(url);
}

export function post<T>(url: string, datos: unknown): Promise<ApiRespuesta<T>> {
  return peticion<T>(url, { method: "POST", body: JSON.stringify(datos) });
}

export function del<T = void>(url: string): Promise<ApiRespuesta<T>> {
  return peticion<T>(url, { method: "DELETE" });
}

export function put<T>(url: string, datos: unknown): Promise<ApiRespuesta<T>> {
  return peticion<T>(url, { method: "PUT", body: JSON.stringify(datos) });
}
