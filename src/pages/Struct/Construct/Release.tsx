import { Button, Form, Input, Popover, Select } from 'antd';
import { useEffect, useState } from 'react';
import { request, useLocation } from 'ice';
import { useRequest } from 'ahooks';
import { getParams } from '@/utils/location';
import { CustomProps } from './msg.d';

async function getVersionList(params) {
  return request({
    url: '/api/standard/domain/getOptionalVersion',
    params,
  });
}
const Release: React.FC<Omit<CustomProps, 'yTree'>> = ({ treeMsg$ }) => {
  const [click, setClicked] = useState(false);

  const location = useLocation();

  const { data: selectOptions, run } = useRequest(getVersionList, {
    manual: true,
  });

  useEffect(() => {
    if (getParams().domainId && click) {
      run({
        domainId: getParams().domainId,
      });
    }
  }, [location, click]);

  const [form] = Form.useForm();
  const onOpenChange = (open) => {
    setClicked(open);
    if (open) {
      form.resetFields();
    }
  };
  const onClose = () => {
    setClicked(false);
  };

  const onFinish = (v) => {
    treeMsg$.emit({
      type: 'publish',
      content: v,
    });
    setClicked(false);
  };

  const content = (
    <div>
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item rules={[{ required: true }]} label="版本" name="version">
          <Select options={selectOptions?.map((v) => ({ label: v, value: v }))} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 10, textAlign: 'right' }}>
          <Button style={{ marginRight: 6 }} onClick={onClose}>
            取消
          </Button>
          <Button htmlType="submit" type="primary">
            确定
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
  return (
    <Popover
      open={click}
      onOpenChange={onOpenChange}
      overlayStyle={{ width: 400 }}
      placement="bottomRight"
      content={content}
      title={<div style={{ padding: '10px 0', fontSize: 16 }}>发布</div>}
      trigger="click"
    >
      <Button>申请版本发布</Button>
    </Popover>
  );
};

export default Release;
