import { Form, Input, Modal } from 'antd';

interface Values {
  name: string;
  description: string;
  modifier: string;
}
export interface AddModalData {
  name?: string;
  id?: string;
}
export interface CreateFormProps {
  open: boolean;
  onOk: (values: Values) => void;
  onCancel: () => void;
  modalData?: AddModalData;
}

const CreateForm: React.FC<CreateFormProps> = ({ open, onOk, onCancel, modalData }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title={modalData?.id ? '新增下位节点' : '新增一级节点'}
      okText="新增"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onOk(values);
          })
          .catch((info) => {
            console.log('表单错误:', info);
          });
      }}
    >
      <div style={{ marginBottom: 10 }}>
        {modalData?.id ? '父节点:' : ''}
        {modalData?.name}
      </div>
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item name="name" label="节点名称" rules={[{ required: true, message: '请输入节点名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="节点描述">
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
