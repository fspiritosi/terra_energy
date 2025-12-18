import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Registrar fuentes
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

// Colores de la marca Terra Energy
const colors = {
  primary: "#8B6914", // Dorado oscuro del logo
  primaryLight: "#B8860B", // Dorado/Marrón claro
  secondary: "#1a1a1a",
  success: "#22c55e",
  danger: "#ef4444",
  border: "#000000",
  lightGray: "#f5f5f5",
  gray: "#666666",
};

// Estilos del documento
const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 9,
    paddingTop: 0,
    paddingBottom: 130, // Espacio para footerTop (30px) + footer de firmas (80px) + margen
    paddingHorizontal: 0,
  },
  pageContent: {
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 0,
    marginBottom: 0,
  },
  // Header - ocupa 100% del ancho sin padding
  header: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 0,
  },
  headerLogoContainer: {
    width: "22%",
    padding: 8,
    borderRightWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  headerLogo: {
    width: 100,
    height: 50,
    objectFit: "contain",
  },
  headerTitleContainer: {
    width: "56%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    textTransform: "uppercase",
  },
  headerCodeContainer: {
    width: "22%",
    borderLeftWidth: 2,
    borderColor: colors.border,
    backgroundColor: "#ffffff",
  },
  headerCodeRow: {
    borderBottomWidth: 2,
    borderColor: colors.border,
    padding: 6,
    minHeight: 22,
    justifyContent: "center",
  },
  headerCodeRowLast: {
    padding: 6,
    minHeight: 22,
    justifyContent: "center",
  },
  headerCodeText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  // Info del documento - ocupa 100% del ancho sin padding
  infoGrid: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.border,
    borderTopWidth: 2, // Borde arriba para la sección de CLIENTE
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: colors.border,
    width: "100%",
  },
  infoCell: {
    padding: 5,
    borderRightWidth: 2,
    borderColor: colors.border,
  },
  infoLabel: {
    fontSize: 8,
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 9,
  },
  // QR Section
  qrSection: {
    alignItems: "center",
    padding: 20,
    marginVertical: 10,
  },
  qrImage: {
    width: 150,
    height: 150,
  },
  // Footer - sección superior (solo primera página) - posicionada absolutamente
  footerTop: {
    position: "absolute",
    bottom: 110, // 30px arriba del footer de firmas (80px altura + 30px margen)
    left: 0,
    right: 0,
    width: "100%",
  },
  footerTopRow: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.border,
  },
  footerTopCell: {
    flex: 1,
    padding: 5,
    borderRightWidth: 2,
    borderColor: colors.border,
    minHeight: 25,
  },
  // Footer con firmas (todas las páginas) - fixed para que siempre esté en el bottom
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    minHeight: 80,
  },
  footerRow: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.border,
  },
  signatureBox: {
    flex: 1,
    borderRightWidth: 2,
    borderColor: colors.border,
    minHeight: 80,
    padding: 5,
  },
  signatureLabel: {
    fontSize: 8,
    textAlign: "center",
    marginTop: "auto",
    fontWeight: "bold",
  },
  // Contenido del checklist
  sectionTitle: {
    backgroundColor: colors.lightGray,
    padding: 8,
    marginTop: 10,
    marginBottom: 0,
    borderWidth: 2,
    borderColor: colors.border,
  },
  sectionTitleText: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
  checklistItem: {
    flexDirection: "row",
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: colors.border,
    minHeight: 25,
  },
  checklistDescription: {
    flex: 3,
    padding: 5,
    borderRightWidth: 2,
    borderColor: colors.border,
  },
  checklistResponse: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  checkMark: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "bold",
  },
  crossMark: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "bold",
  },
  // Resultado
  resultContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 5,
    paddingHorizontal: 15,
  },
  resultAprobado: {
    color: colors.success,
  },
  resultRechazado: {
    color: colors.danger,
  },
  // Imágenes
  imageSection: {
    marginTop: 15,
  },
  imageSectionTitle: {
    backgroundColor: "#808080",
    color: "#ffffff",
    padding: 8,
    textAlign: "center",
    fontWeight: "bold",
    borderWidth: 2,
    borderColor: colors.border,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: colors.border,
  },
  imageContainer: {
    width: "45%",
    marginBottom: 10,
  },
  inspectionImage: {
    width: "100%",
    height: 150,
    objectFit: "contain",
  },
  // Disclaimer
  disclaimer: {
    fontSize: 6,
    textAlign: "center",
    color: colors.gray,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  // Page number
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 10,
    right: 30,
    color: colors.gray,
  },
});

