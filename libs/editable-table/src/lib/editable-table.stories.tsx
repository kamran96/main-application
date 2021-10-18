import { Story, Meta } from '@storybook/react';
import { Form, Button, Input } from 'antd';
import { useState } from 'react';
import {
  EditableColumnsType,
  EditableTable,
  EditableTableProps,
} from './editable-table';
import 'antd/dist/antd.css';

export default {
  component: EditableTable,
  title: 'EditableTable',
} as Meta;

const Template: Story<EditableTableProps> = (args) => {
  const [data, setData] = useState([
    {
      id: '1',
      description: 'sdfjafdiosaf',
    },
  ]);

  const cols: EditableColumnsType[] = [
    {
      title: 'item id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (_data, row, index) => {
        console.log(data, row, index);
        return (
          <input
            onChange={(e) => {
              let payload: any = { ...row, description: e.target.value };

              setData((prev) => {
                let a = [...prev];
                a.splice(index, 1, payload);
                return a;
              });
            }}
            type="text"
          />
        );
      },
    },
  ];

  const onFinish = (values: any) => {
    console.log(values, data, 'editable table form');
  };

  return (
    <div>
      <Form onFinish={onFinish}>
        <Form.Item name="name">
          <Input placeholder="name" size="middle" />
        </Form.Item>
        <EditableTable
          cacheKey={'invoice-data'}
          dragable={(newData) => setData(newData)}
          columns={cols}
          data={data}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            setData((prev) => {
              return [
                ...prev,
                { id: `${Math.random() * 83492}`, description: 'sdfjafdiosaf' },
              ];
            });
          }}
        >
          add row
        </button>

        <Button type="primary" htmlType="submit">Submit</Button>
      </Form>
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
