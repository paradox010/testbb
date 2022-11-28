import loginBg from '@/assets/loginBg.png';
import styles from './index.module.less';

export default function LoginWrap({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={loginBg} />
        <div className={styles.loginWrap}>{children}</div>
      </div>
    </div>
  );
}
