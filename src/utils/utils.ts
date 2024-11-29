import ExcelJS from 'exceljs';
import LogoIcon from '../images/logo/logo_app.png';

export const formatFecha = (fecha: string | null): string => {
  if (!fecha) return '';

  const date = new Date(fecha);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const border: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' as ExcelJS.BorderStyle, color: { argb: '000000' } },
  bottom: { style: 'thin' as ExcelJS.BorderStyle, color: { argb: '000000' } },
  left: { style: 'thin' as ExcelJS.BorderStyle, color: { argb: '000000' } },
  right: { style: 'thin' as ExcelJS.BorderStyle, color: { argb: '000000' } },
};

const borderReport : Partial<ExcelJS.Borders> =
{
    right: { style: 'thin' as ExcelJS.BorderStyle, color: { argb: '000000' } },
};


export const generateExcelReports = async (title: string, headersReport : any[], dataExportExcel : any []) => {
  const workbook = new ExcelJS.Workbook();
  let worksheet = workbook.addWorksheet(`REPORTE DE ${title.toUpperCase()}`);

  // SET COLUMNS WIDTH
  let anchos = {
    incicial : 5,
    nombre: 25,
    estado: 15,
    fechas: 27,
  };

  const dateNow = new Date();
  worksheet.getColumn("B").width = anchos.nombre;
  worksheet.getColumn("C").width = anchos.estado;
  worksheet.getColumn("D").width = anchos.fechas;


  const headerRow1 = worksheet.getRow(1);
  const logoBase64 = await convertToBase64();

  let imageId = workbook.addImage({
    base64: logoBase64.split(',')[1], 
    extension: 'png',
  });
  
  worksheet.addImage(imageId, {
    // @ts-expect-error Issue with ExcelJs types.
    tl: { col: 0, row: 0 },
    // @ts-expect-error Issue with ExcelJs types.
    br: { col: 1, row: 3 },
    width: 350,
    height: 350,
  });

  worksheet.mergeCells('B1:D1');
  Object.assign(headerRow1.getCell(2), {
    value: ` REPORTE DE ${title.toUpperCase()} `,
    alignment: { horizontal: 'left' },
    font: { size: 20, bold : true },
  });


  worksheet.views =
  [
    { state: 'frozen', ySplit: 4, topLeftCell: 'A5', activeCell: 'A5' }
  ];

  headersReport.map((header) => {
    const cell = worksheet.getRow(4).getCell(header.position);
    cell.value = header.value;
    cell.alignment = {horizontal: 'center', vertical: 'middle'};
    cell.fill = 
    {
        type : 'pattern',
        pattern : 'solid',
        fgColor : { argb : '000000' }
    };
    cell.font = 
    {
        color : { argb : 'FFFFFF', theme : 1 },
        bold : true,
        size : 17
    };
    cell.border = border;
  });

  let inicio = 5;
  const footerParameter = inicio + dataExportExcel.length + 3;
  const endReport = inicio + dataExportExcel.length;
  // Reporte
  const rightBorderPositions = [1, 4];

  dataExportExcel.forEach((row, index)=>
  {
      let numF = index + inicio;
      let rowExcel = worksheet.getRow(numF);

      // Setting Data //
      rowExcel.getCell(2).value = row.NOMBRE
      rowExcel.getCell(3).value = row.ESTADO
      rowExcel.getCell(4).value = row.FECHA_CREACION

      // // APLICANDO LOS COLORES RESPECTIVOS //
      applyFontColor(rowExcel.getCell(3), row.ESTADO);

      rightBorderPositions.map((column)=>
      {
          rowExcel.getCell(column).border = borderReport;
      });    
  });

  // PINTO LA LINEA DE MI ULTIMO DATO //
  const endLineReport = worksheet.getRow(endReport - 1);
  // @ts-ignore
  const { _cells } = endLineReport;
  // @ts-ignore
  _cells.map((elementCell) => {
    const { _address } = elementCell;
    const splitColum = _address.match(/\D+|\d+/g);
    const newAddress = `${splitColum[0]}${parseInt(splitColum[1]) + 1}`;
    if (!newAddress.includes('A')) {
        worksheet.getCell(newAddress).border = {
            top: { style: 'thin', color: { argb: '000000' } }
        };
    }
  });

  const numFooter = Math.max(footerParameter);

  const datePrint = `Fecha de Impresión: ${String(dateNow.getDate()).padStart(2,'0')}/${String(dateNow.getMonth()+1).padStart(2,'0')}/${dateNow.getFullYear()} ${String(dateNow.getHours()).padStart(2,'0')}:${String(dateNow.getMinutes()).padStart(2,'0')}:${String(dateNow.getSeconds()).padStart(2,'0')}`;
  worksheet.getRow(numFooter-1).getCell(2).value = datePrint;
  // @ts-ignore
  let startDate = worksheet.getRow(numFooter-1).getCell(2)._address;
  // @ts-ignore
  let endDate = worksheet.getRow(numFooter-1).getCell(4)._address;


  worksheet.mergeCells(startDate, endDate);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/\s+/g, '')}.xlsx`;
  link.click();
};


function applyFontColor(cell : any, value : any) 
{
    if (value === 'INACTIVO') 
    {
        cell.font = 
        {
            color: 
            {
                argb: 'FF0000',
                theme: 1,
            },
        };
    }
}

const convertToBase64 = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = () => reject("Error al cargar la imagen.");
    xhr.open("GET", LogoIcon);
    xhr.responseType = "blob";
    xhr.send();
  });
};

export const generateExcelReportsMaster = async (title: string, headersReport : any[], dataExportExcel : any []) => {
  const workbook = new ExcelJS.Workbook();
  let worksheet = workbook.addWorksheet(`REPORTE DE ${title.toUpperCase()}`);

  // SET COLUMNS WIDTH
  let anchos = {
    codigo : 15,
    marca: 25,
    responsable: 35,
    departamento: 35,
    tipo_equipo: 35,
    estado: 15,
    fechas: 27,
  };

  const dateNow = new Date();
  worksheet.getColumn("B").width = anchos.codigo;
  worksheet.getColumn("C").width = anchos.marca;
  worksheet.getColumn("D").width = anchos.responsable;
  worksheet.getColumn("E").width = anchos.departamento;
  worksheet.getColumn("F").width = anchos.tipo_equipo;
  worksheet.getColumn("G").width = anchos.estado;
  worksheet.getColumn("H").width = anchos.fechas;
  worksheet.getColumn("I").width = anchos.fechas;
  worksheet.getColumn("J").width = anchos.fechas;


  const headerRow1 = worksheet.getRow(1);
  const logoBase64 = await convertToBase64();

  let imageId = workbook.addImage({
    base64: logoBase64.split(',')[1], 
    extension: 'png',
  });
  
  worksheet.addImage(imageId, {
    // @ts-expect-error Issue with ExcelJs types.
    tl: { col: 0, row: 0 },
    // @ts-expect-error Issue with ExcelJs types.
    br: { col: 1, row: 3 },
    width: 350,
    height: 350,
  });

  worksheet.mergeCells('B1:J1');
  Object.assign(headerRow1.getCell(2), {
    value: ` REPORTE DE ${title.toUpperCase()} `,
    alignment: { horizontal: 'left' },
    font: { size: 20, bold : true },
  });


  worksheet.views =
  [
    { state: 'frozen', ySplit: 4, topLeftCell: 'A5', activeCell: 'A5' }
  ];

  headersReport.map((header) => {
    const cell = worksheet.getRow(4).getCell(header.position);
    cell.value = header.value;
    cell.alignment = {horizontal: 'center', vertical: 'middle'};
    cell.fill = 
    {
        type : 'pattern',
        pattern : 'solid',
        fgColor : { argb : '000000' }
    };
    cell.font = 
    {
        color : { argb : 'FFFFFF', theme : 1 },
        bold : true,
        size : 17
    };
    cell.border = border;
  });

  let inicio = 5;
  const footerParameter = inicio + dataExportExcel.length + 3;
  const endReport = inicio + dataExportExcel.length;
  // Reporte
  const rightBorderPositions = [1, 9];

  dataExportExcel.forEach((row, index)=>
  {
      let numF = index + inicio;
      let rowExcel = worksheet.getRow(numF);

      // Setting Data //
      rowExcel.getCell(2).value = row.CODIGO
      rowExcel.getCell(3).value = row.MARCA
      rowExcel.getCell(4).value = row.NOMBRE_RESPONSABLE
      rowExcel.getCell(5).value = row.NOMBRE_DEPARTAMENTO
      rowExcel.getCell(6).value = row.NOMBRE_TIPO_EQUIPO
      rowExcel.getCell(7).value = row.ESTADO
      rowExcel.getCell(8).value = row.FECHA_ASIGNACION
      rowExcel.getCell(9).value = row.FECHA_INGRESO

      // // APLICANDO LOS COLORES RESPECTIVOS //
      applyFontColor(rowExcel.getCell(7), row.ESTADO);

      rightBorderPositions.map((column)=>
      {
          rowExcel.getCell(column).border = borderReport;
      });    
  });

  // PINTO LA LINEA DE MI ULTIMO DATO //
  const endLineReport = worksheet.getRow(endReport - 1);
  // @ts-ignore
  const { _cells } = endLineReport;
  // @ts-ignore
  _cells.map((elementCell) => {
    const { _address } = elementCell;
    const splitColum = _address.match(/\D+|\d+/g);
    const newAddress = `${splitColum[0]}${parseInt(splitColum[1]) + 1}`;
    if (!newAddress.includes('A')) {
        worksheet.getCell(newAddress).border = {
            top: { style: 'thin', color: { argb: '000000' } }
        };
    }
  });

  const numFooter = Math.max(footerParameter);

  const datePrint = `Fecha de Impresión: ${String(dateNow.getDate()).padStart(2,'0')}/${String(dateNow.getMonth()+1).padStart(2,'0')}/${dateNow.getFullYear()} ${String(dateNow.getHours()).padStart(2,'0')}:${String(dateNow.getMinutes()).padStart(2,'0')}:${String(dateNow.getSeconds()).padStart(2,'0')}`;
  worksheet.getRow(numFooter-1).getCell(2).value = datePrint;
  // @ts-ignore
  let startDate = worksheet.getRow(numFooter-1).getCell(2)._address;
  // @ts-ignore
  let endDate = worksheet.getRow(numFooter-1).getCell(4)._address;


  worksheet.mergeCells(startDate, endDate);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/\s+/g, '')}.xlsx`;
  link.click();
};