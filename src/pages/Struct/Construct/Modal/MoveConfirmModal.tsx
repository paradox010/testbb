import { Modal } from 'antd';

export interface CreateFormProps {
  open: boolean;
  onOk: (v?: any) => void;
  onCancel: () => void;
  modalData: any;
}

const MoveConfirmModal: React.FC<CreateFormProps> = ({ open, onOk, onCancel, modalData }) => {
  return (
    <Modal title={null} open={open} onCancel={onCancel} onOk={onOk}>
      <div style={{ fontSize: 16, lineHeight: 2, paddingTop: 26, overflow: 'auto' }}>
        确定将<span className="ds-moveTextDes">{modalData?.name}</span>
        {modalData?.hasChildren && '及其下位节点'}移动到
        <span className="ds-dropTextDes">{modalData?.parentName}</span>下
        {modalData?.dropToGap ? (
          <span>
            ，<span className="ds-dropTextDes">{modalData.dropName}</span>
            同层
          </span>
        ) : (
          ''
        )}
        吗？
      </div>
    </Modal>
  );
};

export default MoveConfirmModal;
