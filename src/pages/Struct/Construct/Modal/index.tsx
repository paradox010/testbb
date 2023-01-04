import { useState } from 'react';

import { EventEmitter } from 'ahooks/lib/useEventEmitter';
import type { MsgType, ModalDataType } from '../msg.d';

import type { YTree as YTreeType } from '../Tree/node';

import { message, Modal } from 'antd';
import AddModal from './AddModal';
import UpdateModal from './UpdateModal';
import MoveModal from './MoveModal';
import MoveConfirmModal from './MoveConfirmModal';
import DeleteModal from './DeleteModal';
import ReviewMoveModal from './ReviewMoveModal';
import ImportModal from './ImportModal';

interface TreeProps {
  yTree: YTreeType;
  treeMsg$: EventEmitter<MsgType>;
}
type ModalData = ModalDataType;
const MyModal: React.FC<TreeProps> = ({ treeMsg$, yTree }) => {
  const [modal, setModal] = useState<{
    open: string;
    modalData?: ModalData;
  }>({
    open: '',
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    modalData: {},
  });
  const closeModal = () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    setModal({ open: '', modalData: {} });
  };

  treeMsg$.useSubscription((msg) => {
    if (msg.type === 'modal') {
      setModal({
        open: msg.open,
        modalData: msg.modalData,
      });
    }
  });

  const onAdd = (values) => {
    // if (!modal.modalData?.id) return;
    treeMsg$.emit({
      type: 'operation',
      content: {
        id: new Date().valueOf(),
        opeType: 'add',
        newNodes: [{ ...values, parentId: modal.modalData?.id }],
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
    const { id, parentId, name, offset } = modal.modalData || {};

    if (!id) return;
    treeMsg$.emit({
      type: 'operation',
      content: {
        id: new Date().valueOf(),
        opeType: 'move',
        newNodes: [{ parentId, id, name, offset }],
      },
    });
    closeModal();
  };

  // const onDetail = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   const { index } = event.currentTarget.dataset;
  //   if (!index) return;
  //   console.log(index);
  // };

  const onSyncOk = (values?: any) => {
    const { id, domainPubId } = modal.modalData || {};
    let { parentId } = modal.modalData || {};
    if (values) {
      parentId = values.parentId;
    }
    if (!id || !parentId || !domainPubId) {
      message.warn('缺失节点信息');
      return;
    }
    treeMsg$.emit({
      type: 'operation',
      content: {
        id: new Date().valueOf(),
        opeType: 'sync',
        newNodes: [{ id, parentId, domainPubId }],
      },
    });
    closeModal();
  };

  const onCoverOk = (values?: any) => {
    const { id, domainPubId } = modal.modalData || {};
    let { parentId } = modal.modalData || {};
    if (values) {
      parentId = values.parentId;
    }
    if (!id || !parentId || !domainPubId) {
      message.warn('缺失节点信息');
      return;
    }
    treeMsg$.emit({
      type: 'operation',
      content: {
        id: new Date().valueOf(),
        opeType: 'cover',
        newNodes: [{ id, parentId, domainPubId }],
      },
    });
    closeModal();
  };

  const onImportOk = (res) => {
    if (!modal.modalData?.id) return;
    if (modal.modalData?.editStatus === -1) return;
    treeMsg$.emit({
      type: 'operation',
      content: {
        id: new Date().valueOf(),
        opeType: 'import',
        newNodes: [{ parentId: modal.modalData.id, ...res }],
      },
    });
    closeModal();
  };
  console.log(modal);

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
      <MoveModal
        open={modal.open === 'sync'}
        onCancel={closeModal}
        onOk={onSyncOk}
        modalData={modal.modalData}
        yTree={yTree}
        type="sync"
      />
      <MoveModal
        open={modal.open === 'cover'}
        onCancel={closeModal}
        onOk={onCoverOk}
        modalData={modal.modalData}
        yTree={yTree}
        type="cover"
      />
      <DeleteModal open={modal.open === 'delete'} onCancel={closeModal} onOk={onDelete} modalData={modal.modalData} />
      <MoveConfirmModal open={modal.open === 'move_confirm'} onCancel={closeModal} onOk={onMoveConfirm} modalData={modal.modalData} />
      {/* <Modal title={null} open={modal.open === 'move_confirm'} onCancel={closeModal} onOk={onMoveConfirm}>
        <div style={{ fontSize: 16, lineHeight: 2, paddingTop: 26 }}>
          确定将<span style={{ background: '#bae7ff', padding: '5px 10px' }}>{modal.modalData?.name}</span>
          {modal.modalData?.hasChildren && '及其下位节点'}移动到
          <span style={{ background: '#c5c5e3', padding: '5px 10px' }}>{modal.modalData?.parentName}</span>下
          {modal.modalData?.dropToGap ? (
            <span>
              ，<span style={{ background: '#c5c5e3', padding: '5px 10px' }}>{modal.modalData.dropName}</span>
              同层
            </span>
          ) : (
            ''
          )}
          吗？
        </div>
      </Modal> */}
      <ImportModal open={modal.open === 'import'} onCancel={closeModal} onOk={onImportOk} modalData={modal.modalData} />
      {/* 提议树 */}
      <ReviewMoveModal
        open={modal.open === 'domain_drag_confirm'}
        onCancel={closeModal}
        onSyncOk={() => onSyncOk()}
        onCoverOk={() => onCoverOk()}
        modalData={modal.modalData}
      />
    </>
  );
};
export default MyModal;
