import { Button } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Heading } from '../../../components/Heading';
import { H4 } from '../../../components/Typography';
import Dispatch from '../../../assets/Dispatch.png';
import { TableCard } from '../../../components/TableCard';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';

export const DispatchingWall: FC = () => {
  const { setDispatchConfigModal } = useGlobalContext();

  return (
    <WrapperDispatchWall>
      <Heading>Dispatching</Heading>
      <TableCard className="_dispatchingcard">
        <div className="flex _dcard ">
          <div className="dispatch_img">
            <img alt={''} src={Dispatch} />
          </div>
        </div>
        <div className="flex _dcard mt-10">
          <H4>Dispatching isn’t enabled.</H4>
        </div>
        <div className="flex _dcard mt-8">
          <text>Dispatching helps you send and receive inventory</text>
        </div>
        <div className="flex _dcard">
          <text>from other branches / outlets</text>
        </div>
        <div className="flex _dcard mt-10">
          <ol>
            <li className=" mt-8">
              Dispatching is beneficial when one of your stores is out of stock
              and you use inventory from another store.
            </li>
            <li className=" mt-8">
              When you want to keep track of the items you used in any of
              stores.
            </li>
            <li className=" mt-8">
              Monthly, daily, weekly, reports to help you discover which items
              are dispatched most and why.
            </li>
          </ol>
        </div>
        <div className="flex _dcard mt-35">
          <h5>Note: </h5>
          <p className="note">
            {' '}
            Using dispatching plugin is free with the current plan.
          </p>
        </div>
        <div className="flex _dcard mt-8">
          <Button
            onClick={() => setDispatchConfigModal(true)}
            className="enablebtn"
          >
            Enable Dispatch
          </Button>
        </div>
      </TableCard>
    </WrapperDispatchWall>
  );
};

const WrapperDispatchWall = styled.div`
  ._dispatchingcard {
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      width: 55vh;
      max-width: 100%;
      padding-bottom: 45px;
    }
    ._dcard {
      justify-content: center;
      width: 63vh;
      max-width: 100%;
      .note {
        font-size: smaller;
        padding-left: 2px;
      }
      .enablebtn {
        background: #1e5490;
        font-size: 12px;
        color: #ffffff;
      }
    }
  }
`;
