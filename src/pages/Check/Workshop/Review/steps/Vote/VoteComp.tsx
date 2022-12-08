import { Button, Descriptions, Progress } from 'antd';
import React, { useContext } from 'react';

import styles from './index.module.less';

import type { VoteItem } from '../../socketClass/VoteCenter';
import BasicContext from '../../basicContext';

type ModalType = 'modal' | 'review';
export interface VoteCompProps {
  userType: string;
  modalType?: ModalType;
  vote?: VoteItem;
  onForcePass?: (v: VoteItem) => void;
  onVote: (v: any) => void;
}
const VoteComp: React.FC<VoteCompProps> = ({ userType, modalType = 'modal', vote, onVote, onForcePass }) => {
  if (!vote) return <span>暂无投票</span>;
  if (userType === '1' || userType === '2' || userType === '3') {
    if (!vote.isFinished) {
      if (!vote.isVote) {
        return <VoteStart data={vote} modalType={modalType} onVote={onVote} />;
      }
      return <VoteOk modalType={modalType} />;
    }
    return <Witness data={vote} modalType={modalType} userType={userType} />;
  }
  if (userType === '4') {
    return <Witness onForcePass={onForcePass} data={vote} modalType={modalType} userType={userType} />;
  }
  return null;
};

const VoteStart: React.FC<{
  data: VoteItem;
  modalType: ModalType;
  onVote: (v: any) => void;
}> = ({ data, modalType, onVote }) => {
  const onInnerVote = (isAgree) => {
    onVote({
      id: data.id,
      createTime: data.createTime,
      isAgree,
    });
  };
  return (
    <div style={{ padding: 80 }}>
      {modalType === 'review' && <span className={styles.messagePic} />}
      <div className={styles.textContent}>
        {modalType === 'modal' ? `对于提议“${data?.content}”，您是否同意` : '对本次修改版本，是否通过'}
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" className="ds-green-btn" style={{ marginRight: 16 }} onClick={() => onInnerVote(true)}>
          通过
        </Button>
        <Button type="primary" danger onClick={() => onInnerVote(false)}>
          拒绝
        </Button>
      </div>
    </div>
  );
};

const VoteOk = ({ modalType }) => {
  return (
    <div style={{ padding: 80 }}>
      {modalType === 'review' && <div className={styles.waittingPic} />}
      <div className={styles.textContent}>您已投票成功，请等待投票结果...</div>
    </div>
  );
};

export const Witness: React.FC<{
  data: VoteItem;
  modalType: ModalType;
  userType?: string;
  noTitle?: boolean;
  onForcePass?: (v: VoteItem) => void;
}> = ({ data, modalType, userType = '1', onForcePass, noTitle = false }) => {
  const basic = useContext(BasicContext);
  const onForce = () => {
    onForcePass && onForcePass(data);
  };

  const vote = data?.voteResult?.length;
  const total = basic.member.length - 1;
  const pass = data?.voteResult?.reduce((num, v) => num + (v.isAgree ? 1 : 0), 0) || 0;
  const passPercent = vote ? (pass / total) * 100 : 0;
  const refuse = data?.voteResult?.reduce((num, v) => num + (v.isAgree ? 0 : 1), 0) || 0;
  return (
    <>
      {modalType === 'modal' && !noTitle && <div className={styles.voteResTitle}>投票信息</div>}
      {modalType === 'review' && !noTitle && userType !== '4' && (
        <div className={styles.voteResTitle} style={{ textAlign: 'center', margin: '40px 0 0' }}>
          投票结果
        </div>
      )}
      <div className={modalType === 'review' ? styles.reviewUpVote : styles.modalUPVote}>
        <div className={styles.vote1}>
          <div className={styles.posiRes}>
            <div>投票通过人员</div>
            <div className={styles.resPeople}>{pass}人</div>
          </div>
          <div className={styles.vsWrap}>V&nbsp;S</div>
          <div className={styles.negaRes}>
            <div>投票不通过人员</div>
            <div className={styles.resPeople}>{refuse}人</div>
          </div>
        </div>
        <div className={styles.vote2}>
          <div className={styles.vote21}>
            <div className={styles.progressWrap}>
              <Progress strokeLinecap="butt" strokeWidth={14} type="circle" percent={passPercent} width={64} />
            </div>
            <div style={{ padding: '0 12px' }}>
              <div>投票通过率</div>
              <div className={styles.percent}>{passPercent}%</div>
            </div>
            {userType === '4' && (
              <div className={styles.forceWrap}>
                <Button type="primary" onClick={onForce} disabled={data.isFinished}>
                  强制通过
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {userType === '4' && (
        <Descriptions
          layout="vertical"
          className={modalType === 'review' ? styles.reviewDownVote : styles.modalDownVote}
          bordered
        >
          <Descriptions.Item label={<div style={modalType === 'modal' ? { maxWidth: 200 } : {}}>投票信息</div>}>
            <div className={styles.td1}>
              <Progress strokeLinecap="butt" strokeWidth={14} type="circle" percent={(vote / total) * 100} width={53} />
              <div style={{ padding: '0 12px' }}>
                <div>投票总人数</div>
                <div className={styles.percent}>{total}</div>
              </div>
              <div>
                <div>已投票人员 {vote}人</div>
                <div>未投票人员 {total - vote}人</div>
              </div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <div style={{ lineHeight: '32px' }}>
                未投票人员<Button style={{ float: 'right' }}>一键提醒</Button>
              </div>
            }
          >
            <div>
              {basic.member
                .filter((v) => !data?.voteResult?.find((k) => k.userId === v.userId))
                .filter((v) => v.userRole !== '4')
                ?.map((v) => v.userName)
                .join('；')}
            </div>
          </Descriptions.Item>
        </Descriptions>
      )}
    </>
  );
};

export default VoteComp;