// Tipos
export interface InformeData {
  // Datos generales
  numeroDocumento: string;
  revision: string;
  fechaDocumento: string;
  fechaVencimiento?: string;
  codigoDocumento: string;
  
  // Datos del cliente
  clienteNombre: string;
  clienteLogo?: string;
  terraLogoUrl?: string;
  contacto?: string;
  lugar: string;
  
  // Datos de la inspección
  numeroInspeccion: string;
  equipo: string;
  fechaInspeccion: string;
  tipoInspeccion: string;
  
  // QR
  qrDataUrl: string;
  
  // Resultado
  resultado: "aprobado" | "rechazado" | "con_observaciones";
  observaciones?: string;
  
  // Checklist completado
  secciones: Array<{
    nombre: string;
    resultadoParcial?: "aprobado" | "rechazado";
    requisitos: Array<{
      descripcion: string;
      respuestas: Array<{
        tipo: string;
        valor: string | number | boolean | null;
      }>;
    }>;
  }>;
  
  // Imágenes
  imagenes?: string[];
  
  // Firmas
  operadorNombre?: string;
  supervisorNombre?: string;
}

// Componente Header
function Header({ data }: { data: InformeData }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLogoContainer}>
        {data.terraLogoUrl && (
          <Image style={styles.headerLogo} src={data.terraLogoUrl} />
        )}
      </View>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>{data.tipoInspeccion || "INFORME DE ENSAYOS NO DESTRUCTIVOS"}</Text>
      </View>
      <View style={styles.headerCodeContainer}>
        <View style={styles.headerCodeRow}>
          <Text style={styles.headerCodeText}>{data.codigoDocumento}</Text>
        </View>
        <View style={styles.headerCodeRow}>
          <Text style={styles.headerCodeText}>Rev. {data.revision}</Text>
        </View>
        <View style={styles.headerCodeRowLast}>
          <Text
            style={styles.headerCodeText}
            render={({ pageNumber, totalPages }) => `Pág. ${pageNumber}/${totalPages}`}
          />
        </View>
      </View>
    </View>
  );
}

// Componente Info del documento
function DocumentInfo({ data }: { data: InformeData }) {
  return (
    <View>
      {/* Fila 1 */}
      <View style={styles.infoRow}>
        <View style={[styles.infoCell, { width: "40%" }]}>
          <Text style={styles.infoLabel}>CLIENTE:</Text>
          <Text style={styles.infoValue}>{data.clienteNombre}</Text>
        </View>
        <View style={[styles.infoCell, { width: "35%" }]}>
          <Text style={styles.infoLabel}>CERTIFICACIÓN ANUAL</Text>
        </View>
        <View style={[styles.infoCell, { width: "25%", borderRightWidth: 0 }]}>
          <Text style={styles.infoLabel}>F. DE INSPECCIÓN:</Text>
          <Text style={styles.infoValue}>{data.fechaInspeccion}</Text>
        </View>
      </View>
      {/* Fila 2 */}
      <View style={styles.infoRow}>
        <View style={[styles.infoCell, { width: "40%" }]}>
          <Text style={styles.infoLabel}>CONTACTO:</Text>
          <Text style={styles.infoValue}>{data.contacto || "-"}</Text>
        </View>
        <View style={[styles.infoCell, { width: "35%" }]}>
          <Text style={styles.infoLabel}>LUGAR:</Text>
          <Text style={styles.infoValue}>{data.lugar}</Text>
        </View>
        <View style={[styles.infoCell, { width: "25%", borderRightWidth: 0 }]}>
          <Text style={styles.infoLabel}>F. DE VENCIMIENTO:</Text>
          <Text style={styles.infoValue}>{data.fechaVencimiento || "-"}</Text>
        </View>
      </View>
      {/* Fila 3 */}
      <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
        <View style={[styles.infoCell, { width: "50%" }]}>
          <Text style={styles.infoLabel}>EQUIPO:</Text>
          <Text style={styles.infoValue}>{data.equipo}</Text>
        </View>
        <View style={[styles.infoCell, { width: "50%", borderRightWidth: 0 }]}>
          <Text style={styles.infoLabel}>INFORME Nº:</Text>
          <Text style={styles.infoValue}>{data.numeroDocumento}</Text>
        </View>
      </View>
    </View>
  );
}

