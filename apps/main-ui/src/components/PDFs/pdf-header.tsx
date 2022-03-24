import { FC } from 'react';
import { View, Text, StyleSheet, Image, Font } from '@react-pdf/renderer';

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
    fontWeight: 'heavy',
  },
  title: {
    color: '#143C69',
    fontSize: '24px',
    fontWeight: 'heavy',
    textTransform: 'capitalize',
  },
  addressArea: {
    flex: 5,
    textAlign: 'right',
  },
  adderssAndInfo: {
    color: '#6F6F84',
    fontSize: '10',
    paddingTop: '3px',
    fontWeight: 'ultrabold',
    textTransform: 'capitalize',
  },
  adderssAndInfo2: {
    color: '#6F6F84',
    fontSize: '10',
    paddingTop: '3px',
    fontWeight: 'ultrabold',
  },

  pdfTitleWrapper: {
    padding: '10px 20px',
  },
  pdfTitle: {
    fontWeight: 'black',
    color: '#143C69',
    fontSize: '16px',
    textTransform: 'capitalize',
  },
});

interface IPropsHeader {
  title?: string;
  organizationName?: string;
  organizationEmail?: string;
  organizationContact?: string;
  website?: string;
  address?: string;
  city?: string;
  code?: string | number;
  country?: string;
  logo?: string;
}

export const PDFHeader: FC<IPropsHeader> = ({
  title,
  organizationContact,
  organizationEmail,
  organizationName,
  website,
  address,
  city,
  code,
  logo,
  country,
}) => {
  return (
    <View>
      <View style={styles.headerWrapper}>
        <View style={styles.mainInfo}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.titleArea}>
            <Text style={styles.title}>{organizationName}</Text>
            <View>
              {organizationContact && (
                <Text style={styles.adderssAndInfo2}>
                  {organizationContact}
                </Text>
              )}
              {organizationEmail && (
                <Text style={styles.adderssAndInfo2}>{organizationEmail}</Text>
              )}
              {website && <Text style={styles.adderssAndInfo2}>{website}</Text>}
            </View>
          </View>
        </View>
        <View style={styles.addressArea}>
          <Text style={styles.adderssAndInfo}>{address}</Text>
          <Text style={styles.adderssAndInfo}>{city}</Text>
          <Text style={styles.adderssAndInfo}>{code}</Text>
          <Text style={styles.adderssAndInfo}>{country}</Text>
        </View>
      </View>
      {title ? (
        <View style={styles.pdfTitleWrapper}>
          <Text style={styles.pdfTitle}>{title}</Text>
        </View>
      ) : null}
    </View>
  );
};
