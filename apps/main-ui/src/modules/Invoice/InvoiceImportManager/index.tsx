export const InvoiceImportManager = () => {
  const obj_csv = {
    size: 0,
    dataFile: [],
  };
  function readImage(e) {
    const input = e.target;
    console.log(e?.target?.files[0], 'input');
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.readAsBinaryString(input.files[0]);
      reader.onload = function (e) {
        console.log(e);
        obj_csv.size = e.total;
        obj_csv.dataFile = e.target.result as any;
        console.log(obj_csv.dataFile);
        parseData(obj_csv.dataFile);
      };
    }
  }

  function parseData(data) {
    const csvData = [];
    const lbreak = data.split('\n');
    lbreak.forEach((res) => {
      csvData.push(res.split(','));
    });
    console.table(csvData);
  }
  return <input type="file" onChange={readImage} />;
};
