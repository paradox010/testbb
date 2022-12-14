import { createElement } from 'react';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import { Link } from 'ice';
import { asideMenuConfig } from './menuConfig';
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
      title="浙江省工业产品主数据管理平台专家系统"
      headerTitleRender={(...params) => <a>{params[1]}</a>}
      style={{
        minHeight: '100vh',
      }}
      layout="mix"
      location={{
        pathname: location.pathname,
      }}
      navTheme="light"
      headerTheme="light"
      menuDataRender={() => loopMenuItem(asideMenuConfig)}
      menuItemRender={(item, defaultDom) => {
        if (!item.path) {
          return defaultDom;
        }
        return <Link to={item.path}>{defaultDom}</Link>;
      }}
      logo={false}
      rightContentRender={() => (
        <AvatarDropDown />
        // <div>
        //   <Avatar icon={<UserOutlined />} />
        //   <span style={{ margin: '0 5px' }}>{user?.userName}</span>
        // </div>
      )}
      // footerRender={() => (
      //   <DefaultFooter
      //     links={[
      //       {
      //         key: '道生',
      //         title: '道生',
      //         href: 'https://github.com/ice-lab/icejs',
      //       },
      //       {
      //         key: '1',
      //         title: '道生',
      //         href: 'https://github.com/ant-design/ant-design',
      //       },
      //     ]}
      //     copyright="by 道生"
      //   />
      // )}
    >
      <div style={{ minHeight: '60vh' }}>{children}</div>
    </ProLayout>
  );
}