// Componente QR
function QRSection({ data }: { data: InformeData }) {
  return (
    <View style={styles.qrSection}>
      {data.qrDataUrl && (
        <Image style={styles.qrImage} src={data.qrDataUrl} />
      )}
    </View>
  );
}

// Componente Footer superior (solo primera página)
function FooterTop({ data }: { data: InformeData }) {
  return (
    <View style={styles.footerTop}>
      <View style={styles.footerTopRow}>
        <View style={styles.footerTopCell}>
          <Text style={styles.infoLabel}>REV.{data.revision}</Text>
        </View>
        <View style={[styles.footerTopCell, { flex: 2 }]}>
          <Text style={styles.infoLabel}>FECHA {data.fechaDocumento}</Text>
        </View>
        <View style={[styles.footerTopCell, { flex: 2 }]}>
          <Text style={styles.infoLabel}>F. DE VENCIMIENTO:</Text>
          <Text style={styles.infoValue}>{data.fechaVencimiento || "-"}</Text>
        </View>
        <View style={[styles.footerTopCell, { flex: 2 }]}>
          <Text style={styles.infoLabel}>REALIZÓ:</Text>
          <Text style={styles.infoValue}>{data.operadorNombre || ""}</Text>
        </View>
        <View style={[styles.footerTopCell, { flex: 2, borderRightWidth: 0 }]}>
          <Text style={styles.infoLabel}>APROBÓ:</Text>
          <Text style={styles.infoValue}>{data.supervisorNombre || ""}</Text>
        </View>
      </View>
    </View>
  );
}

// Componente Footer con firmas (todas las páginas) - fixed para que siempre esté en el bottom
function FooterSignatures() {
  return (
    <View style={styles.footer} fixed>
      <View style={styles.footerRow}>
        <View style={styles.signatureBox}>
          <Text style={styles.signatureLabel}>(OPERADOR)</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text style={styles.signatureLabel}>(SUPERVISOR)</Text>
        </View>
        <View style={[styles.signatureBox, { borderRightWidth: 0 }]}>
          <Text style={styles.signatureLabel}>ACEPTÓ / CLIENTE</Text>
        </View>
      </View>
    </View>
  );
}

