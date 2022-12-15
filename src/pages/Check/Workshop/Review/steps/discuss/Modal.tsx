import { Modal } from 'antd';
import { useContext, useState } from 'react';
import VoteComp from '../Vote/VoteComp';

import { StepProps } from '../../msg.d';
import { VoteItem } from '../../socketClass/VoteCenter';

import styles from './index.module.less';
import BasicContext, { stepState } from '../../basicContext';
import { useSnapshot } from 'valtio';

const VoteModal: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const [data, setData] = useState<VoteItem | undefined>();
  const { isFreeze } = useSnapshot(stepState);
  const basic = useContext(BasicContext);

  stepMsg$.useSubscription((msg) => {
    if (msg.type === 'refreshVote') {
      const v = msgData.voteCenter.getLatest();
      // 什么时候需要强制showmodal
      // 1. 强制提醒，走额外的mestype
      // 2. 当投票结束时，id相同，type需要从其他值转成新值
      // 3. 投票id变动

      if (v?.voteResult?.find((r) => r.userId === msgData.self.userId)) {
        v.isVote = true;
      }
      if (!data) {
        setData(v ? { ...v } : v);
        setOpen(!v?.isFinished || false);
        return;
      }
      if (!v) {
        setData(v);
        return;
      }
      if (data.id !== v.id) {
        setData(v ? { ...v } : v);
        setOpen(!v?.isFinished || false);
        return;
      }
      setData(v ? { ...v } : v);
      if (!v.isFinished && !v.isVote) {
        setOpen(true);
      }
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
    <>
      <div
        className={styles.voteFixedBtn}
        onClick={() => {
          setOpen(true);
        }}
      >
        投票
      </div>
      <Modal
        open={!isFreeze && open}
        footer={null}
        width={700}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <VoteComp
          onRemind={onRemind}
          userType={basic.self.userRole}
          vote={data}
          onVote={onVote}
          onForcePass={onForcePass}
        />
      </Modal>
    </>
  );
};

export default VoteModal;
