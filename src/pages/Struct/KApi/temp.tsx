import { EditableProTable, ProColumns, EditableFormInstance, ActionType } from '@ant-design/pro-table';
import { Input } from 'antd';
import React, { useRef, useState } from 'react';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const dataTypeMap = {
  '1': '枚举',
  '2': '数值',
  '3': '范围',
  '4': '文本',
  '5': '布尔',
};

const selectEnum = Object.keys(dataTypeMap).map((v) => ({
  label: dataTypeMap[v],
  value: v,
}));
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
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>(defaultData);
  const actionRef = useRef<ActionType>();
  const editableFormRef = useRef<EditableFormInstance>();
  const refresh = () => {
    setDataSource([...dataSource]);
  };
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '编号',
      dataIndex: 'readonly',
      tooltip: '只读，使用form.getFieldValue可以获取到值',
      width: '15%',
      readonly: true,
    },
    {
      title: '名称',
      dataIndex: 'title',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: rowIndex > -1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
      width: '15%',
    },
    {
      title: '类型',
      key: 'dataType',
      dataIndex: 'dataType',
      valueType: 'select',
      request: async () => selectEnum,
      fieldProps: (a, v) => {
        return {
          onSelect: () => {
            console.log(a, v);
            // 每次选中重置参数
            if (v?.rowKey?.[0]) {
              editableFormRef.current?.setFieldValue([v?.rowKey?.[0], 'value'], '');
            }
            // editableFormRef.current?.setRowData?.(v.rowIndex, { value: '' });
          },
        };
      },
      // valueEnum: () => selectEnum,
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: '值',
      key: 'value',
      dataIndex: 'value',
      // fieldProps: {
      //   mode: 'multiple',
      // },
      renderFormItem: (v) => {
        console.log(v);
        return <Input />;
      },
      valueType: 'text',
    },
    {
      title: '描述',
      dataIndex: 'decs',
      fieldProps: (form, { rowKey, rowIndex }) => {
        if (form.getFieldValue([rowKey || '', 'title']) === '不好玩') {
          return {
            disabled: true,
          };
        }
        if (rowIndex > 9) {
          return {
            disabled: true,
          };
        }
        return {};
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            actionRef.current?.startEditable(record.id);
            // action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <>
      <div onClick={refresh}>onRefresh</div>
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle="可编辑表格"
        editableFormRef={editableFormRef}
        maxLength={5}
        scroll={{
          x: 960,
        }}
        actionRef={actionRef}
        recordCreatorProps={{
          record: { id: 'test', dataType: '4' },
        }}
        loading={false}
        columns={columns}
        value={dataSource}
        onChange={(v) => {
          console.log(v);
          setDataSource(v);
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            await waitTime(2000);
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, defaultDom) => [defaultDom.save, defaultDom.cancel],
        }}
      />
    </>
  );
};
