import printIcon from '@iconify-icons/bytesize/print';
import { Col, Row } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';

import { CashActivityStatementAPI } from '../../../api';
import { ButtonTag } from '../../../components/ButtonTags';
import { BoldText } from '../../../components/Para/BoldText';
import { PrintFormat } from '../../../components/PrintFormat';
import {
  PrintHeaderFormat,
  TableDivisions,
} from '../../../components/PrintHeader';
import {
  Addressbar,
  TopbarLogoWithDetails,
} from '../../../components/PrintHeader/Formats';
import { SmartFilter } from '../../../components/SmartFilter';
import { TableCard } from '../../../components/TableCard';
import { P } from '../../../components/Typography';
import { ICashFlow, ICashFlowResult } from '../../../modal/reports';
import moneyFormat from '../../../utils/moneyFormat';
import printDiv from '../../../utils/Print';
import { WrapperCashActivity } from './styles';

export const CashActivityReport: FC = () => {
  const [result, setResult] = useState<ICashFlowResult>({
    cash_in_flow: [],
    cash_out_flow: [],
  });

  const { data, isLoading } = useQuery(
    ['cash-activity-report'],
    CashActivityStatementAPI
  );

  useEffect(() => {
    if (data?.data?.result) {
      const { result } = data?.data;

      Object?.keys(result)?.forEach((key, index) => {
        const __arr: ICashFlow[] | any = result[key];

        const balance =
          (__arr?.length &&
            __arr?.reduce((a, b) => ({ balance: a.balance + b.balance }))
              ?.balance) ||
          0;

        __arr.push({
          isLastIndex: true,
          balance,
          account: {
            name: 'Total',
          },
        });

        result[key] = __arr;
      });

      setResult(data?.data?.result);
    }
  }, [data]);

  const printRef = useRef();

  const onPrint = () => {
    const printItem = printRef.current;

    printDiv(printItem);
  };

  return (
    <WrapperCashActivity>
      <Row gutter={24}>
        <Col span={18} offset={3}>
          <TableCard loading={isLoading} minHeight={590}>
            <>
              <div className="flex alignCenter justifySpaceBetween pb-20">
                <div>
                  <BoldText>Cash in flow out flow reports</BoldText>
                  <P className="dark-text">
                    For the years of 31st December 2009 <br /> cast at beginning
                    of year: 15,700
                  </P>
                </div>
                <div className="_disable_print flex alignCenter">
                  <ButtonTag
                    className="mr-10"
                    onClick={onPrint}
                    title="Print"
                    size="middle"
                    icon={printIcon}
                  />
                  <SmartFilter
                    formSchema={{}}
                    // onFilter={(query) => {
                    //   setConfig({ query: query });
                    //   history.push(
                    //     `/app${ISupportedRoutes.BALANCE_SHEET}?query=${query}`
                    //   );
                    // }}
                  />
                </div>
              </div>
              <div ref={printRef}>
                <PrintFormat>
                  <>
                    <div className="mb-30 _visibleOnPrint">
                      <PrintHeaderFormat hasbackgroundColor={true}>
                        <TableDivisions
                          divisions={[
                            {
                              element: <TopbarLogoWithDetails />,
                            },
                            {
                              element: <Addressbar />,
                            },
                          ]}
                        />
                      </PrintHeaderFormat>
                    </div>
                    {Object?.keys(result)?.map((key, index) => {
                      return (
                        <div className="cash_flow_table">
                          <table>
                            <thead>
                              <tr>
                                <th>{key?.split('_').join(' ')}</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {result[key]?.map((item: ICashFlow, index) => {
                                return (
                                  <tr>
                                    <td>
                                      {item?.isLastIndex ? (
                                        <BoldText>
                                          {item?.account?.name}
                                        </BoldText>
                                      ) : (
                                        item?.account?.name
                                      )}
                                    </td>
                                    <td>
                                      {item?.isLastIndex ? (
                                        <BoldText>
                                          {moneyFormat(item?.balance)}
                                        </BoldText>
                                      ) : (
                                        moneyFormat(item?.balance)
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </>
                </PrintFormat>
              </div>
            </>
            {/* <CommonTable
              size={"middle"}
              data={cash_in_flow}
              columns={columns}
              pagination={false}
              hasfooter={false}
            />
            <CommonTable
              size={"middle"}
              data={cash_out_flow}
              columns={outFlowColumns}
              pagination={false}
              hasfooter={false}
            /> */}
          </TableCard>
        </Col>
      </Row>
    </WrapperCashActivity>
  );
};
