import { stepState } from '../basicContext';
import { useSnapshot } from 'valtio';
import { StepProps } from '../msg.d';

import styles from './index.module.less';

const Record: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const { record } = useSnapshot(stepState);

  return (
    <div>
      {record?.map((v) => (
        <div key={v.id}>
          <div>{v.createTime}</div>
          <div>
            <div>{v.userName}</div>
            <div>{v.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Record;
