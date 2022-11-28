import { Modal } from 'antd';
import { useState } from 'react';
import VoteComp from '../Vote/VoteComp';
import type { VoteCompProps } from '../Vote/VoteComp';

const VoteModal = () => {
  const [open, setOpen] = useState(true);
  const [voteData, setVoteData] = useState<Omit<VoteCompProps, 'userType'>>({
    isVote: false,
    vote: {
      voteId: '11',
      voteName: '新增xxxx',
    },
    voteType: 'vote_end',
  });

  return (
    <Modal open={open} footer={null} width={620}>
      <VoteComp userType="1" {...voteData} />
    </Modal>
  );
};

export default VoteModal;
