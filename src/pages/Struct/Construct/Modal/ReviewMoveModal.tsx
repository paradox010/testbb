import { Button, Modal } from 'antd';

export interface CreateFormProps {
  open: boolean;
  onSyncOk: () => void;
  onCoverOk: () => void;
  onCancel: () => void;
  modalData: any;
}

const ReviewMoveModal: React.FC<CreateFormProps> = ({ open, onSyncOk, onCoverOk, onCancel, modalData }) => {
  return (
    <Modal open={open} title="操作" footer={null} onCancel={onCancel}>
      <div style={{ fontSize: 16 }}>
        确定将<span style={{ background: '#bae7ff', padding: '5px 10px' }}>{modalData?.name}</span>移动到/覆盖
        <span style={{ background: '#c5c5e3', padding: '5px 10px' }}>{modalData?.parentName}</span>下吗？
      </div>
      <Button onClick={onSyncOk}>移动到该节点下层</Button>
      <Button onClick={onCoverOk}>覆盖该节点</Button>
    </Modal>
  );
};

export default ReviewMoveModal;
