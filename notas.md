# Notas Pendientes - Comentarios del Cliente

## Comentarios recibidos sobre PDF y Sistema

### 1. PDF Actual vs PDF Solicitado

**Problema identificado:**
- El PDF actual incluye TODO el checklist detallado (secciones, requisitos, respuestas completas)
- El cliente considera que esta información es "datos de procesos" que son útiles para trazabilidad interna pero NO deberían estar en el entregable al cliente
- El cliente quiere mantener esa información solo en el sistema, no en el PDF entregable

**Solución requerida:**
- ✅ Mantener toda la información detallada del checklist en el sistema (para trazabilidad interna)
- ✅ Generar PDF simplificado con formato de tabla resumen para el cliente

### 2. Nueva Estructura del PDF Solicitada

**Estructura:**
- **Página 1: Carátula**
  - QR (ya está implementado) ✓
  - Información básica del documento

- **Página 2: Informe de Inspección (tabla resumen)**
  - Columnas solicitadas:
    - **Hoja** (número de página o identificación)
    - **Identificación** (tipo de equipo, ej: "Válvula")
    - **Precinto** ⚠️ (NO EXISTE en BD actual - PENDIENTE)
    - **N° de Serie** ⚠️ (NO EXISTE en BD actual - PENDIENTE)
    - **Resultado** (según tipo de ensayo):
      - PM (Prueba de Material)
      - LP (Líquido Penetrante)
      - ME (Magnetoscópico)
      - IV (Inspección Visual)
      - Resultado PH
    - **Resultado General**: APROBADO o RECHAZADO
    - **Referencia Fotográfica**: Imagen del producto a inspeccionar
      - ✅ Las fotos ya se pueden subir en las solicitudes
      - ✅ Se almacenan en `solicitud_imagenes`

### 3. Consultas sobre Almacenamiento y Backup

**Preguntas del cliente:**
1. ¿Los PDFs pueden descargarse de manera independiente? ⚠️ PENDIENTE VERIFICAR/IMPLEMENTAR
2. ¿Qué backup tiene el sistema? (AWS, Google Cloud, etc.)
   - Actualmente usa Supabase Storage (que usa infraestructura cloud)
   - Necesita documentación clara sobre esto para el cliente
3. Mencionan que harían descargas semanales para backup propio
   - Podría implementarse exportación masiva/automática

**Estado actual:**
- Los PDFs se almacenan en Supabase Storage (en la nube)
- Hay funcionalidad para descargar PDFs, pero debe verificarse si está disponible para clientes

---

## Cambios Requeridos

### ✅ En Progreso
- [x] Rediseñar PDF simplificado (sin checklist detallado, solo tabla resumen)

### ⚠️ Pendientes

#### Cambios de Datos Necesarios:
1. **Agregar campos "Precinto" y "N° de Serie"**
   - Decidir dónde se capturan estos datos:
     - ¿En la solicitud?
     - ¿En el ítem de la solicitud?
     - ¿En el checklist durante la inspección?
   - ¿Son obligatorios u opcionales?

#### Funcionalidades a Implementar/Verificar:
1. **Descarga independiente de PDFs**
   - Verificar si ya está implementado
   - Si no, implementar descarga individual de PDFs
   - Considerar: descarga masiva o por rango de fechas

2. **Información de Backup**
   - Documentar dónde se almacenan los PDFs (Supabase Storage)
   - Explicar políticas de backup y retención
   - Considerar implementar exportación masiva semanal automatizada

#### Preguntas para Aclarar con el Cliente:

1. **Precinto y N° de Serie:**
   - ¿Se capturan por solicitud, por ítem dentro de la solicitud, o por tipo de inspección?
   - ¿Son obligatorios u opcionales?

2. **Resultado por Tipo de Ensayo:**
   - ¿Cómo se determina el resultado por tipo de ensayo?
   - ¿Cada inspección puede tener múltiples tipos de ensayo?
   - ¿El resultado general (APROBADO/RECHAZADO) es por equipo o por tipo de ensayo?

3. **Referencia Fotográfica:**
   - ¿Una foto por ítem/equipo o múltiples?
   - ✅ Confirmado: se usan las fotos de la solicitud

4. **Backup Semanal:**
   - ¿Prefieren descarga manual semanal, exportación automática programada, o ambos?

---

## Resumen

**Separación de Información:**
- **Información Interna** (checklist detallado): Solo en el sistema
- **Entregable Cliente** (PDF): Formato tabla resumen simple con información esencial

**Trabajo Actual:**
- Rediseñando PDF para formato simplificado con tabla resumen

