export const InvoiceImportManager = ({ onLoad }) => {
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

        console.log(obj_csv, 'obj_csv');

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
    for (let i = 1; i < lbreak.length; i++) {
      const obj = {};
      lbreak[i].split(',').forEach((item, index) => {
        console.log(accessors[index], item, 'why item');
        obj[
          accessors[index]
            ?.split(' ')
            .map((key, index) => {
              if (index === 0) {
                return key.toLowerCase();
              } else {
                return key.charAt(0).toUpperCase() + key.slice(1);
              }
            })
            .join('')
        ] = `${item.replace('\r', '')}`;
      });
      csvData.push(obj);
    }

    console.log(csvData, 'csvData');
    // lbreak.forEach((res) => {
    //   csvData.push(res.split(','));
    // });
    onLoad(csvData);
    // console.table(csvData);
  }
  return <input type="file" onChange={readImage} />;
};
