import ReactPDF, { StyleSheet, Font, Page } from '@react-pdf/renderer';
import { FC, ReactNode } from 'react';

// Register font
Font.register({
  family: 'Roboto Slab',
  src: 'https://fonts.gstatic.com/s/robotoslab/v22/BngMUXZYTXPIvIBgJJSb6ufA5qWr4xCCQ_k.woff2',
});

// Reference font
const styles = StyleSheet.create({
  pdfPage: {
    // fontFamily: 'Roboto Slab',
  },
});

interface IProps extends ReactPDF.PageProps {
  children: ReactNode;
}

export const PDFPage: FC<IProps> = ({ children, size }) => {
  return (
    <Page size={size} style={styles.pdfPage}>
      {children}
    </Page>
  );
};
// declare const PDFPage: typeof ReactPDF.Page;

// export { PDFPage };
