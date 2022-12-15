import { StepProps } from './msg.d';
import { Modal, Button } from 'antd';

import { stepState } from './basicContext';
import { useSnapshot } from 'valtio';

import styles from './index.module.less';
import { LockFilled, UnlockFilled } from '@ant-design/icons';

const Freeze: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const { isFreeze, specialOpes } = useSnapshot(stepState);
  // open={specialOpes?.length > 0}
  const free = () => {
    stepMsg$.emit({
      type: 'freeze',
      content: {
        isFreeze: false,
      },
    });
  };
  return (
    <>
      <Modal
        maskStyle={{
          background: '#ffffff59',
          position: 'absolute',
        }}
        wrapClassName="ds-partial-modal"
        getContainer={() => document.getElementById('stepRoot') || document.body}
        open={specialOpes?.length > 0}
        footer={null}
        closable={false}
      >
        正在执行覆盖/移动的操作，请等待服务器执行完成
      </Modal>
      <Modal
        open={isFreeze}
        footer={null}
        closable={false}
        centered
        maskStyle={{
          background: '#ffffff59',
          backdropFilter: 'blur(5px)',
          position: 'absolute',
        }}
        wrapClassName="ds-partial-modal"
        getContainer={() => document.getElementById('stepRoot') || document.body}
        className={styles.freezeModal}
      >
        <div className={styles.freezeContent}>
          <LockFilled />
          <div>会议冻结中...</div>
          {msgData.self.userRole === '4' && (
            <Button onClick={free} icon={<UnlockFilled />} style={{ margin: 20 }} type="primary">
              解冻会议
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Freeze;
