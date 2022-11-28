import { Button, Checkbox, Descriptions } from 'antd';
import styles from './rintro.module.less';

const Sign = ({ stepMsg$, msgData }) => {
  return (
    <div className={styles.content}>
      <div className={styles.subTitle}>
        <div>当前演讲人：</div>
        <div>演讲人公司：</div>
        <div>演讲时间：</div>
        <div>下一位演讲人</div>
      </div>
    </div>
  );
};

Sign.Title = ({ stepMsg$, msgData }) => {
  return (
    <>
      提议介绍
      <Button>下一位演讲人</Button>
      <Button type="primary">进入提议讨论</Button>
    </>
  );
};
export default Sign;
