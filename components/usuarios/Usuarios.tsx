import React from 'react'
import { getUsuarios } from './components/actions'
import { UsuariosTableWrapper } from './components'

async function Usuarios() {
    const usuarios = await getUsuarios()


    return <UsuariosTableWrapper data={usuarios} />
}

export default Usuarios