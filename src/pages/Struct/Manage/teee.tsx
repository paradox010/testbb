import { Button, Form, Input, Table } from 'antd';
import { useAntdTable } from 'ahooks';
import { request } from 'ice';

interface Item {
  name: {
    last: string;
  };
  email: string;
  phone: string;
  gender: 'male' | 'female';
}
interface Result {
  total: number;
  list: Item[];
}
const getTableData = async ({ current, pageSize }, formData: {}): Promise<Result> => {
  console.log(formData)
  const query = `page=${current}&size=${pageSize}`;
  const res = await request(`https://randomuser.me/api?results=55&${query}`);
  console.log(res);
  return {
    total: res.info.results as number,
    list: res.results as Item[],
  };
};
const columns = [
  {
    title: 'name',
    dataIndex: ['name', 'last'],
  },
  {
    title: 'email',
    dataIndex: 'email',
  },
  {
    title: 'phone',
    dataIndex: 'phone',
  },
  {
    title: 'gender',
    dataIndex: 'gender',
  },
];
export default function Stand() {
  const [form] = Form.useForm();
  const { tableProps, search, params } = useAntdTable(getTableData, {
    defaultPageSize: 5,
    form,
  });
  const { submit } = search;

  const searchForm = (
    <div>
      <Form form={form} onFinish={submit}>
        <Form.Item name="name">
          <Input placeholder="enter name" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          search
        </Button>
      </Form>
    </div>
  );

  return (
    <div>
      {searchForm}
      <Table columns={columns} rowKey="email" {...tableProps} />
      <div style={{ background: '#f5f5f5', padding: 8 }}>
        <p>Current Table: {JSON.stringify(params[0])}</p>
        <p>Current Form: {JSON.stringify(params[1])}</p>
      </div>
    </div>
  );
}
