
import { ITableProps } from './types';
import { View, StyleSheet, Text, Font } from '@react-pdf/renderer';
import f1 from './fonts/RobotoSlab-Bold.ttf';

/* eslint-disable-next-line */

export function PdfTable({ data, columns }: ITableProps) {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeadersGroup}>
        {columns.map((column, index) => {
          return (
            <Text style={{ ...styles.th, width: 200 }}>{column.title}</Text>
          );
        })}
      </View>
      <View style={styles.tableBody}>
        {data?.map((dataItem: any, dataIndex: number) => {
          return (
            <View style={styles.tableBodyRow}>
              {columns?.map((ci, cind) => {
                return (
                  <Text style={{ ...styles.td, width: 200 }}>
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
  );
}

const styles = StyleSheet.create({
  tableContainer: {},
  tableHeadersGroup: {
    flexDirection: 'row',
    borderBottomColor: '#a7a7a7',
    backgroundColor: '#16367a',
    borderBottomWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
  },
  th: {
    fontSize: '10px',
    fontWeight: 400,
    textTransform: 'capitalize',
    color: '#e6e6e6',
    textAlign: 'left',
    padding: '7px 7px',
  },
  tableBody: {},
  tableBodyRow: {
    flexDirection: 'row',
    borderBottomColor: '#cccccc',
    borderBottomWidth: '0.7px',
    alignItems: 'center',
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
  },
  td: {
    fontSize: '9px',
    fontWeight: 400,
    textTransform: 'capitalize',
    padding: '7px 7px',
    textAlign: 'left',
    color: '#363636',
  },
});

export default PdfTable;
