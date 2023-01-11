import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';

interface Values {
  name: string;
  description: string;
}
export interface UpdateModalData {
  name?: string;
  id?: string;
  description?: string;
}
export interface UpdateFormProps {
  open: boolean;
  onOk: (values: Values) => void;
  onCancel: () => void;
  modalData?: UpdateModalData;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ open, onOk, onCancel, modalData }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: modalData?.name,
        description: modalData?.description,
      });
    }
  }, [open]);
  return (
    <Modal
      open={open}
      title="修改节点基本信息"
      okText="确定"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            // form.resetFields();
            onOk(values);
          })
          .catch((info) => {
            console.log('表单错误:', info);
          });
      }}
    >
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

export default UpdateForm;
