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
      <div style={{ fontSize: 16, lineHeight: 2, marginBottom: 20, overflow: 'auto' }}>
        确定将<span className="ds-moveTextDes">{modalData?.name}</span>
        {modalData?.hasChildren && '及其下位节点'}
        {modalData?.dropToGap ? '移动到' : '移动到/覆盖'}
        <span className="ds-dropTextDes">{modalData?.parentName}</span>
        {modalData?.dropToGap ? (
          <span>
            ，<span className="ds-dropTextDes">{modalData.dropName}</span>
            同层
          </span>
        ) : (
          ''
        )}
        下吗？
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={onSyncOk} style={{ marginRight: 20 }}>
          移动到该节点下层
        </Button>
        {!modalData?.dropToGap && (
          <Button type="primary" onClick={onCoverOk}>
            覆盖该节点
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ReviewMoveModal;
