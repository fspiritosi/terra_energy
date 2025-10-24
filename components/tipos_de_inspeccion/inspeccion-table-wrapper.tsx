import { getTipoDeInspeccion } from "./actions";
import { InspeccionesTipoTable } from "./inspeccionesTipoTable";

export async function ListTable() {
    const response = await getTipoDeInspeccion();
    console.log(response);
    return (
        <InspeccionesTipoTable data={response} />
    )
}