import React, { createContext, useContext, useEffect, useState } from "react";

const CatalogoContext = createContext(null);

const URL_BASE = "http://localhost:8080/api";

export function CatalogoProvider({ children }) {
  const [toppings, setToppings] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [postres, setPostres] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [configuracionPrecios, setConfiguracionPrecios] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarCatalogo();
  }, []);

  async function cargarCatalogo() {
    setCargando(true);
    setError(null);
    try {
      const [respToppings, respBebidas, respPostres, respRecetas, respConfigPrecios] = await Promise.all([
        fetch(`${URL_BASE}/toppings`),
        fetch(`${URL_BASE}/bebidas`),
        fetch(`${URL_BASE}/postres`),
        fetch(`${URL_BASE}/recetas`),
        fetch(`${URL_BASE}/configuracion-precios`),
      ]);

      if (!respToppings.ok || !respBebidas.ok || !respPostres.ok || !respRecetas.ok || !respConfigPrecios.ok) {
        throw new Error("No se pudo cargar el catálogo. Verifica que el servidor esté disponible.");
      }

      const [dataToppings, dataBebidas, dataPostres, dataRecetas, dataConfigPrecios] = await Promise.all([
        respToppings.json(),
        respBebidas.json(),
        respPostres.json(),
        respRecetas.json(),
        respConfigPrecios.json(),
      ]);

      setToppings(dataToppings.datos);
      setBebidas(dataBebidas.datos);
      setPostres(dataPostres.datos);
      setRecetas(dataRecetas.datos);
      setConfiguracionPrecios(dataConfigPrecios.datos);
    } catch (err) {
      setError(err.message || "Ocurrió un error al cargar el catálogo.");
    } finally {
      setCargando(false);
    }
  }

  const value = {
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

export function useCatalogo() {
  const contexto = useContext(CatalogoContext);
  if (!contexto) {
    throw new Error("useCatalogo debe usarse dentro de un CatalogoProvider");
  }
  return contexto;
}
