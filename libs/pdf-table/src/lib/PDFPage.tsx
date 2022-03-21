import ReactPDF, { StyleSheet, Font, Page } from '@react-pdf/renderer';
import { FC, ReactNode } from 'react';

// Register font

// Reference font
const styles = StyleSheet.create({});

interface IProps extends ReactPDF.PageProps {
  children: ReactNode;
}

export const PDFPage: FC<IProps> = ({ children, size }) => {
  return <Page size={size}>{children}</Page>;
};
// declare const PDFPage: typeof ReactPDF.Page;

// export { PDFPage };
