import deleteIcon from '@iconify/icons-carbon/delete';
import Icon from '@iconify/react';
import { Button, Col, Row, Tooltip } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { addAttributesAPI, getCategoryAttributesAPI } from '../../../api';
import { CommonModal } from '../../../components';
import { CommonLoader } from '../../../components/FallBackLoader';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { Color, IVariants, NOTIFICATIONTYPE } from '../../../modal';
import convertToRem from '../../../utils/convertToRem';
import { AttriForm } from './form';
import { WrapperAttributeWidget } from './styles';

export const AttributeEditorWidget: FC = () => {
  const queryCache = useQueryClient();
  const [attriData, setAttriData] = useState<IVariants[]>([{}]);
  const [deletedIds, setDeletedIds] = useState([]);
  const [checkValidation, setCheckValidation] = useState(false);
  const [errors, setErrors] = useState([]);

  const { attributeConfig, setAttributeConfig, notificationCallback } =
    useGlobalContext();
  const { visibility, categoryObj } = attributeConfig;
  const categoryId = (categoryObj && categoryObj.id) || null;

  const { data: categoryData, isLoading: categoryAttributeFetching } = useQuery(
    [`categoryAttribute-${categoryId}`, categoryId],
    getCategoryAttributesAPI,
    {
      enabled: !!categoryId,
    }
  );

  useEffect(() => {
    if (categoryData?.data?.result) {
      const { result } = categoryData.data;
      const { attributes } = result;
      const initialData = attributes.map((item, index) => {
        const { title, valueType, values, id } = item;
        if (valueType === 'DROPDOWN') {
          return {
            title,
            valueType: 'custom',
            type: valueType,
            value: values ? values.join(',') : '',
            id,
          };
        } else {
          return {
            title,
            type: valueType,
            id,
          };
        }
      });
      setAttriData(initialData);
    }
  }, [categoryData]);

  console.log(attriData, 'attributes data');

  const { mutate: mutateAttributes, isLoading: addingAttributte } =
    useMutation(addAttributesAPI);

  const handleSubmit = async () => {
    const payload = {
      deleted_ids: [...deletedIds],
      categoryId,
      attributes: attriData.map((item: any, index: number) => {
        if (item.type === 'DROPDOWN') {
          const values = item.value.split(',');
          const { id } = item;
          delete item.valueType;
          return id ? { ...item, values, id } : { ...item, values };
        } else {
          const { title, type, id } = item;
          let reutrnedValue: any = { title, type };
          if (id) {
            reutrnedValue = { ...reutrnedValue, id };
          }

          return reutrnedValue;
        }
      }),
    };

    mutateAttributes(payload, {
      onSuccess: () => {
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          'Attributes Added Successfully'
        );
        [
          `categoryAttribute-${categoryId}`,
          'child-categories',
          'categories-list',
          'all-categories',
        ].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
        });
        setAttributeConfig(false);
        setAttriData([{}]);
      },
    });
  };

  return (
    <CommonModal
      width={800}
      visible={visibility}
      onCancel={() => {
        setAttributeConfig(false);
        setAttriData([{}]);
      }}
      title={'Add Attributes'}
      footer={false}
    >
      <WrapperAttributeWidget>
        {!categoryAttributeFetching ? (
          <>
            <div className="form-wrapper">
              {attriData.map((attri: any, index: number) => {
                return (
                  <div key={index} className="form-group">
                    <Row gutter={24}>
                      <Col span={22}>
                        <AttriForm
                          state={attriData}
                          onFormChange={(values) => {
                            setAttriData(values);
                            setCheckValidation(false);
                            setErrors([]);
                          }}
                          index={index}
                          checkValidation={checkValidation}
                          onError={(err) => setErrors([...errors, err])}
                        />
                      </Col>
                      <Col span={2}>
                        <div className="flex alignCenter justifyCenter delete-icon">
                          <Tooltip placement="top" title={'Remove'}>
                            <i
                              className="flex alignCenter justifyCenter"
                              onClick={() => {
                                const allAttri = [...attriData];
                                if (allAttri[index]?.id) {
                                  const dIds = [...deletedIds];
                                  dIds.push(allAttri[index].id);
                                  setDeletedIds(dIds);
                                }
                                allAttri.splice(index, 1);
                                setAttriData(allAttri);
                              }}
                            >
                              <Icon
                                style={{
                                  fontSize: convertToRem(16),
                                  color: Color.$GRAY_LIGHT,
                                  cursor: 'pointer',
                                }}
                                icon={deleteIcon}
                              />
                            </i>
                          </Tooltip>
                        </div>
                      </Col>
                    </Row>
                  </div>
                );
              })}
              <div className="add-action pv-10">
                <Button
                  onClick={() => {
                    const allData = [...attriData];
                    allData.push({});
                    setAttriData(allData);
                  }}
                  type="link"
                >
                  Add Row
                </Button>
              </div>
            </div>
            <div className="submit-action textRight mt-10">
              <Button
                onClick={() => {
                  setAttributeConfig(false);
                  setAttriData([{}]);
                }}
                type="default"
                className="mr-10"
                size="middle"
              >
                cancel
              </Button>
              <Button
                loading={addingAttributte}
                onClick={() => {
                  setCheckValidation(true);
                  handleSubmit();
                }}
                type="primary"
                size="middle"
              >
                Create
              </Button>
            </div>
          </>
        ) : (
          <div className={'loader-area flex alignCenter justifyCenter'}>
            <CommonLoader />
          </div>
        )}
      </WrapperAttributeWidget>
    </CommonModal>
  );
};

export default AttributeEditorWidget;
