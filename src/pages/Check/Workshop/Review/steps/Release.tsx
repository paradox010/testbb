import { Button, DatePicker, Descriptions, message, Select } from 'antd';
import styles from './release.module.less';
import { Witness } from './Vote/VoteComp';

import { StepProps, StepCompType } from '../msg.d';
import { useContext, useEffect, useState } from 'react';
import { VoteItem } from '../socketClass/VoteCenter';
import BasicContext, { stepState } from '../basicContext';
import { useSnapshot } from 'valtio';
import { request } from 'ice';
import { useRequest } from 'ahooks';

async function getVersionList(params) {
  return request({
    url: '/api/standard/domain/getOptionalVersion',
    params,
  });
}

const Step: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const basic = useContext(BasicContext);
  const state = useSnapshot(stepState);
  const [data, setData] = useState<VoteItem | undefined>();

  stepMsg$.useSubscription((msg) => {
    if (msg.type === 'refreshVote') {
      const v = msgData.voteCenter.getLatest();
      if (v?.voteResult?.find((r) => r.userId === msgData.self.userId)) {
        v.isVote = true;
      }
      setData(v ? { ...v } : v);
    }
  });

  const { data: selectOptions, run } = useRequest(getVersionList, {
    manual: true,
  });

  useEffect(() => {
    run({
      reviewId: basic.id,
      domainId: basic.domainId,
    });
  }, []);

  return (
    <div className={styles.signContent}>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="行业标准名称">{basic.domainName || '-'}</Descriptions.Item>
        <Descriptions.Item label="发布标准版本号">
          {basic.userRole === '1' && !state.version ? (
            <Select
              style={{ width: 200 }}
              value={state.selectVersion}
              onChange={(v) => {
                stepState.selectVersion = v;
              }}
              options={selectOptions?.map((v) => ({ label: v, value: v }))}
            />
          ) : (
            state.version || '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="投票详情" span={2}>
          <Witness userType="3" modalType="modal" data={(data || {}) as VoteItem} noTitle />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

const TypedStep = Step as StepCompType;

const Title: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const state = useSnapshot(stepState);
  const goBefore = () => {
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 6,
      },
    });
  };

  const onSubmit = () => {
    if (!state.selectVersion || state.selectVersion === '') {
      message.error('请选择版本号');
      return;
    }
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 7,
        version: state.selectVersion,
      },
    });
  };
  return (
    <>
      定时发布
      {msgData.self.userRole === '1' && (
        <>
          <Button type="primary" onClick={onSubmit}>
            确认
          </Button>
          {process.env.NODE_ENV === 'development' && <Button onClick={goBefore}>上一步</Button>}
        </>
      )}
    </>
  );
};
TypedStep.Title = Title;
export default TypedStep;
