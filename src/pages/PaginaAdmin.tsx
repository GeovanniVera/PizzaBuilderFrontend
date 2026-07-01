import { useState, useEffect, useMemo } from "react";
import { pdf } from "@react-pdf/renderer";
import { useCatalogo } from "../contextos/CatalogoContext.tsx";
import { formatoMoneda, formatearNombre } from "../utils/formatear.ts";
import {
  listarPedidos, crearBebida, eliminarBebida,
  crearPostre, eliminarPostre,
  crearTopping, eliminarTopping,
  actualizarConfiguracionPrecios,
} from "../api/admin.ts";
import { TicketPDF } from "../componentes/admin/TicketPDF.tsx";
import type { Pedido, ConfiguracionPrecios } from "../types/index.ts";

type Seccion = "bebidas" | "postres" | "toppings" | "pedidos" | "config";

const TABS: { key: Seccion; label: string; icon: string }[] = [
  { key: "pedidos",  label: "Pedidos",  icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { key: "bebidas",  label: "Bebidas",  icon: "M15.75 17.5L12 21m0 0l-3.75-3.5M12 21V3" },
  { key: "postres",  label: "Postres",  icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" },
  { key: "toppings", label: "Toppings", icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { key: "config",   label: "Precios",  icon: "M12 15V3m0 12l-3.75-3.75M12 15l3.75-3.75M3 21h18" },
];

export default function PaginaAdmin() {
  const catalogo = useCatalogo();
  const [seccion, setSeccion] = useState<Seccion>("pedidos");

  return (
    <div className="ar">
      <header className="ar-h">
        <div className="ar-h-inner">
          <div className="ar-brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8 2 4 5 4 9c0 3 2 5.5 4 7l2 5h4l2-5c2-1.5 4-4 4-7 0-4-4-7-8-7z"/>
              <circle cx="12" cy="8" r="1.5" fill="#DC2626" stroke="none"/>
            </svg>
            <div>
              <span className="ar-brand-name">La Toscana</span>
              <span className="ar-brand-role">Administración</span>
            </div>
          </div>
          <nav className="ar-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`ar-tab${seccion === t.key ? " active" : ""}`}
                onClick={() => setSeccion(t.key)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon}/></svg>
                {t.label}
              </button>
            ))}
          </nav>
          <a href="/" className="ar-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Menú
          </a>
        </div>
      </header>

      <main className="ar-b">
        {seccion === "pedidos" && <SeccionPedidos />}
        {seccion === "bebidas" && (
          <CatalogoCrud key="bebidas" titulo="Bebidas" icon="M15.75 17.5L12 21m0 0l-3.75-3.5M12 21V3"
            items={catalogo.bebidas.map((b) => ({ id: b.nombre, nombre: b.nombre, precio: b.precio }))}
            onCreate={(n, p) => crearBebida({ nombre: n, precio: p })}
            onDelete={(n) => eliminarBebida(n)}
            onCambio={catalogo.recargar}
          />
        )}
        {seccion === "postres" && (
          <CatalogoCrud key="postres" titulo="Postres" icon="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
            items={catalogo.postres.map((p) => ({ id: p.nombre, nombre: p.nombre, precio: p.precio }))}
            onCreate={(n, p) => crearPostre({ nombre: n, precio: p })}
            onDelete={(n) => eliminarPostre(n)}
            onCambio={catalogo.recargar}
          />
        )}
        {seccion === "toppings" && (
          <CatalogoCrud key="toppings" titulo="Toppings" icon="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            items={catalogo.toppings.map((t) => ({ id: t.nombre, nombre: t.nombre, precio: t.precio }))}
            onCreate={(n, p) => crearTopping({ nombre: n, precio: p })}
            onDelete={(n) => eliminarTopping(n)}
            onCambio={catalogo.recargar}
          />
        )}
        {seccion === "config" && (
          <SeccionConfigAdmin
            config={catalogo.configuracionPrecios}
            recetas={catalogo.recetas}
            cargando={catalogo.cargando}
            onGuardado={catalogo.recargar}
          />
        )}
      </main>

      <style>{S}</style>
    </div>
  );
}

