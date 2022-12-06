import { Button, Checkbox, Descriptions } from 'antd';
import { reviewUserRoleTypeEnum } from '@/dataType';
import styles from './sign.module.less';

import { StepProps, StepCompType } from '../msg.d';

import { stepState } from '../basicContext';
import { useSnapshot } from 'valtio';

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

  return (
    <div className={styles.signContent}>
      <div className={styles.signPic}>
        线上签到
        <Button
          type="primary"
          onClick={onCheck}
          disabled={member.find((v) => v.userId === msgData.self.userId)?.isCheck}
        >
          快捷签到
        </Button>
      </div>
      <Descriptions bordered column={1}>
        {reviewUserRoleTypeEnum.map((v) => (
          <Descriptions.Item
            key={v.value}
            label={v.label}
            labelStyle={{ width: 150, fontWeight: 500, borderRight: 'none' }}
          >
            {member
              ?.filter((u) => u.userRole === v.value)
              ?.map((u) => (
                <Checkbox checked={u.isCheck} key={u.userId}>
                  {u.userName}
                </Checkbox>
              ))}
          </Descriptions.Item>
        ))}
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
