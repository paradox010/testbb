import { Button, Checkbox, Descriptions, message } from 'antd';
import { useState, useContext } from 'react';
import VoteComp from './VoteComp';

import styles from './index.module.less';

import { VoteItem } from '../../socketClass/VoteCenter';

import { StepProps, StepCompType } from '../../msg.d';
import BasicContext from '../../basicContext';

const Step: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const [data, setData] = useState<VoteItem | undefined>();
  const basic = useContext(BasicContext);

  stepMsg$.useSubscription((msg) => {
    if (msg.type === 'refreshVote') {
      const v = msgData.voteCenter.getLatest();
      if (v?.voteResult?.find((r) => r.userId === msgData.self.userId)) {
        v.isVote = true;
      }
      setData(v ? { ...v } : v);
    }
  });

  const [open, setOpen] = useState(false);
  const onVote = (res) => {
    stepMsg$.emit({
      type: 'compVote',
      content: { ...res, type: 3, userId: msgData.self.userId },
    });
  };
  const onForcePass = (res) => {
    stepMsg$.emit({
      type: 'compVote',
      content: { ...res, type: 2, isFinished: true },
    });
  };
  const onRemind = (res) => {
    stepMsg$.emit({
      type: 'remind',
      content: { ...res },
    });
  };

  return (
    <div className={styles.signContent}>
      <VoteComp
        onRemind={onRemind}
        modalType="review"
        userType={basic.self.userRole}
        vote={data}
        onVote={onVote}
        onForcePass={onForcePass}
      />
    </div>
  );
};

const TypedStep = Step as StepCompType;

TypedStep.Title = ({ stepMsg$, msgData }) => {
  const goNext = () => {
    const v = msgData.voteCenter.getLatest();
    if (v?.isFinished) {
      stepMsg$.emit({
        type: 'process',
        content: {
          processState: 6,
        },
      });
    } else {
      message.warn('投票未结束');
    }
  };
  const goBefore = () => {
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 4,
      },
    });
  };

  return (
    <>
      评审投票
      {msgData.self.userRole === '1' && (
        <>
          <Button type="primary" onClick={goNext}>
            进入签名
          </Button>
          {process.env.NODE_ENV === 'development' && <Button onClick={goBefore}>上一步</Button>}
        </>
      )}
    </>
  );
};
export default TypedStep;
