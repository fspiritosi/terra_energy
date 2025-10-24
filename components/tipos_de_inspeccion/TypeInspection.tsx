import React from 'react'
import { getTipoDeInspeccion } from './actions'
import { TipoDeInspeccionWrapper } from './type-inspeccion-wrapper'

async function TipoDeInspeccion() {
    const tipoDeInspeccion = await getTipoDeInspeccion()

    return <TipoDeInspeccionWrapper data={tipoDeInspeccion} />
}

export default TipoDeInspeccion