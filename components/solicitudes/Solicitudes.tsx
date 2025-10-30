import React from 'react'
import { getSolicitudes } from './components/actions'
import { SolicitudesTableWrapper } from './components/solicitudes-table-wrapper'
import { getCurrentUser } from '../dashboard/user-actions'

async function Solicitudes() {
    const solicitudes = await getSolicitudes()
    const { user } = await getCurrentUser()

    return <SolicitudesTableWrapper data={solicitudes} userType={user?.user_metadata?.user_type} />
}

export default Solicitudes