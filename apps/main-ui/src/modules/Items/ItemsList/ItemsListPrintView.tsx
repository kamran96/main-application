import { ColumnsType } from "antd/es/table";
import React, { FC } from "react";
import styled from "styled-components";
import { PrintHeader } from "../../../components/PrintHeader";
import { IItemsResult } from "../../../modal/items";
import moneyFormat from "../../../utils/moneyFormat";

interface IProps {
  columns?: ColumnsType<any>;
  data?: IItemsResult[];
}

export const ItemsPrintView: FC<IProps> = ({ data }) => {
  return (
    <WrapperItemsPrintView>
      <div className="table">
        <PrintHeader />
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Code</th>
              <th>Purchase Price</th>
              <th>Sale Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: IItemsResult, index: number) => {
              let { price } = item;
              let purchasePrice = price && price.purchasePrice;
              let salesPrice = price && price.salePrice;
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    {item.code} / {item.name}
                  </td>
                  <td>{item.category.title}</td>
                  <td>{item.code}</td>
                  <td>{purchasePrice ? moneyFormat(purchasePrice) : "-"}</td>
                  <td>{salesPrice ? moneyFormat(salesPrice) : "-"}</td>
                  <td>{item.stock}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </WrapperItemsPrintView>
  );
};

const WrapperItemsPrintView = styled.div`
  table {
    width: 100%;
    border: 1px solid #333;
    /* padding: 5px; */
    border-spacing: 2px 2px;

    thead {
      tr {
        border: 1px solid #333;
        background: #dadada;
        th {
          font-size: 11px;
          padding: 4px 3px 4px 8px;
          border: 1px solid #333;
        }
      }
    }
    tbody {
      tr {
        td {
          font-size: 11px;
          padding: 4px 3px 4px 8px;
          border: 1px solid #333;
          white-space: nowrap;
        }
      }
    }
  }
`;
