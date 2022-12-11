import { Button, Upload } from 'antd';
import { useSnapshot } from 'valtio';
import baseState from './state';

import styles from './index.module.less';
import { request } from 'ice';
import Fullscreen from './Fullscreen';

const ImportView = () => {
  const state = useSnapshot(baseState);
  return (
    <>
      <div className={styles.uploadInline}>
        <div className={styles.fileText}>{state.fileName}</div>
        <Upload
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
              })
              .catch(onError);
          }}
          itemRender={(originNode) => {
            return originNode;
          }}
          listType="text"
          maxCount={1}
        >
          <Button>重新导入</Button>
        </Upload>
      </div>
      <div className={styles.importTreeWrap}>
        <Fullscreen noFullscreen key={state?.mergeCategoryKey} id={state?.mergeCategoryKey} />
      </div>
      <div className={styles.bottomBtn}>
        <Button
          onClick={() => {
            baseState.step = 'name';
          }}
        >
          上一步
        </Button>
        <Button
          onClick={() => {
            baseState.step = 'merge';
          }}
          type="primary"
          style={{ marginLeft: 20 }}
        >
          确定
        </Button>
      </div>
    </>
  );
};

export default ImportView;
