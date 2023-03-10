import styled from 'styled-components';
import bxSearchAlt from '@iconify/icons-bx/bx-search-alt';
import { Icon } from '@iconify/react';
import { CommonModal } from '@components';
import { useState } from 'react';
import deleteIcon from '@iconify/icons-carbon/delete';
interface IProps {
  onLoad: (payload: any, file?: File) => void;
  headers: string[];
}

export const InvoiceImportManager = ({ onLoad, headers }: IProps) => {
  const [fileData, setFileData] = useState<File>(null);
  const obj_csv = {
    size: 0,
    dataFile: [],
  };
  function readDocument(e) {
    const input = e.target;
    if (input?.files && input?.files[0]) {
      const reader = new FileReader();
      reader.readAsBinaryString(input.files[0]);
      reader.onload = function (e) {
        setFileData(input?.files[0]);
        obj_csv.size = e.total;
        obj_csv.dataFile = e.target.result as any;
        parseData(obj_csv.dataFile, input?.files[0]);
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

  function parseData(data, file) {
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
    onLoad(csvData, file);
  }
  return (
    <InputWrapper>
      <label className="InputLabel">
        {fileData ? fileData?.name : 'Choose file'}
      </label>
      {!fileData ? (
        <>
          <input
            type="file"
            id="upload"
            onChange={readDocument}
            className="InputField"
          />
          <Icon className="Icon" icon={bxSearchAlt} color="#2395e7" />
        </>
      ) : (
        <div
          onClick={(e) => {
            e.preventDefault();
            setFileData(null);
          }}
        >
          <Icon className="Icon" icon={deleteIcon} color="red" />
        </div>
      )}
    </InputWrapper>
  );
};

const InputWrapper = styled.div`
  display: flex;
  position: relative;

  label {
    display: inline-block;
    color: #2395e7;
    padding: 0.5rem;
    font-family: inherit;
    border-radius: 0.2rem;
    cursor: pointer;
    margin: 0 0 1.5rem 1rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .InputField {
    position: absolute;
    opacity: 0;
  }

  .Icon {
    font-size: 1rem;
    position: absolute;
    top: 14px;
  }
`;
