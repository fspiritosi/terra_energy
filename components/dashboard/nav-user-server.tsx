import { getCurrentUser } from "./user-actions"
import { NavUser } from "./nav-user"

export async function NavUserServer() {
    const { user, error } = await getCurrentUser()


    if (error) console.log(error)
    // Si no hay usuario autenticado, mostrar datos por defecto

    return <NavUser user={user} />
}