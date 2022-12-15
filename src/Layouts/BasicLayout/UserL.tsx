import { createElement } from 'react';
import ProLayout from '@ant-design/pro-layout';
import { Link } from 'ice';
import store from '@/store';

import styles from './index.module.less';

import AvatarDropDown from '@/components/HeaderDropDown/AvatarDropDown';

const loopMenuItem = (menus) =>
  menus.map(({ icon, children, ...item }) => ({
    ...item,
    icon: createElement(icon),
    children: children && loopMenuItem(children),
  }));

export default function BasicLayout({ children, location }) {
  const [user] = store.useModel('user');

  return (
    <ProLayout
      className={styles.bLayout}
      menuHeaderRender={(logo, title) => <a href="/">{title}</a>}
      title="浙江省工业产品主数据管理平台专家系统"
      style={{
        minHeight: '100vh',
      }}
      layout="top"
      location={{
        pathname: location.pathname,
      }}
      navTheme="light"
      headerTheme="light"
      menuItemRender={(item, defaultDom) => {
        if (!item.path) {
          return defaultDom;
        }
        return <Link to={item.path}>{defaultDom}</Link>;
      }}
      logo={false}
      rightContentRender={() => <AvatarDropDown />}
      contentStyle={{ margin: 0 }}
    >
      <div style={{ minHeight: '60vh' }}>{children}</div>
    </ProLayout>
  );
}
