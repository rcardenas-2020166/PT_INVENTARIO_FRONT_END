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
  theader: {
    marginTop: 20,
    fontSize: 12,
    fontStyle: 'bold',
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    height: 30,
    backgroundColor: '#DEDEDE',
    borderColor: 'whitesmoke',
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  theader2: {
    flex: 2,
    borderRightWidth: 0,
    borderBottomWidth: 1,
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
  tbody2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },
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
});

interface Answer {
  questionString: string;
  answer: string;
}

interface MyDocumentProps {
  logoBase64: string;
  signatureBase64: string;
  answers: Record<string, Answer>;
}

const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString(); // Puedes ajustar el formato si es necesario
};

export const MyDocument = ({ logoBase64, signatureBase64, answers }: MyDocumentProps) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Orden de Servicio</Text>
          <Image style={styles.logo} src={logoBase64} />
        </View>
      </View>

      <View style={styles.body}>
        <Text>Constancia de Entrega</Text>
        <View style={styles.line} />
        <View style={{ width: '100%', flexDirection: 'row', marginTop: 10, paddingVertical: 8 }}>
          <View style={[styles.theader, styles.theader2, { justifyContent: 'center' }]}>
            <Text>Pregunta</Text>
          </View>
          <View style={{ textAlign: 'center', justifyContent: 'center', ...styles.theader }}>
            <Text>SÍ</Text>
          </View>
          <View style={{ textAlign: 'center', justifyContent: 'center', ...styles.theader }}>
            <Text>NO</Text>
          </View>
        </View>
        {Object.entries(answers).map(([_, { questionString, answer }]) => (
          <View key={questionString} style={{ width: '100%', flexDirection: 'row' }}>
            <View style={[styles.tbody, styles.tbody2]}>
              <Text>{questionString}</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', ...styles.tbody }}>
              {answer === 'Yes' && <View style={{ justifyContent: 'center', ...styles.circle }} />}
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', ...styles.tbody }}>
              {answer === 'No' && <View style={{ justifyContent: 'center', ...styles.circle }} />}
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.signatureContainer}>
        {signatureBase64 && <Image src={signatureBase64} style={{ width: 'auto', height: 50, marginBottom: 5 }} />}
        <View style={styles.line_signature} />
        <Text>Firma Enterado</Text>
      </View>

      <View style={styles.footer}>
        <Text>Fecha y Hora de Generación: {getCurrentDateTime()}</Text>
      </View>
    </Page>
  </Document>
);

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