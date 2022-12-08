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
      <Modal open={specialOpes?.length > 0} footer={null} closable={false}>
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
        }}
        className={styles.freezeModal}
      >
        <div className={styles.freezeContent}>
          <LockFilled />
          <div>会议冻结中...</div>
          <Button onClick={free} icon={<UnlockFilled />} style={{ margin: 20 }} type="primary">
            解冻会议
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Freeze;
