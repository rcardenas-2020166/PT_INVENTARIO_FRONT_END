import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEdit, faFileExcel, faFilePdf, faSave, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { pdf } from '@react-pdf/renderer';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import '../../../css/grids.css';
import Modal from '../../../components/Modal/ModalComponent';
import TipoEquipoForm from './TipoEquipoForm';
import TipoEquipoFormUpdate from './TipoEquipoFormUpdate';
import { TipoEquipoModel } from '../../../models/tipoEquipoModel';
import { getTipoEquipos } from '../../../services/tipoEquipoService/TipoEquipoService';
import LoadComponent from '../../../components/Load/LoadComponent';
import { formatFecha, generateExcelReports } from '../../../utils/utils';
import TipoEquipoFormDelete from './TipoEquipoFormDelete';
import { convertImageToBase64, MyDocument } from '../../../hooks/usePDFCrudsDocument';
import Logo from '../../../images/logo/logo_app.png';

const TABS = [
  { label: 'Todos', value: 'all' },
  { label: 'Activos', value: 'active' },
  { label: 'Inactivos', value: 'inactive' }
];

const TipoEquipo: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [tipoEquipos, setTipoEquipos] = useState<TipoEquipoModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedTipoEquipo, setSelectedTipoEquipo] = useState<TipoEquipoModel | null>(null);

  // IMPRESIÓN PDF //
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingXLSX, setIsGeneratingXLSX] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openUpdateModal = (tipoEquipo: TipoEquipoModel) => {
    setSelectedTipoEquipo(tipoEquipo);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedTipoEquipo(null);
  };

  const openDeleteModal = (tipoEquipo: TipoEquipoModel) => {
    setSelectedTipoEquipo(tipoEquipo);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedTipoEquipo(null);
  };

  const fetchTipoEquipos = async () => {
    try {
      const result = await getTipoEquipos();
      setTipoEquipos(result);
    } catch (error) {
      console.error('Error al obtener los Tipos de Equipo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipoEquipos();
  }, []);

  const handleNewTipoEquipo = async () => {
    await fetchTipoEquipos();
  };

  const handleUpdateTipoEquipo = async () => {
    await fetchTipoEquipos();
    closeUpdateModal();
  };

  const handleDeleteTipoEquipo = async () => {
    await fetchTipoEquipos();
    closeDeleteModal();
  };

  const filteredTipoEquipos = tipoEquipos.filter((tipoEquipo) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return tipoEquipo.ESTADO === 'A';
    if (activeTab === 'inactive') return tipoEquipo.ESTADO === 'I';
    return true;
  });

  const columnDefs: ColDef<TipoEquipoModel>[] = [
    {
        field: 'NOMBRE_TIPO_EQUIPO',
        headerName: '',
        cellRenderer: (params: { value: any; }) => (
            <div className="flex items-center justify-center mt-1 border border-stroke bg-green-700 w-8 h-8 rounded">
                <span className="font-semibold text-white">
                    {params.value.charAt(0).toUpperCase()}
                </span>
            </div>
        ),
    },
    { field: 'NOMBRE_TIPO_EQUIPO', headerName: 'NOMBRE', filter: true, wrapHeaderText: true },
    {
        field: 'ESTADO',
        headerName: 'ESTADO',
        cellRenderer: (params: { value: any }) => (
            <p
                className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${params.value === 'A'
                    ? 'bg-success text-success'
                    : 'bg-danger text-danger'
                }`}
            >
                {params.value === 'A' ? 'ACTIVO' : 'INACTIVO'}
            </p>
        )
    },
    { field: 'FECHA_CREACION', headerName: 'FECHA CREACIÓN', valueFormatter: (params) => formatFecha(params.value), wrapHeaderText: true },
    {
      headerName: 'ACCIONES',
      cellRenderer: (params: { data: TipoEquipoModel }) => (
          <div className="items-start">
              <button
                  title='Editar'
                  className='rounded-md py-1 px-3 mr-2 text-sm bg-warning text-white bg-opacity-90'
                  onClick={() => openUpdateModal(params.data)}
                  disabled={params.data.ESTADO === 'I'}
              >
                  <FontAwesomeIcon icon={faEdit} style={{ marginTop: '5px' }} />
              </button>
              <button
                  title='Eliminar'
                  className='rounded-md py-1 px-3 ml-2 text-sm bg-danger text-white bg-opacity-90'
                  onClick={() => openDeleteModal(params.data)}
                  disabled={params.data.ESTADO === 'I'}
              >
                  <FontAwesomeIcon icon={faTrash} style={{ marginTop: '5px' }} />
              </button>
          </div>
      )
  },
];
const formattedData = tipoEquipos.map(tipoEquipo => {
  return {
      NOMBRE_EQUIPO: { value: tipoEquipo.NOMBRE_TIPO_EQUIPO, description: "TIPO DE EQUIPO" },
      FECHA_CREACION: { value: formatFecha(tipoEquipo.FECHA_CREACION), description: "FECHA CREACIÓN" },
      ESTADO: { 
        value: tipoEquipo.ESTADO === 'A' ? 'ACTIVO' : 'INACTIVO',
        description: "ESTADO" 
      },  };
});

const handlePrint = async () => {
  setIsGeneratingPDF(true);
  try {
      const logoBase64 = await convertImageToBase64(Logo);
      const document = <MyDocument logoBase64={logoBase64 || ""}  title="Tipo de Equipo"  data={formattedData} />;
      const pdfBlob = await pdf(document).toBlob();
      const url = URL.createObjectURL(pdfBlob);

      const link = (window.document as Document).createElement('a');
      link.href = url;
      link.download = 'tipo_equipo.pdf';
      link.click();
  } catch (error) {
      console.error("Error generating PDF:", error);
  } finally {
      setIsGeneratingPDF(false);
  }
};

const handleExcel = async () => {
  setIsGeneratingXLSX(true);
  try {
    const headers = 
    [
      {
        value : 'NOMBRE EQUIPO',
        position : 2
      },
      {
        value : 'ESTADO',
        position : 3
      },
      {
        value : 'FECHA CREACIÓN',
        position : 4
      }
    ];
    const formattedData = tipoEquipos.map(tipoEquipo => {
      return {
          NOMBRE: tipoEquipo.NOMBRE_TIPO_EQUIPO,
          FECHA_CREACION: formatFecha(tipoEquipo.FECHA_CREACION),
          ESTADO: tipoEquipo.ESTADO === 'A' ? 'ACTIVO' : 'INACTIVO'
        };
    });    
    generateExcelReports('Tipo de Equipo', headers, formattedData)
  } catch (error) {
      console.error("Error generating EXCEL:", error);
  } finally {
    setIsGeneratingXLSX(false);
  }
};

  return (
    <>
      <Breadcrumb pageName="Tipo de Equipo" />

      <div className="mb-8 flex items-center justify-end gap-8">
        <button
          className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
          type="button"
          title='Agregar'
          onClick={openModal}
        >
          Agregar &nbsp;
          <FontAwesomeIcon icon={faSave} style={{ marginTop: '5px' }} />
        </button>

        <div className="relative">
          <button
            className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
            type="button"
            onClick={() => setOpen(!open)}
          >
            Descargar &nbsp;
            <FontAwesomeIcon icon={faDownload} style={{ marginTop: '5px' }} />
          </button>

          {open && (
            <div className="absolute dark:bg-boxdark dark:text-white right-0 mt-2 w-48 rounded-md bg-white  z-9999">
              <div className="py-1">
                <button
                                            disabled={isGeneratingPDF}
                                            onClick={handlePrint}

                className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Descargar PDF &nbsp;
                  {isGeneratingPDF ? <LoadComponent /> : <FontAwesomeIcon icon={faFilePdf} />}
                  </button>
                  <button
                                            disabled={isGeneratingXLSX}
                                            onClick={handleExcel}

                className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Descargar EXCEL &nbsp;
                  {isGeneratingXLSX ? <LoadComponent /> : <FontAwesomeIcon icon={faFileExcel} />}
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="w-full md:w-max flex gap-4 border-b-2 border-gray-200">
          {TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`relative py-2 px-4 transition-all duration-300 ${activeTab === value
                ? 'text-primary font-bold'
                : 'text-gray-600 hover:text-primary'
                }`}
            >
              {label}
              {activeTab === value && (
                <span className="absolute left-0 right-0 bottom-0 h-1 bg-primary rounded-t-lg animate-slideIn"></span>
              )}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="absolute right-4 top-4" />
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <LoadComponent />
        ) : (
          <div className="ag-theme-quartz" style={{ height: 400 }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={filteredTipoEquipos.filter(tipoEquipo =>
                tipoEquipo.NOMBRE_TIPO_EQUIPO.toLowerCase().includes(searchText.toLowerCase())
              )}
              pagination={true}
              paginationPageSize={10}
              defaultColDef={{
                sortable: true,
                resizable: false,
                flex: 1,
                minWidth: 100,
              }}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Agregar Tipo de Equipo"
        content={<TipoEquipoForm closeModal={closeModal} onNewTipoEquipo={handleNewTipoEquipo} />}
        onClose={closeModal}
      />

      <Modal
        isOpen={isUpdateModalOpen}
        title="Editar Tipo de Equipo"
        content={
          <TipoEquipoFormUpdate
            closeModal={closeUpdateModal}
            onNewTipoEquipo={handleUpdateTipoEquipo}
            tipoEquipo={selectedTipoEquipo}
          />
        }
        onClose={closeUpdateModal}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        title="Eliminar Tipo de Equipo"
        content={
          <TipoEquipoFormDelete
            closeModal={closeDeleteModal}
            onNewTipoEquipo={handleDeleteTipoEquipo}
            tipoEquipo={selectedTipoEquipo}
          />
        }
        onClose={closeDeleteModal}
      />  
    </>
  );
};

export default TipoEquipo;
