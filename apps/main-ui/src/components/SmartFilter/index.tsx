/* eslint-disable no-useless-escape */
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Color, FilterType, IVariants } from '../../modal';
import { Drawer, Button, Space, Menu, Popover, Form } from 'antd';
import { FormLabel } from '../FormLabel';
import convertToRem from '../../utils/convertToRem';
import DynamicFilteringForm from './DynamicForm';
import { Search } from '../../components/Search/Search';
import { Icon } from '@iconify/react';
import deleteIcon from '@iconify/icons-carbon/delete';
import editSolid from '@iconify/icons-clarity/edit-solid';

import { Tabs } from 'antd';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import bxFilter from '@iconify-icons/bx/bx-filter';

import tickIcon from '@iconify/icons-subway/tick';
import dayjs from 'dayjs';
import { DynamicForm } from '../../modules/Items/ItemsEditorWidget/DynamicForm';
import { IThemeProps } from '../../hooks/useTheme/themeColors';
import { getItemByIDAPI } from '../../api';

const { TabPane } = Tabs;

interface IProps {
  visible?: boolean;
  onClose?: () => void;
  formSchema?: any;
  onFilter?: (encode?: any, actualObj?: any) => void;
  initialValuse?: any;
  onClear?: () => void;
}

export const SmartFilter: FC<IProps> = ({
  // visible,
  formSchema,
  onFilter,
}) => {
  const [filter, setFilter] = useState<any>({});
  const [visible, setVisibility] = useState(false);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [attributeValues, setAttributeValues] = useState([]);

  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  const { search } = history.location;

  useEffect(() => {
    if (search) {
      const schema = search.split('query=');
      if (schema && schema[1] && schema[1] !== undefined) {
        const initialState = atob(schema[1]).replace(/\%/g, '');
        setFilter(JSON.parse(initialState));
        setIsFiltered(true);
      }
    }
  }, [search]);

  const handleChange = (accessor, value, formItem) => {
    const item = { ...formSchema[accessor] };
    item.value = value;
    if (item?.value?.length < 1) {
      delete filter[accessor];
      setFilter({ ...filter });
    } else {
      setFilter({ ...filter, [accessor]: item });
    }
  };

  const handleString = (str: any) => {
    if (typeof str === 'string') {
      const value = str.split(',');
      return value.map((str) => {
        return Number(str);
      });
    } else {
      return str;
    }
  };

  

  const handleFilter = () => {
    let generatedFilter = {};

    Object.keys(filter).forEach((item, index) => {
      if (filter[item].type === FilterType.SEARCH) {
        if (filter[item].isFullSearch) {
          const obj = { ...filter[item], value: `%${filter[item].value}%` };
          generatedFilter = { ...generatedFilter, [item]: obj };
        } else {
          const obj = { ...filter[item], value: `%${filter[item].value}` };
          generatedFilter = { ...generatedFilter, [item]: obj };
        }
      } else {
        const obj = {
          ...filter[item],
          value: handleString(filter[item].value),
        };

        delete obj.isFullSearch;
        generatedFilter = { ...generatedFilter, [item]: obj };
      }
    });

    const payload = btoa(JSON.stringify(generatedFilter));
    onFilter(payload, generatedFilter);
    setIsFiltered(true);
  };

  const ClearAll = () => {
    setFilter({});
    onFilter('');
    setIsFiltered(false);
    setAttributeValues([]);
  };

  const menu = (
    <WrapperMenu className="ph-9">
      <Menu className="menu_wrapper">
        {Object.keys(filter).map((key, index) => {
          return (
            <Menu.Item
              key={index}
              className="flex alignCenter jusifySpaceBetween ph-9"
            >
              <p className="filter_name">{filter[key].label}</p>
              <i className="flex alignCenter">
                <Icon icon={tickIcon} />
              </i>
            </Menu.Item>
          );
        })}
        <Menu.Item className="button_item">
          <Button onClick={ClearAll} type="primary" size={'small'}>
            Clear All
          </Button>
        </Menu.Item>
      </Menu>
    </WrapperMenu>
  );

  return (
    <ParentWrapper isFiltered={isFiltered}>
      <div className="filter_icon pointer">
        {isFiltered ? (
          <div>
            <Popover
              placement="bottomRight"
              content={menu}
              title="Applied Filters"
              trigger="hover"
            >
              <Button
                className="flex alignCenter"
                type="primary"
                size="middle"
                ghost
                onClick={() => setVisibility(true)}
              >
                <i className="filter-icon mr-10">
                  <Icon icon={bxFilter} />
                </i>
                Smart Filter
              </Button>
            </Popover>
          </div>
        ) : (
          <div>
            <Button
              className="flex alignCenter "
              type="default"
              size="middle"
              onClick={() => setVisibility(true)}
            >
              <i className="filter-icon">
                <Icon icon={bxFilter} />
              </i>
              Smart Filter
            </Button>
          </div>
        )}
      </div>
      <Drawer
        title="Smart Filter"
        placement={'right'}
        closable={false}
        onClose={() => setVisibility(false)}
        visible={visible}
        key={'right'}
        width={convertToRem(436)}
      >
        <Tabs defaultActiveKey="2">
          <TabPane disabled tab="Saved Filters" key="1">
            <WrapperSavedFilters>
              <Search />
              <div className="filtersList">
                <div className="header flex alignCenter justifySpaceBetween">
                  <p>Filters</p>
                  <p>Actions</p>
                </div>
                <div className="filter-item flex alignCenter justifySpaceBetween">
                  <p>Filter 1</p>
                  <div className="actions flex alignCenter">
                    <i className="mr-10">
                      {' '}
                      <Icon
                        style={{
                          fontSize: convertToRem(16),
                          color: Color.$GRAY,
                          cursor: 'pointer',
                        }}
                        icon={editSolid}
                      />
                    </i>
                    <i>
                      {' '}
                      <Icon
                        style={{
                          fontSize: convertToRem(16),
                          color: Color.$GRAY,
                          cursor: 'pointer',
                        }}
                        icon={deleteIcon}
                      />
                    </i>
                  </div>
                </div>
              </div>
            </WrapperSavedFilters>
          </TabPane>
          <TabPane tab="New Filter" key="2">
            <Form onFinish={() => handleFilter()}>
              <WrapperSmartFilter>
                {Object?.keys(formSchema)?.map((item: any, index: number) => {
                  const formItem = formSchema[item];

                  const initialStateValue = () => {
                    let initialState = null;
                    if (filter && filter[item]) {
                      initialState = filter[item].value;
                      if (filter[item].type === 'date-between') {
                        initialState = initialState.map((item) => {
                          return dayjs(item);
                        });
                      } else {
                        return filter[item].value;
                      }
                      return initialState;
                    }
                  };
                  if (formItem.type === 'NESTED_FORM') {
                    const getVariantsWithId = (id) => {
                      const [filtered] =
                        formSchema &&
                        formSchema.categoryId &&
                        formSchema.categoryId.value.filter(
                          (item) => item.id === id
                        );
                      if (filtered) {
                        return filtered.owner;
                      } else {
                        return [];
                      }
                    };
                    const selectedCategory =
                      filter && filter.categoryId && filter.categoryId.value;
                    return (
                      <div className="mt-10">
                        {selectedCategory &&
                          getVariantsWithId(selectedCategory) &&
                          getVariantsWithId(selectedCategory).map(
                            (vari: IVariants, index: number) => {
                              const valueAccessor =
                                (filter &&
                                  filter.attributes &&
                                  filter.attributes.value) ||
                                [];

                              const [filteredItem] = valueAccessor.filter(
                                (item) => item.attributeId === vari.id
                              );

                              return (
                                <div key={index}>
                                  <FormLabel>{vari.title}</FormLabel>
                                  <DynamicForm
                                    value={
                                      filteredItem ? filteredItem.value : ''
                                    }
                                    onChange={(value) => {
                                      if (value !== undefined) {
                                        const allValue = [...attributeValues];
                                        const changedValue = {
                                          attributeId: vari.id,
                                          value: value,
                                        };
                                        if (value === null || value === '') {
                                          const indexed = allValue.findIndex(
                                            (item) =>
                                              item.attributeId === vari.id
                                          );
                                          if (indexed > -1) {
                                            allValue.splice(indexed, 1);
                                            handleChange(
                                              item,
                                              allValue,
                                              formItem
                                            );
                                            setAttributeValues(allValue);
                                          }
                                        } else {
                                          const indexed =
                                            allValue &&
                                            allValue.findIndex(
                                              (ad) =>
                                                ad.attributeId ===
                                                changedValue.attributeId
                                            );
                                          if (indexed > -1) {
                                            allValue[indexed] = changedValue;
                                          } else {
                                            allValue.push(changedValue);
                                          }
                                          handleChange(
                                            item,
                                            allValue,
                                            formItem
                                          );
                                          setAttributeValues(allValue);
                                        }
                                      }
                                    }}
                                    item={vari}
                                  />
                                </div>
                              );
                            }
                          )}
                      </div>
                    );
                  } else {
                    return (
                      <div key={index}>
                        {DynamicFilteringForm(
                          formItem,
                          initialStateValue(),
                          (value) => {
                            handleChange(item, value, formItem);
                          }
                        )}
                      </div>
                    );
                  }
                })}

                <div className="actions">
                  <Space>
                    <Form.Item>
                      <Button type="default" size="middle">
                        Save Filter
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button onClick={ClearAll} type="default" size="middle">
                        Clear All
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        onClick={() => handleFilter()}
                        type="primary"
                        size="middle"
                      >
                        Apply
                      </Button>
                    </Form.Item>
                  </Space>
                </div>
              </WrapperSmartFilter>
            </Form>
          </TabPane>
        </Tabs>
      </Drawer>
    </ParentWrapper>
  );
};

