import React from 'react'
import { getInspecciones } from './components/actions'
import { InspeccionesTableWrapper } from './components'
import { getDocumentos } from './pdf/documento-actions'

async function Inspecciones() {
    const [inspecciones, documentosData] = await Promise.all([
        getInspecciones(),
        getDocumentos()
    ])

    // Transformar documentos para el wrapper
    const documentos = documentosData.map(doc => ({
        id: doc.id,
        numero_documento: doc.numero_documento,
        resultado: doc.resultado,
        inspeccion_id: doc.inspeccion_id
    }))

    return <InspeccionesTableWrapper data={inspecciones} documentos={documentos} />
}

export default Inspecciones