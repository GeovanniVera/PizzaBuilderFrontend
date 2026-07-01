export interface Topping {
  nombre: string;
  precio: number;
}

export interface Bebida {
  nombre: string;
  precio: number;
}

export interface Postre {
  nombre: string;
  precio: number;
}

export interface Receta {
  nombre: string;
  toppings: string[];
  imagen?: string;
}

export interface ConfiguracionPrecios {
  precioBasePizza: number;
  cargosPorTamano: Record<string, number>;
  cargoExtraQueso: number;
}

export interface CatalogoData {
  toppings: Topping[];
  bebidas: Bebida[];
  postres: Postre[];
  recetas: Receta[];
  configuracionPrecios: ConfiguracionPrecios | null;
}

export interface CatalogoContextValue extends CatalogoData {
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
}

export type TipoPizza = "GUSTO" | "RECETA" | "COMBO";
export type TipoBackend = "PIZZA_GUSTO" | "PIZZA_RECETA" | "COMBO";
export type Pantalla = "RECETA" | "TAMANO" | "MASA" | "TOPPINGS" | "EXTRA_QUESO" | "BEBIDA" | "POSTRE" | "RESUMEN";

export interface Construccion {
  pantalla: Pantalla;
  tipo: TipoPizza | null;
  nombreReceta: string | null;
  tamano: string | null;
  masa: string | null;
  toppings: string[];
  extraQueso: boolean;
  nombreBebida: string | null;
  nombrePostre: string | null;
}

export interface ItemCarrito {
  idTemporal: string;
  tipo: TipoBackend;
  tamano: string;
  masa: string;
  toppings?: string[];
  nombreReceta?: string;
  extraQueso: boolean;
  nombreBebida?: string;
  nombrePostre?: string;
  precioEstimado: number;
}

export interface CarritoContextValue {
  items: ItemCarrito[];
  agregarItem: (item: Omit<ItemCarrito, "idTemporal">) => void;
  quitarItem: (idTemporal: string) => void;
  vaciarCarrito: () => void;
  total: number;
  obtenerItemsParaBackend: () => Omit<ItemCarrito, "idTemporal" | "precioEstimado">[];
}

export interface ApiRespuesta<T> {
  datos: T;
  mensaje?: string;
  ok?: boolean;
}

export interface Ticket {
  id: string;
  totalCobrado: number;
}
