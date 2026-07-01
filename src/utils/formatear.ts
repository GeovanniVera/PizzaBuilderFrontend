export function formatearNombre(nombre: string | null | undefined): string {
  if (!nombre) return "";
  return nombre.charAt(0) + nombre.slice(1).toLowerCase();
}

export function formatoMoneda(valor: string | number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(valor) || 0);
}