// Componente Checklist Section
function ChecklistSection({ seccion }: { seccion: InformeData["secciones"][0] }) {
  return (
    <View wrap={false}>
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>
          {seccion.nombre}
          {seccion.resultadoParcial && (
            <Text
              style={
                seccion.resultadoParcial === "aprobado"
                  ? styles.resultAprobado
                  : styles.resultRechazado
              }
            >
              {" "}
              - RESULTADO PARCIAL:{" "}
              {seccion.resultadoParcial.toUpperCase()}
            </Text>
          )}
        </Text>
      </View>
      {seccion.requisitos.map((requisito, idx) => (
        <View key={idx} style={styles.checklistItem}>
          <View style={styles.checklistDescription}>
            <Text>{requisito.descripcion}</Text>
          </View>
          <View style={styles.checklistResponse}>
            {requisito.respuestas.map((resp, respIdx) => (
              <View key={respIdx} style={{ marginBottom: 2 }}>
                <Text>
                  {typeof resp.valor === "boolean" ? (
                    resp.valor ? (
                      <Text style={styles.checkMark}>OK</Text>
                    ) : (
                      <Text style={styles.crossMark}>NO</Text>
                    )
                  ) : resp.valor !== null && resp.valor !== undefined ? (
                    String(resp.valor)
                  ) : (
                    "-"
                  )}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

// Componente Imágenes
function ImageSection({ imagenes }: { imagenes: string[] }) {
  if (!imagenes || imagenes.length === 0) return null;

  return (
    <View style={styles.imageSection} wrap={false}>
      <Text style={styles.imageSectionTitle}>REFERENCIA FOTOGRÁFICA</Text>
      <View style={styles.imageGrid}>
        {imagenes.map((img, idx) => (
          <View key={idx} style={styles.imageContainer}>
            <Image style={styles.inspectionImage} src={img} />
          </View>
        ))}
      </View>
    </View>
  );
}

// Componente Resultado
function ResultadoFinal({ resultado }: { resultado: InformeData["resultado"] }) {
  const isAprobado = resultado === "aprobado";
  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultLabel}>RESULTADO:</Text>
      <Text
        style={[
          styles.resultValue,
          isAprobado ? styles.resultAprobado : styles.resultRechazado,
        ]}
      >
        {resultado.toUpperCase()}
      </Text>
    </View>
  );
}

// Componente Principal del Documento
export function InformeInspeccionPDF({ data }: { data: InformeData }) {
  return (
    <Document>
      {/* Página 1: Carátula */}
      <Page size="A4" style={styles.page}>
        <Header data={data} />
        {/* Contenedor flex para posicionar contenido abajo - solo primera página */}
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* Info del documento - ocupa 100% del ancho sin padding (fuera del contenedor con padding) */}
          <View style={styles.infoGrid}>
            <DocumentInfo data={data} />
          </View>
          {/* QR con padding horizontal */}
          <View style={{ paddingHorizontal: 30 }}>
            <QRSection data={data} />
          </View>
        </View>
        {/* Footer superior solo en primera página - posicionado absolutamente */}
        <FooterTop data={data} />
        {/* Footer de firmas en todas las páginas */}
        <FooterSignatures />
      </Page>

      {/* Página 2+: Detalle del checklist */}
      <Page size="A4" style={styles.page}>
        <Header data={data} />
        <View style={styles.pageContent}>
          {/* Resultado general */}
          <ResultadoFinal resultado={data.resultado} />
          
          {/* Secciones del checklist */}
          {data.secciones.map((seccion, idx) => (
            <ChecklistSection key={idx} seccion={seccion} />
          ))}

          {/* Observaciones */}
          {data.observaciones && (
            <View style={{ marginTop: 15 }}>
              <Text style={styles.infoLabel}>OBSERVACIONES:</Text>
              <Text style={styles.infoValue}>{data.observaciones}</Text>
            </View>
          )}

          {/* Imágenes */}
          <ImageSection imagenes={data.imagenes || []} />

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            LA REPRODUCCIÓN PARCIAL DE ESTE DOCUMENTO NO ES VÁLIDA. LOS RESULTADOS EN EL PRESENTE CERTIFICADO SE REFIEREN AL MOMENTO EN QUE SE REALIZARON LAS INSPECCIONES.
            TERRA ENERGY SERVICES NO SE RESPONSABILIZA DE LAS REACCIONES QUE PUEDAN DERIVARSE DEL USO INADECUADO DE LA INFORMACIÓN PRESENTADA.
          </Text>
        </View>
        {/* Footer de firmas en todas las páginas */}
        <FooterSignatures />
      </Page>
    </Document>
  );
}

