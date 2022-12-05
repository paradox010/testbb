import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Tag } from 'antd';
import { request, history } from 'ice';
import { useRef } from 'react';

import { domainTypeEnum } from '@/dataType';

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: '标准名称',
    dataIndex: 'name',
  },
  {
    title: '域类型',
    tooltip: 'tooltip',
    dataIndex: 'type',
    hideInSearch: true,
    render: (text) => {
      const item = domainTypeEnum.find((v) => v.value === text);
      if (!item) return null;
      return <Tag color={item.color}>{item.label}</Tag>;
    },
  },
  {
    title: '最新版本',
    dataIndex: 'lastRelease',
    hideInSearch: true,
  },
  {
    title: '产品类目',
    dataIndex: 'count',
    hideInSearch: true,
  },
  {
    title: '产品属性',
    dataIndex: 'vcount',
    hideInSearch: true,
  },
  {
    title: '状态',
    dataIndex: 'statu',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      process: {
        text: '构建中',
        status: 'Process',
      },
      run: {
        text: '构建中',
        status: 'Success',
      },
      merge: {
        text: '融合中',
        status: 'purple',
      },
      interrupt: {
        text: '暂停运行',
        status: 'Default',
      },
    },
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'createTime',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: '操作',
    key: 'option',
    valueType: 'option',
    render: (text, record, _, action) => {
      return [
        <a
          key="view"
          onClick={() => {
            history?.push({
              pathname: '/kstruct/kbuild',
              search: `?domainId=${record.id}`,
            });
          }}
        >
          构建
        </a>,
      ];
    },
  },
];

const getTableData = async (params = {}, sort, filter) => {
  const data = await request({
    url: '/api/standard/domain/list',
    method: 'get',
  });
  return {
    total: 2,
    data,
    success: true,
  };
};
export default () => {
  const actionRef = useRef<ActionType>();

  return (
    <div>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        request={getTableData}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  );
};
