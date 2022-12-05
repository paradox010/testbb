import { Descriptions } from 'antd';

import styles from './index.module.less';

export default ({ data }) => {
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
