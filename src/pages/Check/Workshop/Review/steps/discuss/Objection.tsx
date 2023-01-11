import { AlertOutlined } from '@ant-design/icons';
import { useDebounceFn } from 'ahooks';
import { Badge, message, Tooltip } from 'antd';
import { useSnapshot } from 'valtio';
import { stepState } from '../../basicContext';
import { StepProps } from '../../msg';

import styles from './index.module.less';

const Objection: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const { objection } = useSnapshot(stepState);

  const { run } = useDebounceFn(
    (value) => {
      handleVote(value);
    },
    {
      wait: 200,
    },
  );

  const handleVote = (value) => {
    if (!(msgData?.voteCenter?.getLatest() || { isFinished: true }).isFinished) {
      message.warn('请结束当前投票后再进入下一阶段');
      return;
    }
    stepMsg$.emit({
      type: 'compVote',
      content: {
        type: 1,
        content: value,
      },
    });
  };

  return (
    <div className={styles.objectionList} style={{ height: '100%', overflowY: 'auto' }}>
      {objection?.map((v) => (
        <div className={styles.item} key={v.id} style={{ position: 'relative' }}>
          <div className={styles.man}>
            <span>{v.objectionCount >= 3 ? v.userName : '匿名异议'}</span>
            {v.objectionCount >= 3 && <Badge count={v.objectionCount} color="#faad14" />}
            <Tooltip title="发起投票">
              <AlertOutlined onClick={() => run(v.recordContent)} />
            </Tooltip>
          </div>
          <div className={styles.content}>
            {v.objectionCount >= 3 && <>{v.userName}</>}
            对“{v.recordContent}”提出异议
          </div>
        </div>
      ))}
    </div>
  );
};

export default Objection;
