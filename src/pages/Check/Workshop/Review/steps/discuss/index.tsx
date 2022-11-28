import { Button, Checkbox, Descriptions } from 'antd';
import styles from './index.module.less';

import VoteModal from './Modal';

const Sign = ({ stepMsg$, msgData }) => {
  return <div className={styles.content}>discuss</div>;
};

Sign.Title = ({ stepMsg$, msgData }) => {
  return (
    <>
      提议讨论
      <Button type="primary">编辑结束</Button>
      <Button>发起投票</Button>
      <VoteModal />
    </>
  );
};
Sign.Tool = ({ stepMsg$, msgData }) => {
  return (
    <>
      <div>other</div>
    </>
  );
};
export default Sign;
