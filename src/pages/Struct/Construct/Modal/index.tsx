import { useState } from 'react';

import { EventEmitter } from 'ahooks/lib/useEventEmitter';
import type { MsgType } from '../msg.d';

import type { YTree as YTreeType } from '../Tree/node';

import { Modal } from 'antd';
import AddModal from './AddModal';
import UpdateModal from './UpdateModal';
import MoveModal from './MoveModal';
import DeleteModal from './DeleteModal';

interface TreeProps {
  yTree: YTreeType;
  treeMsg$: EventEmitter<MsgType>;
}
interface ModalData {
  id?: string;
  name?: string;
  description?: string;
  editStatus?: number;
  parentId?: string;
  parentName?: string;
}
const MyModal: React.FC<TreeProps> = ({ treeMsg$, yTree }) => {
  const [modal, setModal] = useState({
    open: '',
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    modalData: {} as ModalData,
  });
  const closeModal = () => {
    setModal({ open: '', modalData: {} as any });
  };

  treeMsg$.useSubscription((msg) => {
    if (msg.type === 'modal') {
      setModal({
        open: msg.open,
        modalData: msg.modalData || {},
      });
    }
  });

  const onAdd = (values) => {
    if (!modal.modalData?.id) return;
    treeMsg$.emit({
      type: 'operation',
      content: {
        id: new Date().valueOf(),
        opeType: 'add',
        newNodes: [{ ...values, parentId: modal.modalData.id }],
      },
    });
    // close事件应当挂个定时器去处理
    closeModal();
  };
  const onUpdate = (values) => {
    if (!modal.modalData?.id) return;
    if (modal.modalData?.editStatus === -1) return;
    treeMsg$.emit({
      type: 'operation',
      content: {
        id: new Date().valueOf(),
        opeType: 'update',
        newNodes: [{ ...values, id: modal.modalData.id }],
      },
    });
    closeModal();
  };
  const onDelete = () => {
    if (!modal.modalData?.id) return;
    if (modal.modalData?.editStatus === -1) return;
    treeMsg$.emit({
      type: 'operation',
      content: {
        id: new Date().valueOf(),
        opeType: 'delete',
        newNodes: [{ id: modal.modalData?.id, name: modal.modalData?.name }],
      },
    });
    closeModal();
  };
  const onMove = (values) => {
    if (!modal.modalData?.id) return;
    treeMsg$.emit({
      type: 'operation',
      content: {
        id: new Date().valueOf(),
        opeType: 'move',
        newNodes: [{ ...values, id: modal.modalData.id }],
      },
    });
    closeModal();
  };
  const onMoveConfirm = () => {
    const { id, parentId, name } = modal.modalData;
    if (!id || !parentId) return;
    treeMsg$.emit({
      type: 'operation',
      content: {
        id: new Date().valueOf(),
        opeType: 'move',
        newNodes: [{ parentId, id, name }],
      },
    });
    closeModal();
  };

  // const onDetail = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   const { index } = event.currentTarget.dataset;
  //   if (!index) return;
  //   console.log(index);
  // };

  return (
    <>
      <AddModal open={modal.open === 'add'} onCancel={closeModal} onOk={onAdd} modalData={modal.modalData} />
      <UpdateModal open={modal.open === 'update'} onCancel={closeModal} onOk={onUpdate} modalData={modal.modalData} />
      <MoveModal
        open={modal.open === 'move'}
        onCancel={closeModal}
        onOk={onMove}
        modalData={modal.modalData}
        yTree={yTree}
      />
      <DeleteModal open={modal.open === 'delete'} onCancel={closeModal} onOk={onDelete} modalData={modal.modalData} />
      <Modal title={null} open={modal.open === 'move_confirm'} onCancel={closeModal} onOk={onMoveConfirm}>
        <div style={{ fontSize: 16 }}>
          确定将<span style={{ background: '#bae7ff', padding: '5px 10px' }}>{modal.modalData?.name}</span>移动到
          <span style={{ background: '#c5c5e3', padding: '5px 10px' }}>{modal.modalData?.parentName}</span>下吗？
        </div>
      </Modal>
    </>
  );
};
export default MyModal;
