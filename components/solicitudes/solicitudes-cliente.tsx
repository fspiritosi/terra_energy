import { getCurrentUser } from "../dashboard/user-actions";
import { getSolicitudes } from "./components/actions";
import { SolicitudesTableWrapper } from "./components/solicitudes-table-wrapper";

export async function SolicitudesCliente() {
    const solicitudes = await getSolicitudes();
    const { user } = await getCurrentUser()

    return (
        <SolicitudesTableWrapper
            data={solicitudes}
            userType={user?.user_metadata?.user_type}
        />
    );
}