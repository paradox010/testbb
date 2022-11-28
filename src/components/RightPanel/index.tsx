import { useState } from 'react';
import styles from './index.module.less';

function RightPanel({ children }) {
  const [collapse, setCollapse] = useState(true);
  const [collapseDown, setCollapseDown] = useState(true);
  return (
    <div className={`${styles.right} ${collapse && styles.open}`}>
      <div onClick={() => setCollapse(!collapse)} className={styles.collapseIcon}>点击可收起</div>
      <div className={styles.colFlexContent}>
        <div className={styles.historyWrap}>{children[0]}</div>
        <div className={`${styles.down} ${collapseDown && styles.open}`}>
          <div onClick={() => setCollapseDown(!collapseDown)} className={styles.collapseTrashIcon}>回收站</div>
          <div className={styles.trashTreeWrap}>{children[1]}</div>
        </div>
      </div>
    </div>
  );
}
export default RightPanel;
