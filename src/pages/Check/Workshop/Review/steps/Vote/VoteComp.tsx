import { Button, Descriptions, Progress } from 'antd';
import React from 'react';

import styles from './index.module.less';

interface VoteType {
  voteId: string;
  voteName: string;
}

type VoteList = Array<{ userId: string; isVote?: boolean; isPositive?: boolean }>;

type VoteModalType = 'vote_start' | 'vote_end';

export interface VoteCompProps {
  vote?: VoteType;
  voteList?: VoteList;
  isVote?: boolean;
  voteType?: VoteModalType;
  userType: string;
  type?: 'modal' | 'review';
}
const VoteComp: React.FC<VoteCompProps> = ({
  userType,
  vote,
  voteList,
  isVote,
  voteType = 'vote_start',
  type = 'modal',
}) => {
  if (userType === '1' || userType === '2' || userType === '3') {
    if (voteType === 'vote_start') {
      if (!isVote) {
        return <VoteStart data={vote} type={type} />;
      }

      return <VoteOk type={type} />;
    }
    return <Witness data={voteList} type={type} userType={userType} />;
  }
  if (userType === '4') {
    return <Witness data={voteList} type={type} userType={userType} />;
  }
  return null;
};

const VoteStart = ({ data, type }) => {
  return (
    <div style={{ padding: 80 }}>
      {type === 'review' && <div className={styles.messagePic} />}
      <div className={styles.voteName}>
        {type === 'modal' ? `对于提议“${data?.voteName}”，您是否同意` : '对本次修改版本，是否通过'}
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" className="ds-green-btn" style={{ marginRight: 16 }}>
          通过
        </Button>
        <Button type="primary" danger>
          拒绝
        </Button>
      </div>
    </div>
  );
};

const VoteOk = ({ type }) => {
  return (
    <div style={{ padding: 80 }}>
      {type === 'review' && <div className={styles.waittingPic} />}
      <div className={styles.voteName}>您已投票成功，请等待投票结果...</div>
    </div>
  );
};

export const Witness = ({ data, type, userType = '1' }) => {
  return (
    <>
      {type === 'modal' && userType !== '4' && <div className={styles.voteResTitle}>投票信息</div>}
      {type === 'review' && userType !== '4' && (
        <div className={styles.voteResTitle} style={{ textAlign: 'center', margin: '40px 0 0' }}>
          投票结果
        </div>
      )}
      <div className={type ? styles.upVote : ''}>
        <div className={styles.vote1}>
          <div className={styles.posiRes}>
            <div>投票通过人员</div>
            <div className={styles.resPeople}>23人</div>
          </div>
          <div className={styles.vsWrap}>V&nbsp;S</div>
          <div className={styles.negaRes}>
            <div>投票不通过人员</div>
            <div className={styles.resPeople}>23人</div>
          </div>
        </div>
        <div className={styles.vote2}>
          <div className={styles.vote21}>
            <div className={styles.progressWrap}>
              <Progress strokeLinecap="butt" strokeWidth={14} type="circle" percent={75} width={64} />
            </div>
            <div style={{ padding: '0 12px' }}>
              <div>投票通过率</div>
              <div className={styles.percent}>100%</div>
            </div>
            <div className={styles.forceWrap}>
              <Button type="primary">强制通过</Button>
            </div>
          </div>
        </div>
      </div>
      {type === 'review' && userType === '4' && (
        <Descriptions layout="vertical" className={styles.downVote} bordered>
          <Descriptions.Item label="投票信息">
            <div className={styles.td1}>
              <Progress strokeLinecap="butt" strokeWidth={14} type="circle" percent={75} width={53} />
              <div style={{ padding: '0 12px' }}>
                <div>投票总人数</div>
                <div className={styles.percent}>100</div>
              </div>
              <div>
                <div>已投票人员 34</div>
                <div>已投票人员 34</div>
              </div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="未投票人员">1,23,4</Descriptions.Item>
        </Descriptions>
      )}
    </>
  );
};

export default VoteComp;
