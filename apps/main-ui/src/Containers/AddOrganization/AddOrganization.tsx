import deleteIcon from "@iconify/icons-carbon/delete";
import editSolid from "@iconify/icons-clarity/edit-solid";
import { Button } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { FC, useEffect, useState } from "react";
import { queryCache, useMutation, useQuery } from "react-query";

import {
  deleteOrganizationAPI,
  getOrganizations,
} from "../../api/organizations";
import { ButtonTag } from "../../components/ButtonTags";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Heading } from "../../components/Heading";
import { CommonTable } from "../../components/Table";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { NOTIFICATIONTYPE } from "../../modal";
import { BranchesContainer } from "./Branches";
import { AddOrganizationWrapper } from "./styled";

interface IProps {}

export const OrganizationsList: FC<IProps> = () => {
  const { setOrganizationConfig, notificationCallback } = useGlobalContext();
  const [{ result }, setResponse] = useState<any>({
    result: [],
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [mutateDeleteOrganizations, resDeleteOrganizations] = useMutation(
    deleteOrganizationAPI
  );

  const { isLoading, data } = useQuery([`all-organizations`], getOrganizations);

  useEffect(() => {
    if (data && data.data && data.data.result) {
      setResponse(data.data);
    }
  }, [data]);

  const columns: ColumnsType<any> = [
    {
      title: "#",
      dataIndex: "",
      key: "",
      width: 50,
      render: (data, row, index) => <>{index + 1}</>,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Niche", dataIndex: "niche", key: "niche" },
    {
      title: "Financial Ending",
      dataIndex: "financialEnding",
      key: "financialEnding",
    },
    {
      title: "Address",
      dataIndex: "residentialAddress",
      key: "residentialAddress",
    },
  ];

  const onSelectedRow = (rows) => {
    setSelectedRows(rows.selectedRowKeys);
  };

  const handleDelete = async () => {
    let payload = {
      ids: [...selectedRows],
    };

    try {
      await mutateDeleteOrganizations(payload, {
        onSuccess: () => {
          queryCache.invalidateQueries(`all-organizations`);
          queryCache.invalidateQueries(`loggedInUser`);
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            "Organization Deleted"
          );
          setConfirmModal(false);
          setSelectedRows([]);
        },
      });
    } catch (error) {}
  };

  const renderCustomTopbar = () => {
    return (
      <div className="custom_topbar">
        <div className="edit">
          {selectedRows && selectedRows.length > 0 && (
            <div className="flex alignCenter ">
              {selectedRows && selectedRows.length === 1 && (
                <ButtonTag
                  onClick={() => setOrganizationConfig(true, selectedRows[0])}
                  disabled={!selectedRows.length || selectedRows.length > 1}
                  title="Edit"
                  icon={editSolid}
                  size={"middle"}
                />
              )}
              <ButtonTag
                className="mr-10"
                disabled={!selectedRows.length}
                onClick={() => setConfirmModal(true)}
                title="Delete"
                icon={deleteIcon}
                size={"middle"}
              />
              {/* <MoreActions /> */}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AddOrganizationWrapper>
      <div className="add_organizations_action flex alignCenter justifySpaceBetween">
        <Heading type="table">Your Organizations</Heading>
        <Button
          onClick={() => setOrganizationConfig(true)}
          className="ml-10"
          type="primary"
        >
          Add Organization
        </Button>
      </div>
      <CommonTable
        customTopbar={renderCustomTopbar()}
        loading={isLoading}
        data={result.map((item, index) => {
          return { ...item, key: item.id };
        })}
        columns={columns}
        pagination={false}
        totalItems={result.length}
        hasfooter={true}
        enableRowSelection
        onSelectRow={onSelectedRow}
        expandable={{
          expandedRowRender: (record, index) => {
            // const childCategories: ITransactionItem[] =
            //   record.transaction_items;
            return (
              <BranchesContainer
                organizationid={record.id}
                branches={record.branches}
              />
            );
          },
        }}
      />
      <ConfirmModal
        loading={resDeleteOrganizations.isLoading}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDelete}
        type="delete"
        text="Are you sure want to delete selected Item?"
      />
    </AddOrganizationWrapper>
  );
};
