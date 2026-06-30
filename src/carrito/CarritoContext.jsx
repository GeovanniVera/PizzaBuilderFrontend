import React, { createContext, useContext, useState } from "react";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);

  function agregarItem(item) {
    setItems((prev) => [...prev, { ...item, idTemporal: crypto.randomUUID() }]);
  }

  function quitarItem(idTemporal) {
    setItems((prev) => prev.filter((item) => item.idTemporal !== idTemporal));
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const total = items.reduce((acc, item) => acc + (Number(item.precioEstimado) || 0), 0);

  function obtenerItemsParaBackend() {
    return items.map(({ idTemporal, precioEstimado, ...itemParaBackend }) => itemParaBackend);
  }

  const value = { items, agregarItem, quitarItem, vaciarCarrito, total, obtenerItemsParaBackend };

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  }
  return contexto;
}
