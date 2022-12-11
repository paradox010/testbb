import styles from './index.module.less';
import { ApartmentOutlined, ImportOutlined } from '@ant-design/icons';

import baseState from './state';

const StepFirst = () => {
  return (
    <div className={styles.content}>
      <div className={styles.firstContent}>
        <div
          className={styles.firstItem}
          onClick={() => {
            baseState.step = 'import';
          }}
        >
          <ImportOutlined />
          <div>本地导入</div>
        </div>
        <div
          className={styles.firstItem}
          onClick={() => {
            baseState.step = 'choice';
          }}
        >
          <ApartmentOutlined />
          <div>选择节点</div>
        </div>
      </div>
    </div>
  );
};
export default StepFirst;
