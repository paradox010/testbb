import { Modal } from 'antd';

export interface AddModalData {
  name?: string;
  id?: string;
  hasChildren?: boolean;
}
export interface CreateFormProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  modalData?: AddModalData;
}

const CreateForm: React.FC<CreateFormProps> = ({ open, onOk, onCancel,modalData }) => {
  return (
    <Modal open={open} title="删除节点" okText="确定" cancelText="取消" onCancel={onCancel} onOk={onOk}>
      <div>是否确定删除该节点{modalData?.hasChildren&&'及其下位节点'}：{modalData?.name}</div>
    </Modal>
  );
};

export default CreateForm;
