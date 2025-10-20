import { getTipoDeInspeccion } from "./actionServer";

export async function ListTable() {
    const response = await getTipoDeInspeccion();
    console.log(response);
    return (
        <div className="flex flex-col gap-2 p-2">
            <h1>Lista de tipos de inspeccion</h1>
            {response.map((item) => (
                <div key={item.id}>
                    <p>{item.nombre}</p>
                    <p>{item.codigo}</p>
                    <p>{item.descripcion}</p>
                    <p>{item.is_active}</p>
                </div>
            ))}
        </div>
    )
}