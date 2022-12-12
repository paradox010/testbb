import { Badge } from 'antd';
import styles from './index.module.less';
import { StepProps } from '../msg.d';

import { stepState } from '../basicContext';
import { useSnapshot } from 'valtio';

const Online: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const { member } = useSnapshot(stepState);

  return (
    <div className={styles.online}>
      <div className={styles.header}>
        <span>
          <Badge status="success" />
          在线人员({member?.filter((v) => v.isOnline).length})
        </span>
        <span>
          <Badge status="error" />
          离线人员({member?.filter((v) => !v.isOnline).length})
        </span>
      </div>
      <div style={{ padding: '0 12px' }}>
        {member?.map((v) => (
          <div key={v.userId} className={styles.user}>
            <Badge status={v.isOnline ? 'success' : 'error'} />
            {v.userName}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Online;
