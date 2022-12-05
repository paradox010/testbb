import styles from '../index.module.less';

const Panel = ({ children }) => {
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div>{children[0]}</div>
      </div>
      <div className={styles.workshop}>
        <div className={styles.treeWork}>{children[1]}</div>
        <div className={styles.toolbox}>{children[2]}</div>
      </div>
    </div>
  );
};

export default Panel;
