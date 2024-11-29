import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: 'Helvetica',
    },
    line_signature: {
        width: '30%',
        height: 1,
        backgroundColor: '#000',
        marginHorizontal: 'auto',
        marginBottom: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#283A1B',
        borderBottom: '1px solid #EAEAEA',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 29,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    logo: {
        width: 60,
        height: 60,
    },
    body: {
        marginTop: 20,
    },
    circle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#283A1B',
        backgroundColor: '#283A1B',
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        marginVertical: 10,
    },
    yesHeader: {
        color: '#4CAF50',
    },
    noHeader: {
        color: '#F44336',
    },
    tbody: {
        fontSize: 10,
        paddingTop: 4,
        paddingLeft: 7,
        flex: 1,
        borderColor: 'whitesmoke',
        borderRightWidth: 1,
        borderBottomWidth: 1,
    },
    tbody2: {
        flex: 2,
        borderRightWidth: 0,
        borderBottomWidth: 1,
    },
    signature: {
        position: 'absolute',
        bottom: 100,
        width: '100%',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
    },
    signatureContainer: {
        position: 'absolute',
        bottom: 130,
        width: '100%',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        textAlign: 'right',
        fontSize: 10,
        color: '#555555',
    },
    headerText: {
        flexWrap: 'wrap', // Asegura que el texto se envuelva
        textAlign: 'center', // Asegura que el texto esté centrado si es necesario
        flexGrow: 1, // Permite que el texto ocupe el espacio disponible
        flexShrink: 1, // Permite que el texto se ajuste sin ser truncado
        margin: 0, // Elimina cualquier margen que pueda causar truncamiento
        padding: 2, // Ajusta el padding para dar más espacio interno al texto
        whiteSpace: 'normal', // Evita que el texto se expanda en la celda
    },
    theader: {
        marginTop: 20,
        fontSize: 11,
        fontWeight: 'bold', // Usa fontWeight en lugar de fontStyle para negrita
        paddingTop: 4,
        paddingLeft: 7,
        flex: 1,
        backgroundColor: '#DEDEDE',
        borderColor: 'whitesmoke',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        minWidth: 50, // Asegura que haya un ancho mínimo suficiente
        maxWidth: 200, // Ajusta según el tamaño del texto esperado
        flexGrow: 1, // Permite que la celda crezca si es necesario
        flexShrink: 1, // Permite que la celda se ajuste sin truncamiento
        height: 'auto', // Deja que la altura sea automática
    }
    
    
});

interface MyDocumentProps {
    logoBase64: string;
    title: string;
    data: Record<string, any>[];
}

const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
};

export const MyDocument = ({ logoBase64, title, data }: MyDocumentProps) => {
    const headers = data.length > 0
  ? Object.keys(data[0]) // Obtener las claves originales
  : [];

return (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{title}</Text>
          <Image style={styles.logo} src={logoBase64} />
        </View>
      </View>

      <View style={styles.body}>
        <Text>Datos Registrados</Text>
        <View style={styles.line} />

        {/* Renderizado de encabezados con las descripciones */}
        <View style={{ width: '100%', flexDirection: 'row', marginTop: 10, paddingVertical: 8 }}>
          {headers
            .filter(header => !header.includes('ID'))
            .map((header, index) => (
              <View key={index} style={[styles.theader, { justifyContent: 'center' }]}>
                {/* Mostrar la descripción en lugar de la clave */}
                <Text style={styles.headerText}>{data[0][header].description}</Text>
              </View>
            ))}
        </View>

        {/* Renderizado de datos en cada fila */}
        {data.map((item, index) => (
          <View key={index} style={{ width: '100%', flexDirection: 'row' }}>
            {headers
              .filter(header => !header.includes('ID'))
              .map((header, idx) => (
                <View key={idx} style={styles.tbody}>
                  <Text style={styles.headerText}>{item[header]?.value}</Text>
                </View>
              ))}
          </View>
        ))}

      </View>

      <View style={styles.footer}>
        <Text>Fecha y Hora de Generación: {getCurrentDateTime()}</Text>
      </View>
    </Page>
  </Document>
);
};

export const convertImageToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};
