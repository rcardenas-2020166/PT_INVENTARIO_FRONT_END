import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCancel } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import LoadComponent from '../../components/Load/LoadComponent';
import { TipoEquipoModel } from '../../models/tipoEquipoModel';
import { getTipoEquiposActivos } from '../../services/tipoEquipoService/TipoEquipoService';
import { DepartamentoModel } from '../../models/departamentoModel';
import { getDepartamentosActivos } from '../../services/departamentoService/DepartamentoService';
import { InventarioModel } from '../../models/inventarioModel';
import { createInventario } from '../../services/inventarioService/InventarioService';

const InventarioForm = ({ onNewInventario, closeModal }: { onNewInventario: (newInventario: InventarioModel) => void, closeModal: () => void }) => {
    const [marca, setMarca] = useState('');
    const [idTipoEquipo, setIdTipoEquipo] = useState(0);
    const [idDepartamento, setIdDepartamento] = useState(0);
    const [nombreResponsable, setNombreResponsable] = useState('');

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
    }, [idTipoEquipo, idDepartamento]);
    

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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        if (!marca.trim()) {
            setTouchedMarca(true);
            return;
        }

        if (!nombreResponsable.trim()) {
            setTouchedNombreResponsable(true);
            return;
        }

        if (!idDepartamento) {
            setTouchedIdDepartamento(true);
            return;
        }

        if (!idTipoEquipo) {
            setTouchedIdTipoEquipo(true);
            return;
        }
    
        const newInventario: InventarioModel = {
            ID_CONTROL_INVENTARIO: 0, 
            CODIGO_INVENTARIO: '',
            MARCA: marca,
            ID_TIPO_EQUIPO: idTipoEquipo,
            ID_DEPARTAMENTO: idDepartamento,
            FECHA_ASIGNACION: '',
            NOMBRE_RESPONSABLE: nombreResponsable,
            FECHA_INGRESO_INVENTARIO: '',
            ESTADO: 'A',
            NOMBRE_DEPARTAMENTO: '',
            NOMBRE_TIPO_EQUIPO: '',
        };
    
        setLoading(true);
    
        try {
            const { status, message } = await createInventario(newInventario);
            setLoading(false);
    
            if (status === 'SUCCESS') {
                onNewInventario(newInventario);
                setMarca('');
                setNombreResponsable('');
                fetchDepartamentos();
                fetchTipoEquipos();
                closeModal();
                toast.success(message, {
                    autoClose: 3000,
                    className: "dark:bg-boxdark dark:text-white"
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
                toast.error('Error desconocido al crear el Registro.', {
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

            {/* Marca */}
            <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                    Marca <span className="text-meta-1">*</span>
                </label>
                <input
                    type="text"
                    value={marca}
                    onChange={(e) => {
                        setMarca(e.target.value);
                        setTouchedMarca(false);
                    }}
                    onBlur={() => setTouchedMarca(true)}
                    placeholder="Marca"
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${touchedMarca && !marca.trim() ? 'border-red-500' : ''
                        }`}
                    required
                />
                {touchedMarca && !marca.trim() && (
                    <p className="text-red-500 mt-1">La Marca es obligatoria.</p>
                )}
            </div>

            {/* Tipo de Equipo */}
            <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                    Tipo de Equipo <span className="text-meta-1">*</span>
                </label>
                <select
                    value={idTipoEquipo}
                    onChange={(e) => {
                        setIdTipoEquipo(parseInt(e.target.value));
                        setTouchedIdTipoEquipo(false);
                    }}
                    onBlur={() => setTouchedIdTipoEquipo(true)}
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${touchedIdTipoEquipo && !idTipoEquipo ? 'border-red-500' : ''
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
                {touchedIdTipoEquipo && !idTipoEquipo && (
                    <p className="text-red-500 mt-1">El Tipo de Equipo es obligatorio.</p>
                )}
            </div>

            {/* Departamento */}
            <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                    Departamento <span className="text-meta-1">*</span>
                </label>
                <select
                    value={idDepartamento}
                    onChange={(e) => {
                        setIdDepartamento(parseInt(e.target.value));
                        setTouchedIdDepartamento(false);
                    }}
                    onBlur={() => setTouchedIdDepartamento(true)}
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${touchedIdDepartamento && !idDepartamento ? 'border-red-500' : ''
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
                {touchedIdDepartamento && !idDepartamento && (
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
                    value={nombreResponsable}
                    onChange={(e) => {
                        setNombreResponsable(e.target.value);
                        setTouchedNombreResponsable(false);
                    }}
                    onBlur={() => setTouchedNombreResponsable(true)}
                    placeholder="Nombre del Responsable"
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${touchedNombreResponsable && !nombreResponsable.trim() ? 'border-red-500' : ''
                        }`}
                />
                {touchedNombreResponsable && !nombreResponsable.trim() && (
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
                    Guardar &nbsp;
                    <FontAwesomeIcon icon={faFileAlt} style={{ marginTop: '5px' }} />
                </button>
            </div>
        </form>
    );
};

export default InventarioForm;
