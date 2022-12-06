import { EditableProTable, ProColumns, EditableFormInstance, ActionType } from '@ant-design/pro-table';
import { Input, Select, Radio } from 'antd';
import React, { useRef, useState } from 'react';

import { EventEmitter } from 'ahooks/lib/useEventEmitter';
import type { MsgType } from '../msg.d';

import type { YTree as YTreeType } from '../Tree/node';

import { attrEnum, attrTypeEnum } from '@/dataType';
import ValueSelect from './ValueSelect';

interface DataSourceType {
  id: string;
  name?: string;
  dataType?: string;
  unit?: string;
  value?: string;
  editStatus?: number;
}

interface TreeProps {
  yAttr: YTreeType;
  attrMsg$: EventEmitter<MsgType>;
}
const TT: React.FC<TreeProps> = ({ attrMsg$, yAttr }) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const actionRef = useRef<ActionType>();
  const editableFormRef = useRef<EditableFormInstance>();

  attrMsg$.useSubscription((msg) => {
    if (msg.type === 'refreshTree') {
      setDataSource([...yAttr.getOriginTree()] as any[]);
    }
  });

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '编号',
      dataIndex: 'readonly',
      tooltip: '由运营维护生成',
      width: 100,
      readonly: true,
      editable: false,
    },
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      width: '15%',
    },
    {
      title: '类型',
      dataIndex: 'dataType',
      valueType: 'select',
      width: 150,
      request: async () => attrTypeEnum,
      fieldProps: (a, v) => {
        return {
          onSelect: () => {
            // 每次选中重置参数
            if (v?.rowKey?.[0]) {
              editableFormRef.current?.setFieldValue([v?.rowKey?.[0], 'value'], undefined);
            }
            // editableFormRef.current?.setRowData?.(v.rowIndex, { value: '', dataType:'2' });
          },
        };
      },
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 150,
    },
    {
      title: '值',
      dataIndex: 'value',
      valueType: 'select',
      renderFormItem: (_, { record }) => {
        if (record?.dataType === '1') {
          return (
            <ValueSelect />
          );
        }
        return <Input disabled />;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      tooltip: '继承自上位节点的通用属性无法在此节点修改；如需修改请至上位属性进行',
      width: 200,
      render: (text, record, _, action) => {
        if (record.editStatus === -1) {
          return null;
        }
        return [
          <a
            key="editable"
            onClick={() => {
              // editableFormRef.current?.setFieldValue(record.id, record);
              actionRef.current?.startEditable(record.id);
              // action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>,
          <a
            key="delete"
            onClick={() => {
              attrMsg$.emit({
                type: 'operation',
                content: {
                  id: new Date().valueOf(),
                  opeType: 'delete',
                  newNodes: [{ id: record.id, name: record.name }],
                },
              });
            }}
          >
            删除
          </a>,
        ];
      },
    },
  ];

  const [radio, setRadio] = useState('1');

  return (
    <>
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle={
          <div>
            <div style={{ marginBottom: 20 }} className="ant-descriptions-title">
              产品属性信息
            </div>
            <Radio.Group style={{ marginBottom: 8 }} value={radio} onChange={(e) => setRadio(e.target.value)}>
              {attrEnum.map((v) => (
                <Radio.Button value={v.value} key={v.value}>
                  {v.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        }
        loading={false}
        pagination={false}
        scroll={{
          x: 960,
        }}
        editableFormRef={editableFormRef}
        actionRef={actionRef}
        columns={columns}
        recordCreatorProps={{
          position: 'top',
          record: { id: 'add_self' },
        }}
        value={dataSource}
        // onChange={(v) => {
        //   console.log(v);
        //   setDataSource(v);
        // }}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
          actionRender: (row, config, defaultDom) => [
            <a
              key={`save${row.id}`}
              onClick={() => {
                // msg add row
                // quit edit
                editableFormRef.current
                  ?.validateFields()
                  .then((v) => {
                    console.log(v);
                    if (!v[row.id]) {
                      return;
                    }
                    const newNode = { ...v[row.id], id: row.id };
                    if (newNode.dataType !== '1') {
                      newNode.value = '';
                    }
                    attrMsg$.emit({
                      type: 'operation',
                      content: {
                        id: new Date().valueOf(),
                        opeType: row.id === 'add_self' ? 'add' : 'update',
                        newNodes: [newNode],
                      },
                    });
                    actionRef.current?.cancelEditable(row.id);
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              }}
            >
              保存
            </a>,
            defaultDom.cancel,
          ],
        }}
      />
    </>
  );
};
export default TT;
