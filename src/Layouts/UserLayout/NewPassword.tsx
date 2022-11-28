import { Form, Input, Button } from 'antd';

import LoginWrap from './LoginWrap';

import { useRequest } from 'ahooks';
import { request } from 'ice';

import styles from './index.module.less';

async function loginUp(params) {
  const resData = await request({
    url: '/api/sys/sysUser/updatePwd',
    method: 'put',
    data: params,
  });
  return resData;
}

const Login = () => {
  const { run } = useRequest(loginUp, {
    manual: true,
    onSuccess: (data) => {
      localStorage.setItem('token', data?.tokenValue);
    },
  });

  const onFinish = (v) => {
    run(v);
  };

  return (
    <LoginWrap>
      <Form name="newWord" layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item style={{ marginBottom: 54 }}>
          <div className={styles.formTitle}>找回密码</div>
        </Form.Item>

        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
          <Input placeholder="请输入用户名" size="large" />
        </Form.Item>

        <Form.Item name="oldPassword" rules={[{ required: true, message: '请输入旧密码!' }]}>
          <Input.Password placeholder="请输入旧密码" size="large" />
        </Form.Item>

        <Form.Item name="newPassword" rules={[{ required: true, message: '请输入新密码!' }]}>
          <Input.Password placeholder="设置密码" size="large" />
        </Form.Item>

        <Form.Item name="confirmPassword" rules={[{ required: true, message: '请再次输入新密码!' }]}>
          <Input.Password placeholder="再次输入密码" size="large" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
            确认修改
          </Button>
        </Form.Item>
      </Form>
    </LoginWrap>
  );
};

export default Login;
