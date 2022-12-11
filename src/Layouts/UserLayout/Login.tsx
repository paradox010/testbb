import { Form, Input, Checkbox, Button } from 'antd';

import Captcha from './Captcha';
import LoginWrap from './LoginWrap';

import { useRequest } from 'ahooks';
import { history, request } from 'ice';

import styles from './index.module.less';
import { useState } from 'react';
import { getParams } from '@/utils/location';
import { setToken } from '@/utils/auth';

async function loginUp(params) {
  const resData = await request({
    url: '/api/sys/sysUser/login',
    method: 'post',
    data: params,
  });
  return resData;
}

const Login = () => {
  const [updateImage, setU] = useState(1);
  const { run } = useRequest(loginUp, {
    manual: true,
    onSuccess: (data) => {
      setToken(data?.tokenValue);
      // const redirect = getParams()?.redirect;
      // if (redirect) {
      //   window.location.assign(redirect);
      // } else {
        window.location.assign('/');
      // }
    },
    onError: () => {
      setU(Math.random());
    },
  });

  const onFinish = (v) => {
    const { captcha, ...rest } = v;
    run({ ...rest, ...captcha });
  };

  const goPassword = () => {
    history?.push('/user/newPassword');
  };
  return (
    <LoginWrap>
      <Form name="login" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish} autoComplete="off">
        <Form.Item style={{ marginBottom: 54 }}>
          <div className={styles.formTitle}>登录</div>
        </Form.Item>

        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
          <Input placeholder="请输入用户名" size="large" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
          <Input.Password placeholder="请输入密码" size="large" />
        </Form.Item>

        <Form.Item name="captcha" rules={[{ required: true, message: '请输入密码!' }]}>
          <Captcha updateImage={updateImage} />
        </Form.Item>

        {/* <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

        <Form.Item style={{ flex: '1' }}>
          <div className={styles.linkOpe}>
            <a>尚未注册</a>
            <a onClick={goPassword}>忘记密码</a>
          </div>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </LoginWrap>
  );
};

export default Login;
