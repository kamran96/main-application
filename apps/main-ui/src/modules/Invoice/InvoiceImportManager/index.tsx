interface IProps {
  onLoad: (payload: any) => void;
  headers: string[];
}

export const InvoiceImportManager = ({ onLoad, headers }: IProps) => {
  const obj_csv = {
    size: 0,
    dataFile: [],
  };
  function readDocument(e) {
    const input = e.target;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.readAsBinaryString(input.files[0]);
      reader.onload = function (e) {
        obj_csv.size = e.total;
        obj_csv.dataFile = e.target.result as any;

        parseData(obj_csv.dataFile);
      };
    }
  }
  //   slkdfjos,sdfjoasdif,sdfsadfsadf,sdfsadfa,
  //   asdfkaodf.sdfsdfa.sdfsdfsafd.sdfadfasdf

  // 1. break on \n
  // 2 take array 1 as accessors
  // 3 loop from array 2

  // [itemname, amount, price, tax, total]
  // [milk, 1, 1.5, 0.2, 1.7]

  function parseData(data) {
    const csvData = []; // array of objects
    const string = data.replace('\r', '');
    const lbreak = string.split('\n');
    const accessors = lbreak[0].split(',');
    console.log(accessors, 'accessors');

    for (let i = 1; i < lbreak.length; i++) {
      const obj = {};
      lbreak[i].split(',').forEach((item, index) => {
        obj[accessors[index]] = `${item.replace('\r', '')}`;
      });
      csvData.push(obj);
    }

    // lbreak.forEach((res) => {
    //   csvData.push(res.split(','));
    // });
    onLoad(csvData);
  }
  return <input type="file" onChange={readDocument} />;
};
