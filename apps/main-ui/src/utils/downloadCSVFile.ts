type IChildRow = string[];

export const downloadCSV = (rows: IChildRow[]) => {
  const csvContent =
    'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');

  const encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
};
