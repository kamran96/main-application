import copyIcon from "@iconify-icons/feather/copy";
import { Button, Col, Form, Progress, Row, Select } from "antd";
import React, { FC, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { duplicateItemsAPI } from "../../../../api";
import { getOrganizations } from "../../../../api/organizations";
import { CommonModal } from "../../../../components";
import { ButtonTag } from "../../../../components/ButtonTags";
import { FormLabel } from "../../../../components/FormLabel";
import { BoldText } from "../../../../components/Para/BoldText";
import { useGlobalContext } from "../../../../hooks/globalContext/globalContext";
import { Color } from "../../../../modal";
import { IOrganizations } from "../../../../modal/organization";

const { Option } = Select;

interface IProps {
  disabled?: boolean;
  itemsData?: any[];
}

export const DuplicateModal: FC<IProps> = ({ disabled = false, itemsData }) => {
  const { userDetails, notificationCallback } = useGlobalContext();
  const { organizationId } = userDetails;
  const [visibleModal, setVisibleModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duplicateItemsState, setDuplicateItemsState] = useState([]);

  const { data } = useQuery([`all-organizations`], getOrganizations, {
    cacheTime: Infinity,
  });

  useEffect(() => {
    if (visibleModal) {
      if (!duplicateItemsState.length) {
        setDuplicateItemsState(itemsData);
        const activebranch = userDetails.branchId;
        form.setFieldsValue({ from: activebranch });
      }
    }
  }, [itemsData, visibleModal]);

  const [
    mutateCopy,
    { isError, isLoading, data: responseData, status },
  ] = useMutation(duplicateItemsAPI);

  const [form] = Form.useForm();

  const organizations: IOrganizations[] =
    (data && data.data && data.data.result) || [];

  const getActiveOrganization = (id) => {
    const [filtered] =
      organizations && organizations.filter((item) => item.id === id);

    return filtered;
  };
  const reset = () => {
    setVisibleModal(false);
    form.resetFields();
    setDuplicateItemsState([]);
    setProgress(0);
  };

  const onFinish = async (values) => {
    let progressCount = 100 / itemsData.length;
    let progressLoading = 0;

    let mutatedItems = [...duplicateItemsState];

    const callback = async () => {
      for (let index = 0; index < itemsData.length; index++) {
        const payload = {
          items: {
            ...values,
            item: { ...itemsData[index] },
          },
        };

        let response = await mutateCopy(payload, {
          onSuccess: () => {
            if (index === 0) {
              setProgress(progressCount);
            } else if (index === itemsData.length - 1) {
              setProgress(100);
            } else {
              let prg = progress + progressCount;
              setProgress(prg);
            }
          },
          onError: () => {
            let prg = progress + progressCount;
            setProgress(prg);
          },
        });
        if (response) {
          mutatedItems[index] = {
            ...mutatedItems[index],
            responseStatus: "Complete",
          };
        } else {
          mutatedItems[index] = {
            ...mutatedItems[index],
            responseStatus: "Already Exist",
          };
        }

        if (index === 0) {
          progressLoading = progressCount;
        } else if (index === itemsData.length - 1) {
          progressLoading = 100;
        } else {
          progressLoading = progressLoading + progressCount;
        }

        setDuplicateItemsState(mutatedItems);
        setProgress(progressLoading);
      }
    };

    await callback();

    // setTimeout(() => {
    //   reset();
    // }, 700);

    // setVisibleModal(false);
  };

  return (
    <>
      <ButtonTag
        className="mr-10"
        disabled={disabled}
        onClick={() => setVisibleModal(true)}
        title="Duplicate"
        icon={copyIcon}
        size="middle"
      />
      <CommonModal
        visible={visibleModal}
        width={700}
        footer={false}
        title={"Duplicate Items"}
        onCancel={() => setVisibleModal(false)}
      >
        <MainWrapper>
          <Form form={form} onFinish={onFinish}>
            <Row gutter={24}>
              <Col span={12}>
                <FormLabel>Copy from</FormLabel>
                <Form.Item name="from">
                  <Select size="middle" disabled={true}>
                    {organizationId &&
                      getActiveOrganization(organizationId) &&
                      getActiveOrganization(organizationId).branches.map(
                        (branch, index) => {
                          return (
                            <Option value={branch.id}>{branch.name}</Option>
                          );
                        }
                      )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel>Copy to</FormLabel>
                <Form.Item
                  name="to"
                  rules={[
                    { required: true, message: "Please add target branch" },
                  ]}
                >
                  <Select size="middle">
                    {organizationId &&
                      getActiveOrganization(organizationId) &&
                      getActiveOrganization(organizationId).branches.map(
                        (branch, index) => {
                          return (
                            <Option value={branch.id}>{branch.name}</Option>
                          );
                        }
                      )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} className="pb-20">
                <table className="duplicate-list" width={"100%"}>
                  <thead>
                    <tr>
                      <th></th>
                      <th className="title-head">
                        <BoldText>Items name</BoldText>
                      </th>
                      <th>
                        <BoldText>Code</BoldText>
                      </th>
                      <th>
                        <BoldText>Status</BoldText>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {duplicateItemsState.map((item, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td className="title-head">{item.name}</td>
                          <td>{item.code}</td>
                          <td
                            className={
                              item?.responseStatus
                                ? item?.responseStatus === "Complete"
                                  ? "isCompleted"
                                  : "iserror"
                                : "isReady"
                            }
                          >
                            {item?.responseStatus
                              ? item.responseStatus
                              : "Ready"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Col>
              {isLoading && (
                <Col span={22} offset={1}>
                  <Progress percent={progress} status="active" />
                </Col>
              )}
              <Col span={24}>
                <Form.Item className="textRight mt-10 ">
                  <Button
                    disabled={isLoading}
                    onClick={reset}
                    type="default"
                    className="mr-10"
                    size="middle"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isLoading}
                    type="primary"
                    size="middle"
                    htmlType="submit"
                  >
                    Proceed
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </MainWrapper>
      </CommonModal>
    </>
  );
};

export default DuplicateModal;

const MainWrapper = styled.div`
  table.duplicate-list {
    width: 100%;
    border: 1px solid #e8e8e8;
    thead {
      tr {
        background: #ececec;
      }
      tr th {
        padding: 10px 18px;
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        /* identical to box height */

        letter-spacing: 0.04em;
        text-transform: capitalize;

        /* text label */

        color: #3e3e3c;
      }
    }
    tbody {
      display: block;
      height: 330px;
      overflow: auto;
    }
    thead,
    tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }
    tbody tr td {
      padding: 8px 18px;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 12px;
      /* identical to box height */

      letter-spacing: 0.04em;
      text-transform: capitalize;

      /* text label */

      color: #3e3e3c;
    }
    tbody tr td.isReady {
      color: ${Color.$PRIMARY};
    }
    tbody tr td.isCompleted {
      color: #1ed21e;
    }
    tbody tr td.iserror {
      color: red;
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
    background-color: #f5f5f5;
  }

  .title-head {
    width: 270px;
  }
`;
