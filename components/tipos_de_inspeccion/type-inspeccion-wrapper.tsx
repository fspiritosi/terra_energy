import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InspeccionesTipoTable } from './inspeccionesTipoTable'
import { AddTypeInspectionButton } from './add-type-inspection-button'
import { TipoDeInspeccionType } from './actions'

interface TipoDeInspeccionWrapperProps {
    data: TipoDeInspeccionType[]
}

export function TipoDeInspeccionWrapper({ data }: TipoDeInspeccionWrapperProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Gestión de Tipos de Inspecciones</CardTitle>
                        <CardDescription>
                            Administra todos los tipos de inspecciones de la empresa
                        </CardDescription>
                    </div>
                    <AddTypeInspectionButton />
                </div>
            </CardHeader>
            <CardContent>
                <InspeccionesTipoTable data={data} />
            </CardContent>
        </Card>
    )
}