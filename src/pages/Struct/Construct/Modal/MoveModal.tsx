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
  type?: 'move' | 'sync' | 'cover';
}

const CreateForm: React.FC<CreateFormProps> = ({ open, onOk, onCancel, modalData, yTree, type = 'move' }) => {
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
    <Modal
      open={open}
      title={type === 'cover' ? '覆盖节点' : '移动节点'}
      okText="确定"
      cancelText="取消"
      onCancel={onCancel}
      onOk={beforeOk}
    >
      <div style={{ marginBottom: 10 }}>你选择的节点:{modalData?.name}</div>
      <div>
        {type === 'cover' ? '想覆盖的节点' : '想移动到的上位节点'}:
        <TreeSelect
          showSearch
          treeNodeFilterProp="name"
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder={type === 'cover' ? '请选择覆盖节点' : '请选择想要移动到的上位节点'}
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
