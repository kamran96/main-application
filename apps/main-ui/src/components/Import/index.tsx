import React, { FC } from "react";
import { useHttp } from "./useHttp";
import { Card, Upload, Button } from "antd";
import styled from "styled-components";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import CommonModal from "../Modal";
import convertToRem from "../../utils/convertToRem";
import deleteIcon from "@iconify/icons-carbon/delete";
import { Icon } from "@iconify/react";

export const Import: FC = () => {
  const { http } = useHttp();
  const [csvData, setCsvData] = useState({
    columns: [],
    data: [],
  });
  const [csvDataModal, setCsvDataModal] = useState(false);

  const props = {
    beforeUpload: (file) => {
      console.log(file);
      let reader = new FileReader();
      reader?.readAsText(file);

      reader.onload = function (event: any) {
        let csv = event?.target?.result.split("\r\n");
        let accessors: any[] = csv[0]
          ?.split(",")
          .map((item) => item?.split(" ").join("_"));
        csv?.splice(0, 1);
        let _data = [];

        csv?.forEach((item, index) => {
          let obj: any = {};
          item?.split(",")?.forEach((dataItem: any, dataIndex: number) => {
            obj = {
              ...obj,
              [accessors[dataIndex]]: dataItem,
            };
          });

          _data?.push(obj);
        });

        setCsvData({ data: _data, columns: accessors });
        setCsvDataModal(true);
      };
      return false;
    },
    maxCount: 1,
  };

  return (
    <Wrapper>
      <Card className="flex alignCenter justifyCenter _card">
        <div className="textCenter">
          <i className="upload_illustration">
            <InboxOutlined />
          </i>
          <p className="ant-upload-text ">
            No file is selected. Please select file and upload the CSV file.
            <ul className="textLeft">
              <li>We’re supporting templates from Xero, and QB.</li>
              <li> We have our own template to download.</li>
            </ul>
          </p>
          <Upload {...props}>
            <Button type="primary">Select File</Button>
          </Upload>
        </div>
      </Card>
      <CommonModal
        title={"Preview Data"}
        footer={false}
        visible={csvDataModal}
        width={1300}
        onCancel={() => setCsvDataModal(false)}
      >
        <ModalWrapper>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                {csvData?.columns?.map((head, index) => (
                  <th key={index}>{head?.split("_").join(" ")}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {csvData?.data?.map((dataItem, dataIndex) => (
                <tr key={dataIndex}>
                  {csvData?.columns?.map((head, index) => (
                    <td key={index}>{dataItem[head]}</td>
                  ))}
                  <td>
                    <i
                      className="delete_icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        e?.preventDefault();
                        setCsvData((prev) => {
                          let data = [...prev?.data];
                          data?.splice(dataIndex, 1);
                          return { ...prev, data };
                        });
                      }}
                    >
                      <Icon icon={deleteIcon} />
                    </i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalWrapper>
      </CommonModal>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ._card {
    min-height: 600px;

    .upload_illustration svg {
      font-size: 40px;
      color: #1890ff;
    }
  }
`;

const ModalWrapper = styled.div`
  table thead tr th {
    padding: ${convertToRem(5)} 0 ${convertToRem(5)} ${convertToRem(15)};
    border: 1px solid #3333;
    background: #143c69;
    color: white;
  }
  table tbody tr td {
    padding: ${convertToRem(5)} 0 ${convertToRem(5)} ${convertToRem(15)};
    border: 1px solid #3333;
  }
  table tbody tr:nth-child(even) td {
    background: #f7f7f7;
  }

  .delete_icon {
    font-size: 15px;
    cursor: pointer;
  }
`;
