import { useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { attrTypeEnum } from '@/dataType';
import type { StepProps, RTreeNode, MsgDataType } from '../../msg.d';

import styles from './index.module.less';

interface DataType {
  id: string;
  name?: string;
  dataType?: string;
  unit?: string;
  value?: string;
}

const TrashAttr: React.FC<
  Partial<Pick<StepProps, 'stepMsg$'>>& {
    msgData?: Pick<MsgDataType, 'yTree'>;
  }
> = ({ stepMsg$, msgData }) => {
  const [list, setList] = useState<RTreeNode[]>([] as any);

  stepMsg$?.useSubscription((msg) => {
    if (msg.type === 'refreshTree') {
      setList([...(msgData?.yTree?.getOriginTrashTree() || [])]);
    }
  });

  const reset = (record) => {
    stepMsg$?.emit({
      type: 'operation',
      content: {
        id: new Date().valueOf(),
        opeType: 'move',
        newNodes: [{ id: record.id, name: record.name }],
      },
    });
  };
  const columns: ColumnsType<DataType> = [
    {
      title: '属性名称',
      dataIndex: 'name',
      key: 'name',
      className: 'paddingLeft24',
    },
    {
      title: '类型',
      dataIndex: 'dataType',
      key: 'dataType',
      render: (text) => attrTypeEnum.find((v) => v.value === text)?.label,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => <a onClick={() => reset(record)}>恢复</a>,
    },
  ];
  console.log(list);

  return (
    <div className={styles.historyList}>
      <Table size="small" columns={columns} dataSource={list} rowKey="id" />
    </div>
  );
};
export default TrashAttr;
