import React from 'react'
import { getEquipos } from './components/actions'
import { EquiposTableWrapper } from './components/equipos-table-wrapper'

async function Equipos() {
    const equipos = await getEquipos()

    return <EquiposTableWrapper data={equipos} />
}

export default Equipos