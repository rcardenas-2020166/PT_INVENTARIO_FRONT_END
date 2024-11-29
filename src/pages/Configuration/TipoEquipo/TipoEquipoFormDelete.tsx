import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import LoadComponent from '../../../components/Load/LoadComponent';
import { TipoEquipoModel } from '../../../models/tipoEquipoModel';
import { deleteTipoEquipo } from '../../../services/tipoEquipoService/TipoEquipoService';

const TipoEquipoFormDelete = ({
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
        ESTADO: 'I',
    });

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (tipoEquipo) {
            setFormData(tipoEquipo);
        }
    }, [tipoEquipo]);



    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();


        setLoading(true);

        try {
            const { status, message } = await deleteTipoEquipo(formData);
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
                toast.error('Error desconocido al eliminar el Tipo de Equipo.', {
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
            <div className="mb-4.5 text-center">
                <p>¿Está seguro que desea eliminar el Tipo de Equipo?</p>
            </div>
            <div className="flex justify-end gap-4.5 mt-5">
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
                    className="flex justify-center rounded bg-danger py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                >
                    Eliminar &nbsp;
                    <FontAwesomeIcon icon={faTrashAlt} style={{ marginTop: '5px' }} />
                </button>
            </div>
        </form>
    );
};

export default TipoEquipoFormDelete;