/* ---------- icon helper ---------- */
function Icon({ path, size = 16 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path}/>
    </svg>
  );
}

/* ---------- catálogo CRUD ---------- */
interface CrudItem { id: string; nombre: string; precio: number }
interface CrudProps {
  titulo: string; icon: string; items: CrudItem[];
  onCreate: (nombre: string, precio: number) => Promise<unknown>;
  onDelete: (nombre: string) => Promise<unknown>;
  onCambio: () => Promise<void>;
}

function CatalogoCrud({ titulo, icon, items, onCreate, onDelete, onCambio }: CrudProps) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => items.filter((i) => i.nombre.toLowerCase().includes(search.toLowerCase())),
    [items, search],
  );

  async function crear() {
    if (!nombre.trim()) return setError("Nombre requerido");
    const p = Number(precio);
    if (isNaN(p) || p <= 0) return setError("Precio inválido");
    setLoading(true); setError("");
    try {
      await onCreate(nombre.trim(), p);
      setNombre(""); setPrecio("");
      await onCambio();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally { setLoading(false); }
  }

  async function eliminar(id: string) {
    if (!confirm(`¿Eliminar "${id}"?`)) return;
    try {
      await onDelete(id);
      await onCambio();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <div className="ac">
      <div className="ac-h">
        <div className="ac-h-l">
          <Icon path={icon} size={18} />
          <h2 className="ac-t">{titulo}</h2>
          <span className="ac-b">{items.length}</span>
        </div>
        <div className="ac-srch">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C7A2A2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="ac-inp" placeholder="Filtrar…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ac-frm">
        <input className="ac-inp" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input className="ac-inp ac-inp--p" type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        <button className="ab ab--p" onClick={crear} disabled={loading}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          {loading ? "…" : "Agregar"}
        </button>
      </div>
      {error && <p className="ae">{error}</p>}

      {items.length > 0 && (
        <div className="ac-tbl">
          <div className="ac-tbl-h">
            <span className="ac-tbl-hc ac-tbl-hc--n">Nombre</span>
            <span className="ac-tbl-hc ac-tbl-hc--p">Precio</span>
            <span className="ac-tbl-hc ac-tbl-hc--a"></span>
          </div>
          {filtered.length === 0 ? (
            <p className="ae ae--empty">Sin resultados para "{search}"</p>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="ac-tr">
                <span className="ac-td ac-td--n">{formatearNombre(item.nombre)}</span>
                <span className="ac-td ac-td--p">{formatoMoneda(item.precio)}</span>
                <span className="ac-td ac-td--a">
                  <button className="ac-del" onClick={() => eliminar(item.id)} aria-label="Eliminar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      )}
      {items.length === 0 && <p className="ae ae--empty">Sin {titulo.toLowerCase()} registrados</p>}
    </div>
  );
}

/* ---------- pedidos ---------- */
const PAGE_SIZE = 10;

function SeccionPedidos() {
  const hoy = new Date();
  const ayer = new Date(hoy.getTime() - 86400000);
  const fmt = (d: Date) => d.toISOString().slice(0, 16);

  const [desde, setDesde] = useState(fmt(ayer));
  const [hasta, setHasta] = useState(fmt(hoy));
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagina, setPagina] = useState(0);
  const [detalleId, setDetalleId] = useState<string | null>(null);
  const [searchPedido, setSearchPedido] = useState("");

  async function buscar() {
    setLoading(true); setError(""); setPagina(0); setDetalleId(null);
    try {
      const r = await listarPedidos(desde, hasta);
      setPedidos(r.datos ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally { setLoading(false); }
  }

  const filtered = useMemo(() => {
    if (!searchPedido.trim()) return pedidos;
    const q = searchPedido.toLowerCase();
    return pedidos.filter((p) =>
      (p.id ?? "").toLowerCase().includes(q) ||
      new Date(p.fechaConfirmacion).toLocaleDateString("es-MX").includes(q) ||
      p.items.some((i) => i.tamano.toLowerCase().includes(q) || i.masa.toLowerCase().includes(q))
    );
  }, [pedidos, searchPedido]);

  const totalPag = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(pagina * PAGE_SIZE, (pagina + 1) * PAGE_SIZE);
  const selected = detalleId ? pedidos.find((p) => p.id === detalleId) : null;

  if (selected) return <DetallePedido pedido={selected} onBack={() => setDetalleId(null)} />;

  const totalIngresos = filtered.reduce((s, p) => s + p.totalCobrado, 0);
  const totalArticulos = filtered.reduce((s, p) => s + p.items.length, 0);

  return (
    <div className="ac">
      <div className="ac-h">
        <div className="ac-h-l">
          <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" size={18} />
          <h2 className="ac-t">Pedidos</h2>
        </div>
        <div className="ac-srch">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C7A2A2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="ac-inp" placeholder="Buscar pedido…" value={searchPedido} onChange={(e) => { setSearchPedido(e.target.value); setPagina(0); }} />
        </div>
      </div>

      <div className="am">
        <div className="am-c">
          <span className="am-v">{filtered.length}</span>
          <span className="am-l">Pedidos</span>
        </div>
        <div className="am-c">
          <span className="am-v am-v--accent">{formatoMoneda(totalIngresos)}</span>
          <span className="am-l">Ingresos</span>
        </div>
        <div className="am-c">
          <span className="am-v">{totalArticulos}</span>
          <span className="am-l">Artículos</span>
        </div>
      </div>

      <div className="ac-frm">
        <label className="ac-fl">
          Desde
          <input className="ac-inp" type="datetime-local" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </label>
        <label className="ac-fl">
          Hasta
          <input className="ac-inp" type="datetime-local" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </label>
        <button className="ab" onClick={buscar} disabled={loading}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          {loading ? "Buscando…" : "Buscar"}
        </button>
        {pedidos.length > 0 && (
          <span className="ac-fl-h">{pedidos.length} pedidos encontrados</span>
        )}
      </div>

      {error && <p className="ae">{error}</p>}

      {!loading && filtered.length > 0 && (
        <div className="ac-tbl">
          <div className="ac-tbl-h">
            <span className="ac-tbl-hc ac-tbl-hc--id">Folio</span>
            <span className="ac-tbl-hc ac-tbl-hc--dt">Fecha</span>
            <span className="ac-tbl-hc ac-tbl-hc--q">Artículos</span>
            <span className="ac-tbl-hc ac-tbl-hc--t">Total</span>
          </div>
          {paginated.map((p) => (
            <div key={p.id} className="ac-tr ac-tr--click" onClick={() => setDetalleId(p.id)}>
              <span className="ac-td ac-td--id">#{(p.id ?? "").slice(0, 8)}</span>
              <span className="ac-td ac-td--dt">{new Date(p.fechaConfirmacion).toLocaleDateString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              <span className="ac-td ac-td--q">{p.items.length}</span>
              <span className="ac-td ac-td--t">{formatoMoneda(p.totalCobrado)}</span>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && !searchPedido && <p className="ae ae--empty">Sin pedidos en el período seleccionado</p>}
      {!loading && filtered.length === 0 && searchPedido && <p className="ae ae--empty">Sin resultados para "{searchPedido}"</p>}
      {loading && <p className="ae ae--empty">Cargando…</p>}

      {totalPag > 1 && (
        <div className="ap">
          <button className="ab ab--sm" disabled={pagina === 0} onClick={() => setPagina(pagina - 1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Anterior
          </button>
          <span className="ap-i">{pagina + 1} / {totalPag}</span>
          <button className="ab ab--sm" disabled={pagina >= totalPag - 1} onClick={() => setPagina(pagina + 1)}>
            Siguiente
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- detalle pedido ---------- */
function DetallePedido({ pedido, onBack }: { pedido: Pedido; onBack: () => void }) {
  const [abiertos, setAbiertos] = useState<Record<number, boolean>>({});
  const [imprimiendo, setImprimiendo] = useState(false);

  async function imprimir() {
    setImprimiendo(true);
    try {
      const doc = <TicketPDF pedido={pedido} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } finally {
      setImprimiendo(false);
    }
  }

  return (
    <div className="ac">
      <div className="ad-top">
        <button className="ab ab--sm" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Volver
        </button>
        <div className="ad-info">
          <h2 className="ad-t">Pedido #{(pedido.id ?? "").slice(0, 8)}</h2>
          <p className="ad-d">{new Date(pedido.fechaConfirmacion).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <span className="ad-total">{formatoMoneda(pedido.totalCobrado)}</span>
      </div>

      <div className="ad-items">
        {pedido.items.map((item, i) => {
          const esCombo = !!(item.nombreBebida || item.nombrePostre);
          const abierto = !!abiertos[i];
          return (
            <div key={i} className="ad-itm">
              <button className="ad-itm-h" onClick={() => setAbiertos((prev) => ({ ...prev, [i]: !prev[i] }))}>
                <div className="ad-itm-l">
                  <span className="ad-itm-idx">{i + 1}</span>
                  <span className={`abg ${esCombo ? "abg--c" : "abg--p"}`}>{esCombo ? "COMBO" : "PIZZA"}</span>
                  <span className="ad-itm-sm">{formatearNombre(item.tamano)} · {formatearNombre(item.masa)}</span>
                </div>
                <div className="ad-itm-r">
                  <span className="ad-itm-pr">{formatoMoneda(item.precio)}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C7A2A2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`ad-ch${abierto ? " open" : ""}`}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </button>
              {abierto && (
                <div className="ad-itm-b">
                  <div className="ad-gr">
                    <span className="ad-gl">Tamaño</span>
                    <span className="ad-gv">{formatearNombre(item.tamano)}</span>
                    <span className="ad-gl">Masa</span>
                    <span className="ad-gv">{formatearNombre(item.masa)}</span>
                    <span className="ad-gl">Extra queso</span>
                    <span className="ad-gv">{item.extraQueso ? "Sí" : "No"}</span>
                    {esCombo && item.nombreBebida && (
                      <><span className="ad-gl">Bebida</span><span className="ad-gv">{item.nombreBebida}</span></>
                    )}
                    {esCombo && item.nombrePostre && (
                      <><span className="ad-gl">Postre</span><span className="ad-gv">{item.nombrePostre}</span></>
                    )}
                  </div>
                  {item.toppings.length > 0 && (
                    <div className="ad-tops">
                      <span className="ad-gl">Toppings</span>
                      <div className="ad-tags">
                        {item.toppings.map((t) => <span key={t} className="atg">{t}</span>)}
                      </div>
                    </div>
                  )}
                  <div className="ad-ft">
                    <span>Total ítem</span>
                    <strong>{formatoMoneda(item.precio)}</strong>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="ad-print">
        <button className="ab ab--o" onClick={imprimir} disabled={imprimiendo}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
          {imprimiendo ? "Generando…" : "Imprimir ticket"}
        </button>
      </div>
    </div>
  );
}

/* ---------- configuración ---------- */
function SeccionConfigAdmin({ config, recetas, cargando, onGuardado }: {
  config: ConfiguracionPrecios | null;
  recetas: { nombre: string; toppings: string[] }[];
  cargando: boolean;
  onGuardado: () => Promise<void>;
}) {
  const [form, setForm] = useState<ConfiguracionPrecios | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (config) setForm({ ...config, cargosPorTamano: { ...config.cargosPorTamano } });
  }, [config]);

  if (!form) return (
    <div className="ac"><div className="ac-h"><h2 className="ac-t">Configuración de precios</h2></div><p className="ae ae--empty">{cargando ? "Cargando…" : "Sin datos"}</p></div>
  );

  async function guardar() {
    setGuardando(true); setError("");
    try {
      await actualizarConfiguracionPrecios(form!);
      await onGuardado();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally { setGuardando(false); }
  }

  return (
    <>
      <div className="ac">
        <div className="ac-h">
          <div className="ac-h-l">
            <Icon path="M12 15V3m0 12l-3.75-3.75M12 15l3.75-3.75M3 21h18" size={18} />
            <h2 className="ac-t">Configuración de precios</h2>
          </div>
        </div>
        <div className="acg">
          <label className="ac-fl">
            Precio base pizza
            <input className="ac-inp" type="number" value={form.precioBasePizza} onChange={(e) => setForm({ ...form, precioBasePizza: Number(e.target.value) })} />
          </label>
          <label className="ac-fl">
            Extra queso
            <input className="ac-inp" type="number" value={form.cargoExtraQueso} onChange={(e) => setForm({ ...form, cargoExtraQueso: Number(e.target.value) })} />
          </label>
        </div>
        {error && <p className="ae">{error}</p>}
        <button className="ab ab--p" onClick={guardar} disabled={guardando}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>

      <div className="ac">
        <div className="ac-h">
          <div className="ac-h-l">
            <Icon path="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" size={18} />
            <h3 className="ac-t">Cargos por tamaño</h3>
          </div>
        </div>
        <div className="acg acg--3">
          {Object.entries(form.cargosPorTamano).map(([tamano, cargo]) => (
            <label key={tamano} className="ac-fl">
              {formatearNombre(tamano)}
              <input className="ac-inp" type="number" value={cargo} onChange={(e) => setForm({ ...form, cargosPorTamano: { ...form.cargosPorTamano, [tamano]: Number(e.target.value) } })} />
            </label>
          ))}
        </div>
      </div>

      <div className="ac">
        <div className="ac-h">
          <div className="ac-h-l">
            <Icon path="M4 19.5A2.5 2.5 0 016.5 17H20" size={18} />
            <h3 className="ac-t">Recetas</h3>
            <span className="ac-b">{recetas.length}</span>
          </div>
        </div>
        {recetas.length === 0 ? <p className="ae ae--empty">Sin recetas registradas</p> : (
          <div className="ac-tbl">
            <div className="ac-tbl-h">
              <span className="ac-tbl-hc ac-tbl-hc--rn">Receta</span>
              <span className="ac-tbl-hc ac-tbl-hc--rt">Toppings</span>
            </div>
            {recetas.map((r) => (
              <div key={r.nombre} className="ac-tr">
                <span className="ac-td ac-td--rn">{r.nombre}</span>
                <span className="ac-td ac-td--rt">{r.toppings.join(", ")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ===== ESTILOS ADMIN ===== */
const S = `
.ar { min-height: 100vh; font-family: 'Karla', system-ui, sans-serif; color: #450A0A; padding-bottom: 48px; }

/* header */
.ar-h { background: #FFFAFA; border-bottom: 1px solid #E8D0C8; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 4px rgba(153,27,27,0.06); }
.ar-h-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; height: 64px; gap: 32px; }
.ar-brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.ar-brand-name { font-family: 'Playfair Display SC', Georgia, serif; font-size: 16px; font-weight: 700; color: #7f1d1d; display: block; line-height: 1.1; }
.ar-brand-role { font-size: 10px; color: #A16207; display: block; font-weight: 500; letter-spacing: 0.03em; }

/* tabs */
.ar-tabs { display: flex; gap: 2px; flex: 1; overflow-x: auto; }
.ar-tab { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: none; border-radius: 8px; background: transparent; color: #734a4a; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 150ms ease; white-space: nowrap; }
.ar-tab:hover { background: #FEF0EC; color: #7f1d1d; }
.ar-tab.active { background: #991b1b; color: #FFF; font-weight: 600; box-shadow: 0 1px 3px rgba(153,27,27,0.3); }
.ar-tab.active svg { stroke: #FFF; }
.ar-back { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #734a4a; text-decoration: none; flex-shrink: 0; transition: color 150ms; }
.ar-back:hover { color: #991b1b; }

/* body */
.ar-b { max-width: 800px; margin: 24px auto; padding: 0 24px; }

/* card */
.ac { background: #FFFAFA; border: 1px solid #E8D0C8; border-radius: 12px; padding: 20px 24px; box-shadow: 0 2px 6px rgba(153,27,27,0.04), 0 1px 2px rgba(153,27,27,0.03); }
.ac + .ac { margin-top: 16px; }
.ac-h { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; gap: 12px; }
.ac-h-l { display: flex; align-items: center; gap: 8px; color: #450A0A; }
.ac-t { font-family: 'Playfair Display SC', Georgia, serif; font-size: 15px; font-weight: 700; color: #450A0A; margin: 0; }
.ac-b { display: inline-flex; align-items: center; justify-content: center; min-width: 22px; height: 22px; padding: 0 7px; background: #FEF0EC; border-radius: 11px; font-size: 11px; font-weight: 600; color: #A16207; }

/* search */
.ac-srch { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.ac-srch .ac-inp { width: 160px; font-size: 12px; padding: 5px 10px; background: #FFF5F0; }

/* form */
.ac-frm { display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-end; margin-bottom: 14px; }
.ac-fl { display: flex; flex-direction: column; gap: 3px; font-size: 11px; font-weight: 500; color: #734a4a; }
.ac-fl-h { font-size: 11px; color: #C7A2A2; align-self: center; margin-left: auto; }
.ac-inp { padding: 7px 11px; background: #FFF5F0; border: 1px solid #E8D0C8; border-radius: 8px; color: #450A0A; font-size: 13px; font-family: inherit; outline: none; transition: border-color 150ms, box-shadow 150ms; }
.ac-inp:focus { border-color: #991b1b; box-shadow: 0 0 0 3px rgba(153,27,27,0.08); }
.ac-inp--p { max-width: 100px; }
.ac-inp::placeholder { color: #D4B8B0; }

/* buttons */
.ab { display: inline-flex; align-items: center; gap: 5px; padding: 7px 16px; border: none; border-radius: 8px; background: #991b1b; color: #FFF; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 150ms ease; white-space: nowrap; box-shadow: 0 1px 3px rgba(153,27,27,0.2); }
.ab:hover:not(:disabled) { background: #7f1d1d; box-shadow: 0 2px 6px rgba(153,27,27,0.3); }
.ab:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
.ab--sm { padding: 5px 12px; font-size: 11px; }
.ab--p { background: #DC2626; box-shadow: 0 1px 3px rgba(220,38,38,0.25); }
.ab--p:hover:not(:disabled) { background: #b91c1c; }
.ab--o { background: transparent; border: 1px solid #991b1b; color: #991b1b; box-shadow: none; }
.ab--o:hover { background: #FEF0EC; box-shadow: none; }

/* error / empty */
.ae { color: #DC2626; font-size: 12px; margin: 0 0 10px; }
.ae--empty { color: #C7A2A2; text-align: center; padding: 32px 0; margin: 0; }

/* metrics */
.am { display: flex; gap: 12px; margin-bottom: 18px; }
.am-c { flex: 1; background: linear-gradient(135deg, #FEF0EC 0%, #FFFAFA 100%); border: 1px solid #E8D0C8; border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 2px; }
.am-v { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; color: #450A0A; }
.am-v--accent { color: #991b1b; }
.am-l { font-size: 10px; font-weight: 600; color: #A16207; text-transform: uppercase; letter-spacing: 0.06em; }

/* table */
.ac-tbl { border: 1px solid #E8D0C8; border-radius: 10px; overflow: hidden; margin-bottom: 4px; }
.ac-tbl-h { display: flex; align-items: center; padding: 8px 14px; background: #FEF0EC; border-bottom: 1px solid #E8D0C8; gap: 12px; }
.ac-tbl-hc { font-size: 10px; font-weight: 700; color: #A16207; text-transform: uppercase; letter-spacing: 0.05em; }
.ac-tbl-hc--n { flex: 1; }
.ac-tbl-hc--p { width: 100px; text-align: right; }
.ac-tbl-hc--a { width: 36px; }
.ac-tbl-hc--id { width: 90px; }
.ac-tbl-hc--dt { flex: 1; }
.ac-tbl-hc--q { width: 60px; text-align: center; }
.ac-tbl-hc--t { width: 100px; text-align: right; }
.ac-tbl-hc--rn { flex: 1; }
.ac-tbl-hc--rt { flex: 1; }

.ac-tr { display: flex; align-items: center; padding: 10px 14px; border-bottom: 1px solid #F0E0D8; gap: 12px; transition: background 150ms; }
.ac-tr:last-child { border-bottom: none; }
.ac-tr:hover { background: #FFF5F0; }
.ac-tr--click { cursor: pointer; }

.ac-td { font-size: 13px; color: #450A0A; }
.ac-td--n { flex: 1; font-weight: 500; }
.ac-td--p { width: 100px; text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #991b1b; font-size: 12px; }
.ac-td--a { width: 36px; text-align: center; }
.ac-td--id { width: 90px; font-weight: 600; font-size: 12px; }
.ac-td--dt { flex: 1; font-size: 12px; color: #734a4a; }
.ac-td--q { width: 60px; text-align: center; font-size: 12px; color: #734a4a; }
.ac-td--t { width: 100px; text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #991b1b; }
.ac-td--rn { flex: 1; font-weight: 500; }
.ac-td--rt { flex: 1; font-size: 12px; color: #734a4a; }

.ac-del { border: none; background: transparent; color: #C7A2A2; cursor: pointer; padding: 4px; border-radius: 4px; transition: all 150ms; display: inline-flex; }
.ac-del:hover { color: #DC2626; background: #FEF0EC; }

/* pagination */
.ap { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 16px; padding-top: 14px; border-top: 1px solid #E8D0C8; }
.ap-i { font-size: 12px; color: #734a4a; }

/* config grid */
.acg { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.acg--3 { grid-template-columns: 1fr 1fr 1fr; }

/* detail */
.ad-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
.ad-info { flex: 1; }
.ad-t { font-family: 'Playfair Display SC', Georgia, serif; font-size: 18px; font-weight: 700; color: #450A0A; margin: 0; }
.ad-d { font-size: 11px; color: #734a4a; margin: 3px 0 0; text-transform: capitalize; }
.ad-total { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; color: #991b1b; white-space: nowrap; }

/* detail items */
.ad-items { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.ad-itm { border: 1px solid #E8D0C8; border-radius: 10px; overflow: hidden; }
.ad-itm-h { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 12px 14px; border: none; background: #FFFAFA; color: #450A0A; cursor: pointer; transition: background 150ms; font-family: inherit; font-size: 13px; }
.ad-itm-h:hover { background: #FEF0EC; }
.ad-itm-l, .ad-itm-r { display: flex; align-items: center; gap: 8px; }
.ad-itm-idx { font-weight: 600; color: #C7A2A2; font-size: 11px; }
.abg { display: inline-flex; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
.abg--p { background: #FEF0EC; color: #991b1b; }
.abg--c { background: #FEF7E6; color: #A16207; }
.ad-itm-sm { color: #734a4a; font-size: 12px; }
.ad-itm-pr { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: #991b1b; }
.ad-ch { transition: transform 200ms; }
.ad-ch.open { transform: rotate(180deg); }

.ad-itm-b { padding: 0 14px 12px; border-top: 1px solid #E8D0C8; background: #FFF5F0; }
.ad-gr { display: grid; grid-template-columns: auto 1fr; gap: 5px 16px; padding-top: 10px; }
.ad-gl { font-size: 11px; color: #A16207; font-weight: 600; }
.ad-gv { font-size: 12px; color: #450A0A; }
.ad-tops { padding-top: 10px; }
.ad-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
.atg { display: inline-flex; padding: 3px 10px; background: #FFFAFA; border: 1px solid #E8D0C8; border-radius: 12px; font-size: 11px; color: #734a4a; }
.ad-ft { display: flex; align-items: center; justify-content: space-between; padding: 10px 0 0; margin-top: 10px; border-top: 1px solid #E8D0C8; font-size: 12px; color: #734a4a; }
.ad-ft strong { color: #991b1b; font-family: 'JetBrains Mono', monospace; }
.ad-print { text-align: center; }

/* responsive */
@media (max-width: 700px) {
  .ar-h-inner { padding: 0 12px; gap: 8px; }
  .ar-brand-role { display: none; }
  .ar-tab { padding: 6px 8px; font-size: 11px; }
  .ar-tab svg { display: none; }
  .ar-back span { display: none; }
  .ar-b { padding: 0 12px; margin-top: 12px; }
  .ac { padding: 14px 16px; }
  .ac-srch .ac-inp { width: 100px; }
  .ac-inp--p { max-width: 80px; }
  .am { flex-direction: column; }
  .acg--3 { grid-template-columns: 1fr 1fr; }
  .ac-tbl-hc--q, .ac-td--q { display: none; }
}
`;

console.log("🍕 La Toscana — Admin cargado");

