import { Form, Input, Select, Table } from 'antd';
import { useRef, useState } from 'react';

type DataSourceType = {
  id: string;
  title?: string;
  readonly?: string;
  decs?: string;
  dataType: '1' | '2' | '3' | '4' | '5';
  unit?: string;
  value?: string;
};

const defaultData: DataSourceType[] = [
  {
    id: '1',
    title: 'a',
    readonly: '1',
    decs: '这个活动真好玩',
    dataType: '1',
    unit: '单位',
    value: '122,333',
  },
  {
    id: '2',
    title: 'b',
    readonly: '1',
    decs: '这个活动真好玩1',
    dataType: '2',
    unit: '单位',
    value: '122,333',
  },
];

export default () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(defaultData);
  const [editKey, setEditKey] = useState<string[]>([]);

  const cancel = () => {
    setEditKey([]);
  };

  const columns = [
    {
      title: '编号',
      dataIndex: 'readonly',
      width: '15%',
      render: (text, record) => {
        return editKey.includes(record.id) ? (
          <Form.Item name={[record.id, 'readonly']}>
            <Input />
          </Form.Item>
        ) : (
          <span>{text}</span>
        );
      },
    },
    {
      title: '属性名称',
      dataIndex: 'title',
      width: '15%',
      render: (text, record) => {
        return editKey.includes(record.id) ? (
          <Form.Item name={[record.id, 'title']}>
            <Input />
          </Form.Item>
        ) : (
          <span>{text}</span>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'dataType',
      render: (text, record) => {
        return editKey.includes(record.id) ? (
          <Form.Item name={[record.id, 'title']}>
            <Select>

            </Select>
          </Form.Item>
        ) : (
          <span>{text}</span>
        );
      },
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
    {
      title: '值',
      dataIndex: 'value',
    },
    {
      title: '描述',
      dataIndex: 'decs',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (v, record) => {
        return [
          <a
            key="editable"
            onClick={() => {
              form.setFieldValue(record.id, record);
              setEditKey([record.id]);
            }}
          >
            编辑
          </a>,
          <a key="delete">删除</a>,
        ];
      },
    },
  ];
  const actionref = useRef(null);
  return (
    <div>
      <Form form={form} component={false}>
        <Table dataSource={data} rowKey={'id'} columns={columns} />
      </Form>
    </div>
  );
};
