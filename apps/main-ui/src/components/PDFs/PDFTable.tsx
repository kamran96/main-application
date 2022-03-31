import { View, StyleSheet, Text, Font } from '@react-pdf/renderer';
import { ReactNode } from 'react';
import { PDFFontWrapper } from './PDFFontWrapper';
// import f1 from './fonts/RobotoSlab-Bold.ttf';

export interface ITableColumns {
  title: string;
  dataIndex: string;
  key?: string;
  render?: (data: any, row: any, index: number) => ReactNode;
  width?: number;
}

export interface ITableProps {
  columns: ITableColumns[];
  data?: unknown[];
}

/* eslint-disable-next-line */

export function PDFTable({ data, columns }: ITableProps) {
  return (
    // <PDFFontWrapper>
    <View style={styles.tableContainer}>
      <View style={styles.tableHeadersGroup}>
        {columns.map((column, index) => {
          return (
            <Text
              key={index}
              style={{
                ...styles.th,
                width: column.width ? column.width : '100%',
              }}
            >
              {column.title}
            </Text>
          );
        })}
      </View>
      <View style={styles.tableBody}>
        {data?.map((dataItem: any, dataIndex: number) => {
          return (
            <View style={styles.tableBodyRow}>
              {columns?.map((ci, cind) => {
                return (
                  <Text
                    style={{
                      ...styles.td,
                      width: ci.width ? ci.width : '100%',
                    }}
                  >
                    {ci.render
                      ? ci.render(dataItem[ci.dataIndex], dataItem, dataIndex)
                      : dataItem[ci?.dataIndex]}
                  </Text>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
    // </PDFFontWrapper>
  );
}

const styles = StyleSheet.create({
  tableContainer: {},
  tableHeadersGroup: {
    flexDirection: 'row',
    borderBottomColor: '#a7a7a7',
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
  },
  th: {
    fontSize: '10px',
    textTransform: 'capitalize',
    color: 'rgba(0,0,0,.85)',
    textAlign: 'left',
    padding: '7px 7px',
    fontWeight: 'bold',
  },
  tableBody: {},
  tableBodyRow: {
    flexDirection: 'row',
    borderBottomColor: '#cccccc',
    borderBottomWidth: '0.7px',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'demibold',
    flexGrow: 1,
  },
  td: {
    fontSize: '9px',
    fontWeight: 500,
    textTransform: 'capitalize',
    padding: '7px 7px',
    textAlign: 'left',
    color: '#4b4b4b',
  },
});

export default PDFTable;
