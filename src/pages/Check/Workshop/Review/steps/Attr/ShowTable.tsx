import { useState } from 'react';
import { Radio, Table, Tooltip } from 'antd';
import { attrEnum, attrTypeEnum } from '@/dataType';

const columns = [
  {
    title: '序号',
    dataIndex: '_num',
    key: '_num',
    width: 80,
    render: (_, __, i) => i + 1,
  },
  {
    title: '属性编码',
    dataIndex: 'featureCode',
    key: 'featureCode',
  },
  {
    title: '属性名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '类型',
    dataIndex: 'dataType',
    key: 'dataType',
    render: (text) => attrTypeEnum?.find((v) => v.value === text)?.label,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '编码-值',
    dataIndex: 'value',
    key: 'value',
    render: (text) => {
      if (text?.split('；')?.length > 5) {
        return (
          <Tooltip
            title={
              <div style={{ maxHeight: '30vh', overflow: 'auto' }}>
                {text?.split('；')?.map((v, i) => (
                  <div key={i}>{v}</div>
                ))}
              </div>
            }
          >
            {text
              ?.split('；')
              ?.filter((_, i) => i < 5)
              ?.map((v, i) => (
                <div key={i}>{v}</div>
              ))}
            <div>...</div>
          </Tooltip>
        );
      }
      return text?.split('；')?.map((v, i) => <div key={i}>{v}</div>);
    },
  },
];

const AttrTable = ({ data }) => {
  const [radio, setRadio] = useState('1');
  return (
    <div style={{ padding: '0 24px' }}>
      <Radio.Group style={{ marginBottom: 8 }} value={radio} onChange={(e) => setRadio(e.target.value)}>
        {attrEnum.map((v) => (
          <Radio.Button value={v.value} key={v.value}>
            {v.label}
          </Radio.Button>
        ))}
      </Radio.Group>
      <Table
        className="attr-60-40"
        pagination={false}
        dataSource={data?.map((v) => v.featureDomain === radio) || []}
        rowKey="id"
        columns={columns}
        bordered
      />
    </div>
  );
};

export default AttrTable;
