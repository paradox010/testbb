import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Tag } from 'antd';
import { request, history, Link } from 'ice';
import { useRef } from 'react';

// import { domainTypeEnum } from '@/dataType';

interface GithubIssueItem {
  url: string;
  id: number;
  number: number;
  name: string;
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  isLock?: boolean;
  isInit?: boolean;
};

const columns: Array<ProColumns<GithubIssueItem>> = [
  {
    title: '标准名称',
    dataIndex: 'name',
  },
  // {
  //   title: '域类型',
  //   tooltip: 'tooltip',
  //   dataIndex: 'type',
  //   hideInSearch: true,
  //   render: (text) => {
  //     const item = domainTypeEnum.find((v) => v.value === text);
  //     if (!item) return null;
  //     return <Tag color={item.color}>{item.label}</Tag>;
  //   },
  // },
  {
    title: '最新版本',
    dataIndex: 'version',
    hideInSearch: true,
  },
  {
    title: '产品类目',
    dataIndex: 'categoryCount',
    hideInSearch: true,
  },
  {
    title: '产品属性',
    dataIndex: 'featureCount',
    hideInSearch: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    hideInSearch: true,
    valueType: 'select',
    valueEnum: {
      0: { text: '全部', status: 'Default' },
      '1': {
        text: '正常运行',
        status: 'Process',
      },
      // run: {
      //   text: '构建中',
      //   status: 'Success',
      // },
      '3': {
        text: '构建中',
        status: 'purple',
      },
      '2': {
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
      return (
        <>
          {!record.isInit && (
            <Button
              onClick={() => {
                history?.push({
                  pathname: '/kstruct/kmanage/knew',
                  search: `?domainId=${record.id}&domainName=${record.name}`,
                });
              }}
              disabled={!!record.isLock}
              type="link"
            >
              构建
            </Button>
          )}
          {record.isInit && (
            <Button
              type="link"
              onClick={() => {
                history?.push({
                  pathname: '/kstruct/kbuild',
                  search: `?domainId=${record.id}`,
                });
              }}
              disabled={!!record.isLock}
            >
              运维
            </Button>
          )}
        </>
      );
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
        onRequestError={() => {}}
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
