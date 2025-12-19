import { getVerificaciones } from "./actions"
import { ReportesTable } from "./reportes-table"

async function Reportes() {
    const verificaciones = await getVerificaciones()

    return <ReportesTable data={verificaciones} />
}

export default Reportes


