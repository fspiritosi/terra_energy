import {CreateTipoDeInspeccion} from "@/components/tipos_de_inspeccion/createForm";
import { Modal } from "@/components/tipos_de_inspeccion/modal";
import { ListTable } from "@/components/tipos_de_inspeccion/ListTable";


export default function TiposDeInspeccion() {
    return (
        <div>
            <div className="flex justify-between p-2">
                <h1>Tipos de inspeccion</h1>
                <Modal btnName='Crear' title="Crear tipo de inspeccion" description="Por favor ingresa los datos para crear un tipo de inspección">
                    <CreateTipoDeInspeccion />
                </Modal>
            </div>
            <ListTable />
            
        </div>
    )
}