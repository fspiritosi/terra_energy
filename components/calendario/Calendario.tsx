import React from 'react'
import { getInspecciones } from '@/components/inspecciones/components/actions'
import { CalendarioView } from './components/calendario-view'

async function Calendario() {
    const inspecciones = await getInspecciones()

    return <CalendarioView inspecciones={inspecciones} />
}

export default Calendario