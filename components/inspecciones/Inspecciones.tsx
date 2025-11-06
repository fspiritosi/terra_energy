import React from 'react'
import { getInspecciones } from './components/actions'
import { InspeccionesTableWrapper } from './components'

async function Inspecciones() {
    const inspecciones = await getInspecciones()

    return <InspeccionesTableWrapper data={inspecciones} />
}

export default Inspecciones