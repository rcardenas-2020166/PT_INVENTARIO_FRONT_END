import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faSync } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import LoadComponent from '../../../components/Load/LoadComponent';
import { TipoEquipoModel } from '../../../models/tipoEquipoModel';
import { updateTipoEquipo } from '../../../services/tipoEquipoService/TipoEquipoService';

const TipoEquipoFormUpdate = ({
    onNewTipoEquipo,
    closeModal,
    tipoEquipo,
}: {
    onNewTipoEquipo: (newTipoEquipo: TipoEquipoModel) => void;
    closeModal: () => void;
    tipoEquipo: TipoEquipoModel | null;
}) => {
    const [formData, setFormData] = useState<TipoEquipoModel>({
        ID_TIPO_EQUIPO: 0,
        NOMBRE_TIPO_EQUIPO: '',
        FECHA_CREACION: '',
        ESTADO: 'A',
    });

    const [isTouched, setIsTouched] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (tipoEquipo) {
            setFormData(tipoEquipo);
        }
    }, [tipoEquipo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setIsTouched(true);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!formData.NOMBRE_TIPO_EQUIPO.trim()) {
            setIsTouched(true);
            return;
        }

        setLoading(true);

        try {
            const { status, message } = await updateTipoEquipo(formData);
            setLoading(false);

            if (status === 'SUCCESS') {
                onNewTipoEquipo(formData);
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
                toast.error('Error desconocido al actualizar el Tipo de Imágen.', {
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
            <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                    Descripción <span className="text-meta-1">*</span>
                </label>
                <input
                    type="text"
                    name="NOMBRE_TIPO_EQUIPO" // Asegúrate de que el nombre coincida con el modelo
                    value={formData.NOMBRE_TIPO_EQUIPO}
                    onChange={handleChange}
                    onBlur={() => setIsTouched(true)}
                    placeholder="Departamento"
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${isTouched && !formData.NOMBRE_TIPO_EQUIPO.trim() ? 'border-red-500' : ''}`}
                    required
                />
                {isTouched && !formData.NOMBRE_TIPO_EQUIPO.trim() && (
                    <p className="text-red-500 mt-1">El nombre es obligatorio.</p>
                )}
            </div>
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

export default TipoEquipoFormUpdate;
