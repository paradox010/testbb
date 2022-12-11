import { ContainerOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { request } from 'ice';

import styles from './index.module.less';

import baseState from './state';

const LocalImport = () => {
  return (
    <>
      <div className={styles.content}>
        <div className={styles.importFlexCenter}>
          <Upload.Dragger
            listType="text"
            maxCount={1}
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
                  baseState.fileName = (file as File).name;
                  baseState.mergeCategoryKey = res.mergeCategoryKey;
                  baseState.mergeFeatureKey = res.mergeFeatureKey;
                  onSuccess && onSuccess(res);
                  baseState.step = 'importView';
                })
                .catch(onError);
            }}
          >
            <ContainerOutlined />
            <div>点击将文件拖拽到这里上传</div>
            <div style={{ color: '#898989' }}>支持扩展名：.xls.xlsx</div>
            <Button type="primary">上传文件</Button>
          </Upload.Dragger>
        </div>
      </div>
      <div className={styles.bottomBtn}>
        <Button
          onClick={() => {
            baseState.step = 'name';
          }}
        >
          上一步
        </Button>
      </div>
    </>
  );
};
export default LocalImport;
