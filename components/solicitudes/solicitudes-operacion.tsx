import { getSolicitudes } from "./components/actions";
import { SolicitudesTableWrapper } from "./components/solicitudes-table-wrapper";

export async function SolicitudesOperacion() {
    const solicitudes = await getSolicitudes();

    return (
        <SolicitudesTableWrapper
            data={solicitudes}
            userType="operacion"
        />
    );
}