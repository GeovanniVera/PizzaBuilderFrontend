import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ItemCarrito, CarritoContextValue } from "../types/index.ts";

const CarritoContext = createContext<CarritoContextValue | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  function agregarItem(item: Omit<ItemCarrito, "idTemporal">) {
    setItems((prev) => [...prev, { ...item, idTemporal: crypto.randomUUID() }]);
  }

  function quitarItem(idTemporal: string) {
    setItems((prev) => prev.filter((item) => item.idTemporal !== idTemporal));
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const total = items.reduce((acc, item) => acc + (Number(item.precioEstimado) || 0), 0);

  function obtenerItemsParaBackend() {
    return items.map(({ idTemporal, precioEstimado, ...itemParaBackend }) => itemParaBackend);
  }

  const value: CarritoContextValue = { items, agregarItem, quitarItem, vaciarCarrito, total, obtenerItemsParaBackend };

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

export function useCarrito(): CarritoContextValue {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  }
  return contexto;
}
