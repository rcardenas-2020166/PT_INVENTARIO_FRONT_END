import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCancel } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import LoadComponent from '../../../components/Load/LoadComponent';
import { DepartamentoModel } from '../../../models/departamentoModel';
import { createDepartamento } from '../../../services/departamentoService/DepartamentoService';

const DepartamentoForm = ({ onNewDepartamento, closeModal }: { onNewDepartamento: (newDepartamento: DepartamentoModel) => void, closeModal: () => void }) => {
    const [descriptionDepartamento, setDescriptionDepartamento] = useState<string>('');
    const [isTouched, setIsTouched] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        if (!descriptionDepartamento.trim()) {
            setIsTouched(true);
            return;
        }
    
        const newDepartamento: DepartamentoModel = {
            ID_DEPARTAMENTO: 0,
            NOMBRE_DEPARTAMENTO: descriptionDepartamento,
            FECHA_CREACION: '',
            ESTADO: 'A'
        };
    
        setLoading(true); 
    
        try {
            const { status, message } = await createDepartamento(newDepartamento);
            setLoading(false);
    
            if (status === 'SUCCESS') {
                onNewDepartamento(newDepartamento);
                setDescriptionDepartamento('');
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
                toast.error('Error desconocido al crear el Departamento.', {
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
                    Nombre <span className="text-meta-1">*</span>
                </label>
                <input
                    type="text"
                    value={descriptionDepartamento}
                    onChange={(e) => {
                        setDescriptionDepartamento(e.target.value);
                        setIsTouched(false);
                    }}
                    onBlur={() => setIsTouched(true)}
                    placeholder="Departamento"
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${isTouched && !descriptionDepartamento.trim() ? 'border-red-500' : ''}`}
                    required
                />
                {isTouched && !descriptionDepartamento.trim() && (
                    <p className="text-red-500 mt-1">El Nombre es obligatorio.</p>
                )}
            </div>
            <div className="flex justify-end gap-4.5">
                <button
                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    type="button"
                    onClick={() => {
                        setDescriptionDepartamento('');
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

export default DepartamentoForm;
