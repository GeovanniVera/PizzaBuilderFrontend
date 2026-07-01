import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { obtenerCatalogo } from "../api/catalogo.ts";
import type { Topping, Bebida, Postre, Receta, ConfiguracionPrecios, CatalogoContextValue } from "../types/index.ts";

const CatalogoContext = createContext<CatalogoContextValue | null>(null);

export function CatalogoProvider({ children }: { children: ReactNode }) {
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [bebidas, setBebidas] = useState<Bebida[]>([]);
  const [postres, setPostres] = useState<Postre[]>([]);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [configuracionPrecios, setConfiguracionPrecios] = useState<ConfiguracionPrecios | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarCatalogo();
  }, []);

  async function cargarCatalogo() {
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerCatalogo();
      setToppings(datos.toppings);
      setBebidas(datos.bebidas);
      setPostres(datos.postres);
      setRecetas(datos.recetas);
      setConfiguracionPrecios(datos.configuracionPrecios);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al cargar el catálogo.");
    } finally {
      setCargando(false);
    }
  }

  const value: CatalogoContextValue = {
    toppings,
    bebidas,
    postres,
    recetas,
    configuracionPrecios,
    cargando,
    error,
    recargar: cargarCatalogo,
  };

  return <CatalogoContext.Provider value={value}>{children}</CatalogoContext.Provider>;
}

export function useCatalogo(): CatalogoContextValue {
  const contexto = useContext(CatalogoContext);
  if (!contexto) {
    throw new Error("useCatalogo debe usarse dentro de un CatalogoProvider");
  }
  return contexto;
}
