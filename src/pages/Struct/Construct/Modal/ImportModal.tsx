import { ContainerOutlined } from '@ant-design/icons';
import { Button, Modal, Upload } from 'antd';
import { request } from 'ice';
import { useEffect, useState } from 'react';

import styles from './index.module.less';

export interface CreateFormProps {
  open: boolean;
  onOk: (v) => void;
  onCancel: () => void;
  modalData: any;
}

const ImportModal: React.FC<CreateFormProps> = ({ onOk, open, onCancel, modalData }) => {
  const [merge, setMerge] = useState<{
    mergeCategoryKey?: string;
    mergeFeatureKey?: string;
  }>({});
  useEffect(() => {
    if (open) {
      setMerge({});
    }
  }, [open]);
  return (
    <Modal open={open} title="导入" footer={null} onCancel={onCancel}>
      <div style={{ marginBottom: 15 }}>
        导入到节点:{modalData?.name}
        <Button style={{ float: 'right' }}>
          <a
            download
            href="https://file.dvolution.com/file/product-knowledge-management/template/%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BFv1.0.xlsx"
          >
            模板下载
          </a>
        </Button>
      </div>
      <Upload.Dragger
        listType="text"
        maxCount={1}
        className={styles.upload}
        customRequest={({ filename, file, onSuccess, onError }) => {
          const formData = new FormData();
          if (!filename) return;
          formData.append(filename, file);
          request({
            url: '/api/standard/domain/file/import',
            method: 'post',
            data: formData,
          })
            .then((res) => {
              setMerge({ mergeCategoryKey: res.mergeCategoryKey, mergeFeatureKey: res.mergeFeatureKey });
              onSuccess && onSuccess(res);
            })
            .catch(onError);
        }}
      >
        <ContainerOutlined />
        <div>点击将文件拖拽到这里上传</div>
        <div style={{ color: '#898989' }}>支持扩展名：.xls.xlsx</div>
        <Button type="primary">上传文件</Button>
      </Upload.Dragger>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onCancel}>取消</Button>
        <Button
          disabled={!merge?.mergeCategoryKey}
          style={{ marginLeft: 5 }}
          type="primary"
          onClick={() => {
            onOk(merge);
          }}
        >
          确定导入
        </Button>
      </div>
    </Modal>
  );
};
export default ImportModal;
