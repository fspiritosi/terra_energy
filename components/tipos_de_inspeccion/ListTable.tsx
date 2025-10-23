import { getTipoDeInspeccion } from "./actionServer";
import { InspeccionesTipoTable } from "./inspeccionesTipoTable";

export async function ListTable() {
    const response = await getTipoDeInspeccion();
    console.log(response);
    return (
        <InspeccionesTipoTable data={response} />
    )
}