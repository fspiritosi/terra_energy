"use client";

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
  primary: "#B8860B", // Dorado/Marrón del logo
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
    paddingTop: 20,
    paddingBottom: 60,
    paddingHorizontal: 30,
  },
  // Header
  header: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  headerLogoContainer: {
    width: "20%",
    padding: 10,
    borderRightWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  headerLogo: {
    width: 80,
    height: 40,
  },
  headerTitleContainer: {
    width: "60%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
  },
  headerCodeContainer: {
    width: "20%",
    borderLeftWidth: 1,
    borderColor: colors.border,
  },
  headerCodeRow: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    padding: 5,
    minHeight: 20,
  },
  headerCodeText: {
    fontSize: 8,
  },
  // Info del documento
  infoGrid: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 0,
  },
  infoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  infoCell: {
    padding: 5,
    borderRightWidth: 1,
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
  // Footer con firmas
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
  },
  footerRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerCell: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderColor: colors.border,
    minHeight: 25,
  },
  signatureBox: {
    flex: 1,
    borderRightWidth: 1,
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
    marginBottom: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitleText: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
  checklistItem: {
    flexDirection: "row",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.border,
    minHeight: 25,
  },
  checklistDescription: {
    flex: 3,
    padding: 5,
    borderRightWidth: 1,
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
    fontSize: 14,
    fontWeight: "bold",
  },
  crossMark: {
    color: colors.danger,
    fontSize: 14,
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
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
    borderWidth: 1,
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
        {/* Logo placeholder - se puede reemplazar con imagen real */}
        <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.primary }}>
          TERRA
        </Text>
        <Text style={{ fontSize: 6, color: colors.primary }}>
          ENERGY SERVICES
        </Text>
      </View>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>INFORME DE ENSAYOS</Text>
        <Text style={styles.headerTitle}>NO DESTRUCTIVOS</Text>
      </View>
      <View style={styles.headerCodeContainer}>
        <View style={styles.headerCodeRow}>
          <Text style={styles.headerCodeText}>{data.codigoDocumento}</Text>
        </View>
        <View style={styles.headerCodeRow}>
          <Text style={styles.headerCodeText}>Rev: {data.revision}</Text>
        </View>
        <View style={[styles.headerCodeRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.headerCodeText}>Pág: </Text>
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

// Componente Footer con firmas
function FooterSignatures({ data }: { data: InformeData }) {
  return (
    <View style={styles.footer}>
      {/* Fila de revisión */}
      <View style={styles.footerRow}>
        <View style={styles.footerCell}>
          <Text style={styles.infoLabel}>REV.{data.revision}</Text>
        </View>
        <View style={[styles.footerCell, { flex: 2 }]}>
          <Text style={styles.infoLabel}>FECHA {data.fechaDocumento}</Text>
        </View>
        <View style={[styles.footerCell, { flex: 2 }]}>
          <Text style={styles.infoLabel}>REALIZÓ:</Text>
          <Text style={styles.infoValue}>{data.operadorNombre || ""}</Text>
        </View>
        <View style={[styles.footerCell, { flex: 2, borderRightWidth: 0 }]}>
          <Text style={styles.infoLabel}>APROBÓ:</Text>
          <Text style={styles.infoValue}>{data.supervisorNombre || ""}</Text>
        </View>
      </View>
      {/* Fila de firmas */}
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
              <Text key={respIdx}>
                {typeof resp.valor === "boolean" ? (
                  resp.valor ? (
                    <Text style={styles.checkMark}>✓</Text>
                  ) : (
                    <Text style={styles.crossMark}>✗</Text>
                  )
                ) : (
                  String(resp.valor || "-")
                )}
              </Text>
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
        <View style={{ borderWidth: 1, borderTopWidth: 0, borderColor: colors.border }}>
          <DocumentInfo data={data} />
        </View>
        <QRSection data={data} />
        <FooterSignatures data={data} />
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Página 2+: Detalle del checklist */}
      <Page size="A4" style={styles.page}>
        <Header data={data} />
        
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
          MAKING MKE NO SE RESPONSABILIZA DE LAS REACCIONES QUE PUEDAN DERIVARSE DEL USO INADECUADO DE LA INFORMACIÓN PRESENTADA.
        </Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

