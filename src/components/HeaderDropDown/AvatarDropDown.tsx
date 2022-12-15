import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Dropdown } from 'antd';
import { stringify } from 'qs';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React from 'react';
import styles from './index.module.less';

import { history } from 'ice';
import { useOutLogin } from '@/utils/auth';
import store from '@/store';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu = true }) => {
  const [user] = store.useModel('user');
  const outLogin = useOutLogin();
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await outLogin();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history?.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  const onMenuClick = (event: MenuInfo) => {
    const { key } = event;
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');

    if (key === 'logout') {
      loginOut();
      return;
    }
    history?.replace({
      pathname: `/user/${key}`,
      search: stringify({
        redirect: pathname + search,
      }),
    });
  };

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'newPassword',
            icon: <UserOutlined />,
            label: '修改密码',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const menuHeaderDropdown = <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick} items={menuItems} />;

  return user?.userId ? (
    <Dropdown overlay={menuHeaderDropdown} trigger={['click']}>
      <div className={`${styles.action} ${styles.account}`}>
        <Avatar icon={<UserOutlined />} alt="avatar" />
        <span>{user?.userName}</span>
      </div>
    </Dropdown>
  ) : (
    <Menu className={styles.menu} items={[{ label: '登录', key: 'login' }]} onClick={onMenuClick} />
  );
};

export default AvatarDropdown;
