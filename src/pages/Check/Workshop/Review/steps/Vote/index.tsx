import { Button, Checkbox, Descriptions } from 'antd';
import { useState } from 'react';
import VoteComp from './VoteComp';
import type { VoteCompProps } from './VoteComp';

import styles from './index.module.less';

import { StepProps, StepCompType } from '../../msg.d';

const Step: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const [voteData, setVoteData] = useState<Omit<VoteCompProps, 'userType'>>({
    isVote: true,
    voteType: 'vote_end',
  });

  return (
    <div className={styles.signContent}>
      <VoteComp userType="4" {...voteData} type="review" />
    </div>
  );
};

const TypedStep = Step as StepCompType;

TypedStep.Title = ({ stepMsg$, msgData }) => {
  return (
    <>
      评审投票
      <Button type="primary">进入签名</Button>
    </>
  );
};
export default TypedStep;
