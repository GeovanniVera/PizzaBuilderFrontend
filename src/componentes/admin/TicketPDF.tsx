import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import type { Pedido } from "../../types/index.ts";
import { formatoMoneda, formatearNombre } from "../../utils/formatear.ts";

Font.register({
  family: "Karla",
  src: "https://fonts.gstatic.com/s/karla/v31/qkBIXvYC6trAT55ZBi1ueQVIjQTD-JqaE0lP.ttf",
});

Font.register({
  family: "JetBrains Mono",
  src: "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEKov93r6kPpE24x-c1wA.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Karla",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    textAlign: "center",
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#991b1b",
    borderBottomStyle: "dashed",
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "Karla",
    fontWeight: 700,
    color: "#991b1b",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9,
    color: "#734a4a",
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "dashed",
    marginVertical: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#555",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#991b1b",
    marginTop: 8,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  item: {
    marginBottom: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomStyle: "dotted",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemType: {
    fontSize: 9,
    fontWeight: 700,
    color: "#991b1b",
  },
  itemIdx: {
    fontSize: 8,
    color: "#999",
    marginRight: 4,
  },
  itemInfo: {
    fontSize: 9,
    color: "#555",
    marginTop: 2,
    marginLeft: 4,
  },
  toppingTag: {
    fontSize: 8,
    color: "#734a4a",
    marginLeft: 4,
  },
  itemTotal: {
    fontSize: 9,
    fontWeight: 700,
  },
  totalSection: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#991b1b",
    borderTopStyle: "solid",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 14,
    fontWeight: 700,
    color: "#991b1b",
  },
  footer: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 9,
    color: "#999",
  },
});

interface Props {
  pedido: Pedido;
}

export function TicketPDF({ pedido }: Props) {
  const fecha = new Date(pedido.fechaConfirmacion);
  const fechaStr = fecha.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const horaStr = fecha.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Document>
      <Page size={[226.8, "auto"]} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>LA TOSCANA</Text>
          <Text style={styles.subtitle}>Ticket de venta</Text>
        </View>

        <View style={styles.metaRow}>
          <Text>Pedido #{(pedido.id ?? "").slice(0, 8)}</Text>
          <Text>{fechaStr}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text></Text>
          <Text>{horaStr}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Artículos</Text>

        {pedido.items.map((item, i) => {
          const esCombo = !!(item.nombreBebida || item.nombrePostre);
          return (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.itemIdx}>{i + 1}.</Text>
                  <Text style={styles.itemType}>{esCombo ? "COMBO" : "PIZZA"}</Text>
                </View>
                <Text style={styles.itemTotal}>{formatoMoneda(item.precio)}</Text>
              </View>
              <Text style={styles.itemInfo}>
                {formatearNombre(item.tamano)} · {formatearNombre(item.masa)}
                {item.extraQueso ? " · Extra queso" : ""}
              </Text>
              {item.toppings.length > 0 && (
                <Text style={styles.toppingTag}>Toppings: {item.toppings.join(", ")}</Text>
              )}
              {esCombo && (
                <Text style={styles.toppingTag}>
                  {item.nombreBebida && `Bebida: ${item.nombreBebida}`}
                  {item.nombreBebida && item.nombrePostre ? " · " : ""}
                  {item.nombrePostre && `Postre: ${item.nombrePostre}`}
                </Text>
              )}
            </View>
          );
        })}

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text>TOTAL</Text>
            <Text>{formatoMoneda(pedido.totalCobrado)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>¡Gracias por tu preferencia!</Text>
      </Page>
    </Document>
  );
}
