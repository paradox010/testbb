import { createElement } from 'react';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import { Link } from 'ice';
import { asideMenuConfig } from './menuConfig';
import { Avatar } from 'antd';
import store from '@/store';

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
      title="浙江省工业产品主数据管理平台专家系统"
      style={{
        minHeight: '100vh',
      }}
      layout="top"
      location={{
        pathname: location.pathname,
      }}
      menuDataRender={() => loopMenuItem(asideMenuConfig)}
      menuItemRender={(item, defaultDom) => {
        if (!item.path) {
          return defaultDom;
        }
        return <Link to={item.path}>{defaultDom}</Link>;
      }}
      logo={false}
      rightContentRender={() => <><Avatar shape="square" size="small" />{user?.userName}</>}
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
