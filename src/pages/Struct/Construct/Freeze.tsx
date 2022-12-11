import { Modal } from 'antd';

import { basicState } from './basicState';
import { useSnapshot } from 'valtio';

const Freeze = () => {
  const { isFreeze, specialOpes } = useSnapshot(basicState);
  return (
    <>
      <Modal open={specialOpes?.length > 0} footer={null} closable={false}>
        正在执行覆盖/移动的操作，请等待服务器执行完成
      </Modal>
      <Modal open={isFreeze} footer={null} closable={false}>
        正在执行重置的操作，请等待服务器执行完成
      </Modal>
    </>
  );
};

export default Freeze;
