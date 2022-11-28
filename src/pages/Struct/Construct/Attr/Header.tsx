import { Descriptions } from 'antd';
import { useState } from 'react';

import styles from './index.module.less';

export default ({ attrMsg$ }) => {
  const [data, setdata] = useState({} as any);
  attrMsg$.useSubscription((msg) => {
    if (msg.type === 'refreshCategory') {
      setdata(msg.content);
    }
  });

  return (
    <Descriptions title="基础信息" bordered className={styles.header} size="middle" column={1}>
      <Descriptions.Item label="名称" labelStyle={{ width: 120 }}>
        {data.name}
      </Descriptions.Item>
      <Descriptions.Item label="描述" labelStyle={{ width: 120 }}>
        {data.description}
      </Descriptions.Item>
    </Descriptions>
  );
};
