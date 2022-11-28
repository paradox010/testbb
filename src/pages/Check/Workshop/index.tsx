import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { history, request } from 'ice';
import { useRef } from 'react';

interface GithubIssueItem {
  url: string;
  id: number;
  title: string;
  version: string;
  team: string;
  status: string;
  role: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

const columns: Array<ProColumns<GithubIssueItem>> = [
  {
    title: '标准名称',
    dataIndex: 'title',
  },
  {
    title: '标准版次',
    dataIndex: 'version',
    hideInSearch: true,
  },
  {
    title: '负责行业专家小组',
    dataIndex: 'team',
    valueType: 'select',
  },
  {
    title: '时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '时间',
    dataIndex: 'created_at',
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
    title: '评审状态',
    dataIndex: 'status',
    hideInSearch: true,
  },
  {
    title: '您的评审角色',
    dataIndex: 'role',
    hideInSearch: true,
  },
  {
    title: '操作',
    key: 'option',
    valueType: 'option',
    render: (text, record, _) => {
      return [
        <a
          key="e"
          onClick={() => {
            history?.push(`/kcheck/workshop/${record.id}`);
          }}
        >
          参与评审
        </a>,
        <a key="view">评审文件</a>,
      ];
    },
  },
];

const getTableData = async (params) => {
  const res = await request({
    url: '/api/getList',
    method: 'get',
    params,
  });
  return {
    data: res.list,
    success: true,
    total: res.total,
  };
};
export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable
      actionRef={actionRef}
      columns={columns}
      rowKey="id"
      request={getTableData}
      search={{
        labelWidth: 'auto',
      }}
      form={{
        syncToUrl: false,
      }}
      pagination={{
        pageSize: 5,
      }}
      headerTitle="通用域版本"
    />
  );
};