import { Button, Modal } from 'antd';

export interface CreateFormProps {
  open: boolean;
  onSyncOk: (v?: any) => void;
  onCoverOk: (v?: any) => void;
  onCancel: () => void;
  modalData: any;
}

const ReviewMoveModal: React.FC<CreateFormProps> = ({ open, onSyncOk, onCoverOk, onCancel, modalData }) => {
  return (
    <Modal open={open} title="操作" footer={null} onCancel={onCancel}>
      <div style={{ fontSize: 16, marginBottom: 20 }}>
        确定将<span style={{ background: '#bae7ff', padding: '5px 10px' }}>{modalData?.name}</span>
        {modalData?.hasChildren && '及其下位节点'}移动到/覆盖
        <span style={{ background: '#c5c5e3', padding: '5px 10px' }}>{modalData?.parentName}</span>下吗？
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={onSyncOk} style={{ marginRight: 20 }}>
          移动到该节点下层
        </Button>
        <Button type="primary" onClick={onCoverOk}>
          覆盖该节点
        </Button>
      </div>
    </Modal>
  );
};

export default ReviewMoveModal;
