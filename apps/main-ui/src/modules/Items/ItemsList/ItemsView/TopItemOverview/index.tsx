import React, { FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { getTopRunningItemsAPI } from '../../../../../api';
import { ITopRunningItems } from '../../../../../modal/items';

export const TopItemsOverview: FC = () => {
  const [topRunningItems, setTopRunningItems] = useState<ITopRunningItems[]>(
    []
  );
  const { data: topRunningItemsData, isLoading: topRunningItemsLoading } =
    useQuery([`top-running-items`], getTopRunningItemsAPI);

  /* component did mount */
  useEffect(() => {
    if (topRunningItemsData?.data?.result) {
      const { result } = topRunningItemsData.data;
      setTopRunningItems(result);
    }
  }, [topRunningItemsData]);

  return (
    <WrapperTopItems>
      <table>
        <thead>
          <tr>
            {[
              '#',
              'Item Name',
              'Purchase Price',
              'Sell price',
              'Category',
              'Status',
            ].map((head, index) => {
              return <th key={index}>{head}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {topRunningItems &&
            topRunningItems.length &&
            topRunningItems.map((item, index) => {
              return (
                <tr key={index} className="mr-10 pv-10">
                  <td>{index + 1}</td>
                  <td>
                    <Link to="">{item.item_name}</Link>
                  </td>
                  <td>{item.purchase_price}</td>
                  <td>{item.sale_price}</td>
                  <td>{item.category_name}</td>
                  <td>
                    {item.status && item.status === 1 ? 'Active' : 'Deactive'}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </WrapperTopItems>
  );
};

const WrapperTopItems = styled.div`
  overflow-x: auto;
  table {
    width: 100%;
    thead > tr > th {
      color: #143c69;
      padding-top: 19px;
      padding-right: 50px;
      padding-left: 12px;
    }
    tbody > tr > td {
      padding-top: 18px;
      padding-right: 50px;
      padding-left: 13px;
    }
  }
`;
