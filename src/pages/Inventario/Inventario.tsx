import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEdit, faFileExcel, faFilePdf, faSave, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { pdf } from '@react-pdf/renderer';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import '../../css/grids.css';
import Modal from '../../components/Modal/ModalComponent';
import InventarioForm from './InventarioForm';
import InventarioFormUpdate from './InventarioFormUpdate';
import { InventarioModel } from '../../models/inventarioModel';
import LoadComponent from '../../components/Load/LoadComponent';
import { formatFecha, generateExcelReportsMaster } from '../../utils/utils';
import InventarioFormDelete from './InventarioFormDelete';
import { convertImageToBase64, MyDocument } from '../../hooks/usePDFCrudsDocument';
import Logo from '../../images/logo/logo_app.png';
import { getInventarios } from '../../services/inventarioService/InventarioService';

const TABS = [
  { label: 'Todos', value: 'all' },
  { label: 'Activos', value: 'active' },
  { label: 'Inactivos', value: 'inactive' }
];

const Inventario: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [inventarios, setInventarios] = useState<InventarioModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedInventario, setSelectedInventario] = useState<InventarioModel | null>(null);

  // IMPRESIÓN PDF //
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingXLSX, setIsGeneratingXLSX] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openUpdateModal = (inventario: InventarioModel) => {
    setSelectedInventario(inventario);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedInventario(null);
  };

  const openDeleteModal = (inventario: InventarioModel) => {
    setSelectedInventario(inventario);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedInventario(null);
  };

  const fetchInventarios = async () => {
    try {
      const result = await getInventarios();
      console.log(result)
      setInventarios(result);
    } catch (error) {
      console.error('Error al obtener los Registros:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventarios();
  }, []);

  const handleNewInventario = async () => {
    await fetchInventarios();
  };

  const handleUpdateInventario = async () => {
    await fetchInventarios();
    closeUpdateModal();
  };

  const handleDeleteInventario = async () => {
    await fetchInventarios();
    closeDeleteModal();
  };

  const filteredInventarios = inventarios.filter((inventario) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return inventario.ESTADO === 'A';
    if (activeTab === 'inactive') return inventario.ESTADO === 'I';
    return true;
  });

  const columnDefs: ColDef<InventarioModel>[] = [
    { field: 'CODIGO_INVENTARIO', headerName: 'CÓDIGO', filter: true, wrapHeaderText: true },
    { field: 'MARCA', headerName: 'MARCA', filter: true, wrapHeaderText: true},
    { field: 'NOMBRE_RESPONSABLE', headerName: 'RESPONSABLE', filter: true, wrapHeaderText: true},
    { field: 'NOMBRE_DEPARTAMENTO', headerName: 'DEPARTAMENTO', filter: true, wrapHeaderText: true },
    { field: 'NOMBRE_TIPO_EQUIPO', headerName: 'TIPO EQUIPO', filter: true, wrapHeaderText: true },
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
    { field: 'FECHA_INGRESO_INVENTARIO', headerName: 'FECHA INGRESO', valueFormatter: (params) => formatFecha(params.value), wrapHeaderText: true },
    { field: 'FECHA_ASIGNACION', headerName: 'FECHA ASIGNACIÓN', valueFormatter: (params) => formatFecha(params.value), wrapHeaderText: true },
    {
      headerName: 'ACCIONES',
      cellRenderer: (params: { data: InventarioModel }) => (
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

  const formattedData = inventarios.map(inventario => {
    return {
      CODIGO_INVENTARIO: {
        value: inventario.CODIGO_INVENTARIO,
        description: "CÓDIGO DE INVENTARIO"
      },
      NOMBRE_RESPONSABLE: {
        value: inventario.NOMBRE_RESPONSABLE || "SIN RESPONSABLE",
        description: "NOMBRE DEL RESPONSABLE"
      },
      NOMBRE_DEPARTAMENTO: {
        value: inventario.NOMBRE_DEPARTAMENTO,
        description: "DEPARTAMENTO"
      },
      NOMBRE_TIPO_EQUIPO: {
        value: inventario.NOMBRE_TIPO_EQUIPO,
        description: "TIPO DE EQUIPO"
      },
      FECHA_ASIGNACION: {
        value: inventario.FECHA_ASIGNACION ? formatFecha(inventario.FECHA_ASIGNACION) : "SIN FECHA",
        description: "FECHA DE ASIGNACIÓN"
      },
      FECHA_INGRESO_INVENTARIO: {
        value: inventario.FECHA_INGRESO_INVENTARIO ? formatFecha(inventario.FECHA_INGRESO_INVENTARIO) : "SIN FECHA",
        description: "FECHA DE INGRESO"
      },
      ESTADO: {
        value: inventario.ESTADO === 'A' ? 'ACTIVO' : 'INACTIVO',
        description: "ESTADO"
      },
      MARCA: {
        value: inventario.MARCA,
        description: "MARCA"
      },
    };
  });


  const handlePrint = async () => {
    setIsGeneratingPDF(true);
    try {
      const logoBase64 = await convertImageToBase64(Logo);
      const document = <MyDocument logoBase64={logoBase64 || ""} title="Control Inventario" data={formattedData} />;
      const pdfBlob = await pdf(document).toBlob();
      const url = URL.createObjectURL(pdfBlob);

      const link = (window.document as Document).createElement('a');
      link.href = url;
      link.download = 'control_inventario.pdf';
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
          value : 'CÓDIGO',
          position : 2
        },
        {
          value : 'MARCA',
          position : 3
        },
        {
          value : 'NOMBRE RESPONSABLE',
          position : 4
        },
        {
          value : 'DEPARTAMENTO',
          position : 5
        },
        {
          value : 'TIPO EQUIPO',
          position : 6
        },
        {
          value : 'ESTADO',
          position : 7
        },
        {
          value : 'FECHA ASIGNACIÓN',
          position : 8
        },
        {
          value : 'FECHA INGRESO',
          position : 9
        }
      ];
      const formattedData = inventarios.map(inventario => {
        return {
          CODIGO: inventario.CODIGO_INVENTARIO,
          MARCA: inventario.MARCA,
          NOMBRE_RESPONSABLE: inventario.NOMBRE_RESPONSABLE,
          NOMBRE_DEPARTAMENTO: inventario.NOMBRE_DEPARTAMENTO,
          NOMBRE_TIPO_EQUIPO: inventario.NOMBRE_TIPO_EQUIPO,
          ESTADO: inventario.ESTADO === 'A' ? 'ACTIVO' : 'INACTIVO',
          FECHA_ASIGNACION: formatFecha(inventario.FECHA_ASIGNACION || null),
          FECHA_INGRESO: formatFecha(inventario.FECHA_INGRESO_INVENTARIO || null),
        };
      });
        
      generateExcelReportsMaster('Control de Inventario', headers, formattedData)
    } catch (error) {
        console.error("Error generating EXCEL:", error);
    } finally {
      setIsGeneratingXLSX(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Control de Inventario" />

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
              rowData={filteredInventarios.filter(inventario =>
                inventario.CODIGO_INVENTARIO.toLowerCase().includes(searchText.toLowerCase())
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
        title="Agregar Registro"
        content={<InventarioForm closeModal={closeModal} onNewInventario={handleNewInventario} />}
        onClose={closeModal}
      />

      <Modal
        isOpen={isUpdateModalOpen}
        title="Editar Registro"
        content={
          <InventarioFormUpdate
            closeModal={closeUpdateModal}
            onNewInventario={handleUpdateInventario}
            inventario={selectedInventario}
          />
        }
        onClose={closeUpdateModal}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        title="Eliminar Registro"
        content={
          <InventarioFormDelete
            closeModal={closeDeleteModal}
            onNewInventario={handleDeleteInventario}
            inventario={selectedInventario}
          />
        }
        onClose={closeDeleteModal}
      />  
    </>
  );
};

export default Inventario;