export const WrapperMenu = styled.div`
  .ant-menu {
    border: none !important;
  }
  .menu_wrapper {
    /* width: ${convertToRem(180)};
    box-shadow: ${convertToRem(0)} ${convertToRem(1)} ${convertToRem(
      4
    )} rgb(0 0 0 / 24%); */
    padding: 0 ${convertToRem(9)};

    .filter_name {
      margin: 0 !important;
    }
    .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
      background: transparent !important;
    }
    .ant-menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: unset;
      height: ${convertToRem(30)};
      line-height: ${convertToRem(30)};
      padding: 0;
      margin: 0;

      h4 {
        padding: 0;
        margin: 0;
      }
      .ant-menu-title-content {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
      }
      i {
        color: ${Color.$PRIMARY};
        font-size: ${convertToRem(11)};
      }
      p {
        color: ${Color.$GRAY};
      }
    }

    .ant-menu-item:last-child .ant-menu-title-content {
      display: flex;
      justify-content: flex-end;
    }
    .heading {
      padding: ${convertToRem(10)} ${convertToRem(10)};
    }
    .button_item {
      justify-content: flex-end;
      cursor: pointer;
      height: ${convertToRem(40)};
      line-height: ${convertToRem(40)};
      button {
        cursor: pointer;
      }
    }
  }
`;

