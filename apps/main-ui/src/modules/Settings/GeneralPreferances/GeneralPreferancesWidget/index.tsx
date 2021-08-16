import deleteIcon from "@iconify/icons-carbon/delete";
import { Icon } from "@iconify/react";
import { Button, Col, Input, Row } from "antd";
import React, { FC, useState } from "react";
import styled from "styled-components";
import { CommonModal } from "../../../../components";
import { FormLabel } from "../../../../components/FormLabel";
import { useGlobalContext } from "../../../../hooks/globalContext/globalContext";
import { Color } from "../../../../modal";
import convertToRem from "../../../../utils/convertToRem";

export const GeneralPreferencesWidget: FC = () => {
  const [formData, setFormData] = useState([{ name: "", type: "" }]);
  const { preferancesModal, setPreferancesModal } = useGlobalContext();

  const handleContinue = () => {};

  const handleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    let rest = [...formData];
    rest[index][name] = value;

    setFormData(rest);
  };

  return (
    <CommonModal
      width={765}
      title="Add Preferences"
      visible={preferancesModal}
      onOk={handleContinue}
      onCancel={() => setPreferancesModal(false)}
      cancelText={"Cancel"}
      okText={"Create"}
      okButtonProps={{ loading: false }}
    >
      <WrapperForm>
        {formData.map((formItem, index) => {
          return (
            <Row key={index} gutter={24}>
              <Col span={22}>
                <Row gutter={24}>
                  <Col span={12}>
                    <FormLabel>Name</FormLabel>

                    <Input
                      value={formItem.name}
                      name="name"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </Col>
                  <Col span={12}>
                    <FormLabel>Type</FormLabel>

                    <Input
                      value={formItem.type}
                      name="type"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={2} className="flex alignCenter">
                {formData.length > 1 && (
                  <i
                    onClick={() => {
                      let item = [...formData];
                      item.splice(index, 1);
                      setFormData(item);
                    }}
                  >
                    {" "}
                    <Icon
                      style={{
                        fontSize: convertToRem(20),
                        color: Color.$GRAY,
                        cursor: "pointer",
                      }}
                      icon={deleteIcon}
                    />
                  </i>
                )}
              </Col>
            </Row>
          );
        })}
        <div className="add_more">
          <Button
            onClick={() => {
              let addForm: any[] = [...formData];
              addForm.push({
                name: "",
                type: "",
              });

              setFormData(addForm);
            }}
            type="link"
          >
            {" "}
            + Add another
          </Button>
        </div>
      </WrapperForm>
    </CommonModal>
  );
};

const WrapperForm = styled.div`
  .add_more {
    margin-top: 14px;
    button {
      padding: 0;
    }
  }
`;
