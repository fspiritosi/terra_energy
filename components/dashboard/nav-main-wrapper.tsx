import { NavMain } from "./nav-main";

// TODO: Obtener del usuario autenticado desde Supabase
// Por ahora hardcodeado para desarrollo
const USER_TYPE: "cliente" | "operacion" = "operacion"; // Cambiar a "cliente" para probar

export function NavMainWrapper() {


    return <NavMain userType={USER_TYPE} />;
}