export const ParentWrapper: any = styled.div`
  .ant-btn {
    background: ${(props: IThemeProps) => props?.theme?.colors?.buttonTagBg};
    color: ${(props: IThemeProps) => props?.theme?.colors?.buttonTagColor};
    ${(props: IThemeProps) =>
      props?.theme?.theme === 'dark' &&
      `
    border-color: ${props?.theme?.colors?.seprator};
    
    `}
  }
  .filter-icon {
    font-size: ${convertToRem(24)};
    display: flex;
    align-items: center;
    color: ${(props: any) =>
      props.isFiltered ? `${Color.$PRIMARY} !important` : Color.$GRAY};
  }

  &:hover {
    .filter-icon {
      color: ${Color.$PRIMARY};
    }
  }
`;

const WrapperSmartFilter = styled.div`
  .actions {
    text-align: right;
    padding: ${convertToRem(30)} 0;
  }
`;

const WrapperSavedFilters = styled.div`
  .filtersList {
    .header {
      margin: ${convertToRem(12)} 0 ${convertToRem(7)} 0;
      font-style: normal;
      font-weight: 500;
      font-size: ${convertToRem(16)};
      line-height: ${convertToRem(19)};

      color: #343434;
    }
  }
  .filter-item {
    p {
      font-size: ${convertToRem(15)};
      line-height: 134%;
      letter-spacing: 0.04em;
      text-transform: capitalize;
      color: #4f4f4f;
    }
  }
`;
