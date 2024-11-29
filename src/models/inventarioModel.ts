export interface InventarioModel {
    ID_CONTROL_INVENTARIO: number;
    CODIGO_INVENTARIO: string;
    MARCA: string;
    ID_TIPO_EQUIPO: number;
    ID_DEPARTAMENTO: number;
    NOMBRE_TIPO_EQUIPO: string;
    NOMBRE_DEPARTAMENTO: string;
    FECHA_ASIGNACION?: string;
    NOMBRE_RESPONSABLE: string;
    FECHA_INGRESO_INVENTARIO?: string;
    ESTADO?: string;
}
