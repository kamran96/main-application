import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import TestImage from '../../../../apps/main-ui/src/assets/xero.png';

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#F7FBFF',
    display: 'flex',
    padding: '30px 32px',
    flexDirection: 'row',
  },
  mainInfo: {
    flex: 7,
    display: 'flex',
    flexDirection: 'row',
  },
  logo: {
    height: 50,
    width: 50,
  },
  titleArea: {
    paddingLeft: '10px',
  },
  title: {
    color: '#143C69',
    fontSize: '24px',
    fontWeight: 800,
  },
  addressArea: {
    flex: 5,
    textAlign: 'right',
  },
  adderssAndInfo: {
    color: '#6F6F84',
    fontSize: '10',
    fontWeight: 400,
    paddingTop: '3px',
  },
});

export const PDFHeader = () => {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.mainInfo}>
        <Image style={styles.logo} src={TestImage} />
        <View style={styles.titleArea}>
          <Text style={styles.title}>Red Software</Text>
          <View>
            <Text style={styles.adderssAndInfo}>23782-2323-2323-</Text>
            <Text style={styles.adderssAndInfo}>23782-2323-2323-</Text>
            <Text style={styles.adderssAndInfo}>23782-2323-2323-</Text>
          </View>
        </View>
      </View>
      <View style={styles.addressArea}>
        <Text style={styles.adderssAndInfo}>4945 Forest Avenue</Text>
        <Text style={styles.adderssAndInfo}>New York</Text>
        <Text style={styles.adderssAndInfo}>10004</Text>
        <Text style={styles.adderssAndInfo}>United States</Text>
      </View>
    </View>
  );
};
