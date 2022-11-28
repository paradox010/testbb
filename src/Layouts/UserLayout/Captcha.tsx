import { Input } from 'antd';
import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { request } from 'ice';

import styles from './index.module.less';

async function getImage() {
  const resData = await request({
    url: '/api/sys/sysUser/captcha',
  });
  return resData;
}

interface captchaValue {
  captchaCode?: string;
  uid?: string;
}

interface CaptchaInputProps {
  value?: captchaValue;
  onChange?: (value: captchaValue) => void;
}

const Captcha: React.FC<CaptchaInputProps> = ({ value = {}, onChange }) => {
  const [code, setCode] = useState('');

  const { data, run } = useRequest(getImage);

  const triggerChange = (changedValue) => {
    onChange?.({ ...value, ...changedValue });
  };

  const onCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    triggerChange({ captchaCode: newCode, uid: data?.uid });
  };

  return (
    <span className={styles.captchaWrap}>
      <Input
        size="large"
        value={code}
        placeholder="请输入验证码"
        onChange={onCodeChange}
        addonAfter={<img src={data?.image} onClick={run} />}
      />
    </span>
  );
};

export default Captcha;
