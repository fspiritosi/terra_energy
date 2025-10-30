import React from 'react'
import { getSolicitudes } from './components/actions'
import { SolicitudesTableWrapper } from './components/solicitudes-table-wrapper'

async function Solicitudes() {
    const solicitudes = await getSolicitudes()

    return <SolicitudesTableWrapper data={solicitudes} />
}

export default Solicitudes