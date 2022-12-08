import { stepState } from '../basicContext';
import { useSnapshot } from 'valtio';
import { StepProps } from '../msg.d';

import dayjs from 'dayjs';

import styles from './index.module.less';
import { Badge } from 'antd';

const Record: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const { record } = useSnapshot(stepState);

  return (
    <div>
      {record?.map((v) => (
        <div className={styles.item} key={v.id}>
          <div className={styles.date}>{dayjs(v.createTime).format('HH:mm')}</div>
          <Badge color="blue" />
          <div className={styles.ope} data-index={v.categoryId}>
            <div className={styles.man}>{v.userName}</div>
            <div>{v.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Record;
