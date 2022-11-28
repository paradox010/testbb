import { TreeSelect, Modal } from 'antd';
import { useEffect, useState } from 'react';
import type { YTree as YTreeType } from '../Tree/node';

export interface AddModalData {
  name?: string;
  id?: string;
}
export interface CreateFormProps {
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
  modalData?: AddModalData;
  yTree: YTreeType;
}

const CreateForm: React.FC<CreateFormProps> = ({ open, onOk, onCancel, modalData, yTree }) => {
  const [select, setSelect] = useState('');
  const onChange = (key) => {
    setSelect(key);
  };
  const [state, setState] = useState([] as any[]);
  useEffect(() => {
    if (open) {
      setState(yTree.getOriginTree());
      setSelect('');
    }
  }, [open]);

  const beforeOk = () => {
    if (select === '' || !select || !modalData?.id) {
      console.error('请选择父节点');
      return;
    }
    onOk({ parentId: select, ...modalData });
  };

  return (
    <Modal open={open} title="移动节点" okText="确定" cancelText="取消" onCancel={onCancel} onOk={beforeOk}>
      <div>你选择的节点:{modalData?.name}</div>
      <div>
        目标节点:
        <TreeSelect
          showSearch
          treeNodeFilterProp="name"
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="请选择想要移动到的父节点"
          allowClear
          onChange={onChange}
          value={select}
          treeData={state}
          fieldNames={{
            label: 'name',
            value: 'id',
          }}
        />
      </div>
    </Modal>
  );
};

export default CreateForm;
