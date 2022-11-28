import { Button, Checkbox, Descriptions } from 'antd';
import { RoleType } from '@/dataType';
import styles from './sign.module.less';

const pp = [
  {
    userId: '1',
    userName: 'a',
  },
  {
    userId: '2',
    userName: 'b',
  },
];
const Sign = ({ stepMsg$, msgData }) => {
  return (
    <div className={styles.signContent}>
      <div className={styles.signPic}>
        线上签到<Button type="primary">快捷签到</Button>
      </div>
      <Descriptions bordered column={1}>
        {RoleType.map((v) => (
          <Descriptions.Item
            key={v.value}
            label={v.label}
            labelStyle={{ width: 150, fontWeight: 500, borderRight: 'none' }}
          >
            {pp.map((u) => (
              <Checkbox key={u.userId}>{u.userName}</Checkbox>
            ))}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </div>
  );
};

Sign.Title = ({ stepMsg$, msgData }) => {
  return (
    <>
      到场签到
      <Button type="primary">会议开始</Button>
    </>
  );
};
Sign.Tool = null;
export default Sign;
