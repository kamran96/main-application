import ReactPDF, { StyleSheet, Font, Page, View } from '@react-pdf/renderer';
import { FC, ReactNode } from 'react';
import thin from '../../assets/fonts/RobotoSlab-Thin.ttf';
import black from '../../assets/fonts/RobotoSlab-Black.ttf';
import bold from '../../assets/fonts/RobotoSlab-Bold.ttf';
import extraBold from '../../assets/fonts/RobotoSlab-ExtraBold.ttf';
import extraLight from '../../assets/fonts/RobotoSlab-ExtraLight.ttf';
import light from '../../assets/fonts/RobotoSlab-Light.ttf';
import medium from '../../assets/fonts/RobotoSlab-Light.ttf';
import regular from '../../assets/fonts/RobotoSlab-Regular.ttf';
import semiBold from '../../assets/fonts/RobotoSlab-SemiBold.ttf';

// Register font
Font.register({
  family: 'Roboto Slab',
  src: regular,
});

// Reference font
const styles = StyleSheet.create({
  pdfPage: {
    fontFamily: 'Roboto Slab',
  },
});

interface IProps extends ReactPDF.PageProps {
  children: ReactNode;
}

export const PDFPage: FC<IProps> = ({ children, size }) => {
  return (
    <Page size={size}>
      <View style={styles.pdfPage}>{children}</View>
    </Page>
  );
};
// declare const PDFPage: typeof ReactPDF.Page;

// export { PDFPage };
