import { Button, Checkbox, Descriptions } from 'antd';
import { RoleType } from '@/dataType';
import { useState } from 'react';
import VoteComp from './VoteComp';
import type { VoteCompProps } from './VoteComp';

import styles from './index.module.less';

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
const Vote = ({ stepMsg$, msgData }) => {
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

Vote.Title = ({ stepMsg$, msgData }) => {
  return (
    <>
      评审投票
      <Button type="primary">进入签名</Button>
    </>
  );
};
Vote.Tool = null;
export default Vote;
