import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faSync } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import LoadComponent from '../../components/Load/LoadComponent';
import { InventarioModel } from '../../models/inventarioModel';
import { updateInventario } from '../../services/inventarioService/InventarioService';
import { getTipoEquiposActivos } from '../../services/tipoEquipoService/TipoEquipoService';
import { getDepartamentosActivos } from '../../services/departamentoService/DepartamentoService';
import { TipoEquipoModel } from '../../models/tipoEquipoModel';
import { DepartamentoModel } from '../../models/departamentoModel';

const InventarioFormUpdate = ({
    onNewInventario,
    closeModal,
    inventario,
}: {
    onNewInventario: (newInventario: InventarioModel) => void;
    closeModal: () => void;
    inventario: InventarioModel | null;
}) => {
    const [formData, setFormData] = useState<InventarioModel>({
        ID_CONTROL_INVENTARIO: 0, 
        CODIGO_INVENTARIO: '',
        MARCA: '',
        ID_TIPO_EQUIPO: 0,
        ID_DEPARTAMENTO: 0,
        FECHA_ASIGNACION: '',
        NOMBRE_RESPONSABLE: '',
        FECHA_INGRESO_INVENTARIO: '',
        ESTADO: 'I',
        NOMBRE_DEPARTAMENTO: '',
        NOMBRE_TIPO_EQUIPO: '',
    });

    const [touchedMarca, setTouchedMarca] = useState(false);
    const [touchedIdTipoEquipo, setTouchedIdTipoEquipo] = useState(false);
    const [touchedIdDepartamento, setTouchedIdDepartamento] = useState(false);
    const [touchedNombreResponsable, setTouchedNombreResponsable] = useState(false);

    const [tipoEquipos, setTipoEquipos] = useState<TipoEquipoModel[]>([]);
    const [departamentos, setDepartamentos] = useState<DepartamentoModel[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    // consultas selected //
    useEffect(() => {
        fetchTipoEquipos();
        fetchDepartamentos();
    }, [formData.ID_DEPARTAMENTO, formData.ID_TIPO_EQUIPO]);

    const fetchTipoEquipos = async () => {
        try {
            const result = await getTipoEquiposActivos();
            setTipoEquipos(result);
        } catch (error) {
            console.error('Error al obtener los Tipos de Equipo:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartamentos = async () => {
        try {
            const result = await getDepartamentosActivos();
            setDepartamentos(result);
        } catch (error) {
            console.error('Error al obtener los Departamentos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (inventario) {
            setFormData(inventario);
        }
    }, [inventario]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!formData.MARCA.trim()) {
            setTouchedMarca(true);
            return;
        }

        if (!formData.NOMBRE_RESPONSABLE.trim()) {
            setTouchedNombreResponsable(true);
            return;
        }

        if (!formData.ID_DEPARTAMENTO) {
            setTouchedIdDepartamento(true);
            return;
        }

        if (!formData.ID_TIPO_EQUIPO) {
            setTouchedIdTipoEquipo(true);
            return;
        }
    

        setLoading(true);

        try {
            const { status, message } = await updateInventario(formData);
            setLoading(false);

            if (status === 'SUCCESS') {
                onNewInventario(formData);
                closeModal();
                toast.success(message, {
                    autoClose: 3000,
                    className: "dark:bg-boxdark dark:text-white",
                });
            }
        } catch (err: any) {
            setLoading(false);
            if (err.status === 'ALERT') {
                toast.warning(err.message, {
                    autoClose: 3000,
                    className: "dark:bg-boxdark dark:text-white"
                });
            } else if (err.status === 'ERROR') {
                toast.error(`Error: ${err.message.message}`, {
                    autoClose: 3000,
                    className: "dark:bg-boxdark dark:text-white"
                });
            } else {
                toast.error('Error desconocido al actualizar el Registro.', {
                    autoClose: 3000,
                    className: "dark:bg-boxdark dark:text-white"
                });
            }
        }

    };

    if (loading) {
        return <LoadComponent />;
    }

    return (
        <form onSubmit={handleSubmit}>

            {/* CÓDIGO */}
            <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                    CÓDIGO
                </label>
                <input
                    disabled
                    type="text"
                    value={formData.CODIGO_INVENTARIO}
                    name='CODIGO_INVENTARIO'
                    placeholder="CÓDIGO INVENTARIO"
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${touchedMarca && !formData.MARCA.trim() ? 'border-red-500' : ''
                        }`}
                />
            </div>

            {/* Marca */}
            <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                    Marca <span className="text-meta-1">*</span>
                </label>
                <input
                    type="text"
                    value={formData.MARCA}
                    name='MARCA'
                    onChange={handleChange}
                    onBlur={() => setTouchedMarca(true)}
                    placeholder="Marca"
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${touchedMarca && !formData.MARCA.trim() ? 'border-red-500' : ''
                        }`}
                    required
                />
                {touchedMarca && !formData.MARCA.trim() && (
                    <p className="text-red-500 mt-1">La Marca es obligatoria.</p>
                )}
            </div>

            {/* Tipo de Equipo */}
            <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                    Tipo de Equipo <span className="text-meta-1">*</span>
                </label>
                <select
                    value={formData.ID_TIPO_EQUIPO}
                    onChange={handleChange}
                    name='ID_TIPO_EQUIPO'
                    onBlur={() => setTouchedIdTipoEquipo(true)}
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${touchedIdTipoEquipo && !formData.ID_TIPO_EQUIPO ? 'border-red-500' : ''
                        }`}
                    required
                >
                    <option value="0" disabled>Seleccione un Tipo de Equipo</option>
                    {tipoEquipos.map((tipo) => (
                        <option key={tipo.ID_TIPO_EQUIPO} value={tipo.ID_TIPO_EQUIPO}>
                            {tipo.NOMBRE_TIPO_EQUIPO}
                        </option>
                    ))}
                </select>
                {touchedIdTipoEquipo && !formData.ID_TIPO_EQUIPO && (
                    <p className="text-red-500 mt-1">El Tipo de Equipo es obligatorio.</p>
                )}
            </div>

            {/* Departamento */}
            <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                    Departamento <span className="text-meta-1">*</span>
                </label>
                <select
                    value={formData.ID_DEPARTAMENTO}
                    name='ID_DEPARTAMENTO'
                    onChange={handleChange}
                    onBlur={() => setTouchedIdDepartamento(true)}
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${touchedIdDepartamento && !formData.ID_DEPARTAMENTO ? 'border-red-500' : ''
                        }`}
                    required
                >
                    <option value="0" disabled>Seleccione un Departamento</option>
                    {departamentos.map((departamento) => (
                        <option key={departamento.ID_DEPARTAMENTO} value={departamento.ID_DEPARTAMENTO}>
                            {departamento.NOMBRE_DEPARTAMENTO}
                        </option>
                    ))}
                </select>
                {touchedIdDepartamento && !formData.ID_DEPARTAMENTO && (
                    <p className="text-red-500 mt-1">El Departamento es obligatorio.</p>
                )}
            </div>

            {/* Nombre del Responsable */}
            <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                    Nombre del Responsable
                </label>
                <input
                    type="text"
                    name='NOMBRE_RESPONSABLE'
                    value={formData.NOMBRE_RESPONSABLE}
                    onChange={handleChange}
                    onBlur={() => setTouchedNombreResponsable(true)}
                    placeholder="Nombre del Responsable"
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${touchedNombreResponsable && !formData.NOMBRE_RESPONSABLE.trim() ? 'border-red-500' : ''
                        }`}
                />
                {touchedNombreResponsable && !formData.NOMBRE_RESPONSABLE.trim() && (
                    <p className="text-red-500 mt-1">El Nombre del Responsable es obligatorio.</p>
                )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4.5">
                <button
                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    type="button"
                    onClick={() => {
                        closeModal();
                    }}
                >
                    Cancelar &nbsp;
                    <FontAwesomeIcon icon={faCancel} style={{ marginTop: '5px' }} />
                </button>
                <button
                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                >
                    Actualizar &nbsp;
                    <FontAwesomeIcon icon={faSync} style={{ marginTop: '5px' }} />
                </button>
            </div>
        </form>
    );
};

export default InventarioFormUpdate;
