import { Button, Checkbox, Descriptions, Statistic } from 'antd';
import styles from './checkin.module.less';
import checkImgUrl from '@/assets/checkIn.png';

import { StepProps, StepCompType } from '../msg.d';

import BasicContext, { stepState } from '../basicContext';
import { useSnapshot } from 'valtio';
import { useContext } from 'react';

const Step: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const onCheck = () => {
    stepMsg$.emit({
      type: 'check',
      content: {
        isCheck: true,
        userId: msgData.self.userId,
      },
    });
  };
  const { member } = useSnapshot(stepState);
  const basic = useContext(BasicContext);
  return (
    <div className={styles.checkContent}>
      <div className={styles.checkPic} >
        <img src={checkImgUrl} />
        <div className={styles.checkText}>
          <div className={styles.upText}>线上签到</div>
          <div>请点击右侧按钮进行签到</div>
        </div>
        <Button
          type="primary"
          onClick={onCheck}
          style={{ float: 'right' }}
          disabled={member.find((v) => v.userId === msgData.self.userId)?.isCheck}
        >
          一键签到
        </Button>
        <div style={{ position: 'absolute', bottom: 5, right: 34 }}>
          <span>签到截止倒计时：  </span>
          <Statistic.Countdown
            style={{ display: 'inline-block' }}
            value={basic.startTime + 60 * 1000 * 15}
            format="mm:ss"
          />
        </div>
      </div>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="与会专家" labelStyle={{ width: 150, fontWeight: 500, borderRight: 'none' }}>
          {member
            ?.filter((u) => u.userRole !== '4')
            ?.map((u) => (
              <Checkbox disabled checked={u.isCheck} key={u.userId}>
                <span style={{ color: '#000000d9' }}>{u.userName}</span>
              </Checkbox>
            ))}
        </Descriptions.Item>
        <Descriptions.Item label="听证人" labelStyle={{ width: 150, fontWeight: 500, borderRight: 'none' }}>
          {member
            ?.filter((u) => u.userRole === '4')
            ?.map((u) => (
              <Checkbox disabled checked={u.isCheck} key={u.userId}>
                <span style={{ color: '#000000d9' }}>{u.userName}</span>
              </Checkbox>
            ))}
        </Descriptions.Item>
        {/* {reviewUserRoleTypeEnum.map((v) => (
          <Descriptions.Item
            key={v.value}
            label={v.label}
            labelStyle={{ width: 150, fontWeight: 500, borderRight: 'none' }}
          >
            {member
              ?.filter((u) => u.userRole === v.value)
              ?.map((u) => (
                <Checkbox disabled checked={u.isCheck} key={u.userId}>
                  <span style={{ color: '#000000d9' }}>{u.userName}</span>
                </Checkbox>
              ))}
          </Descriptions.Item>
        ))} */}
      </Descriptions>
    </div>
  );
};

const TypedStep = Step as StepCompType;

TypedStep.Title = ({ stepMsg$, msgData }) => {
  const goNext = () => {
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 2,
      },
    });
  };
  const { userRole } = msgData.self;
  return (
    <>
      到场签到
      {userRole === '1' ? (
        <Button type="primary" onClick={goNext}>
          会议开始
        </Button>
      ) : null}
    </>
  );
};

export default TypedStep;
