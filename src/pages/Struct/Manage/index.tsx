import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Space } from 'antd';
import { request } from 'ice';
import { useRef } from 'react';

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
    title: '标题',
    dataIndex: 'title',
  },
  {
    title: '状态',
    dataIndex: 'state',
    hideInSearch: true,
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
    title: '操作',
    key: 'option',
    valueType: 'option',
    render: (text, record, _, action) => {
      return [
        <a
          key="e"
          onClick={() => {
            console.log(action);
          }}
        >
          action
        </a>,
        <a key="view">view</a>,
      ];
    },
  },
];

const getTableData = async (params = {}, sort, filter) => {
  console.log(params, sort, filter);
  return request({
    url: 'https://proapi.azurewebsites.net/github/issues',
    method: 'get',
    params,
  });
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
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
      }}
      headerTitle="sss"
    />
  );
};
