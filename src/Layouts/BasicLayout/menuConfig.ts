import { SmileOutlined, ProjectOutlined, ApiOutlined, AuditOutlined } from '@ant-design/icons';

const asideMenuConfig = [
  {
    name: '标准知识服务',
    path: '/kstandard',
    icon: SmileOutlined,
    hideInMenu: true,
  },
  {
    name: '知识构建',
    path: '/kstruct',
    icon: ProjectOutlined,
    routes: [
      {
        name: '知识运维',
        path: '/kstruct/kbuild',
        icon: SmileOutlined,
      },
      {
        name: '知识服务',
        path: '/kstruct/kapi',
        icon: SmileOutlined,
        hideInMenu: true,
      },
      {
        name: '知识管理',
        path: '/kstruct/kmanage',
        icon: ApiOutlined,
      },
    ],
  },
  {
    name: '知识运营',
    path: '/kope',
    icon: ApiOutlined,
  },
  {
    name: '知识评审',
    path: '/kcheck',
    icon: AuditOutlined,
    routes: [
      { name: '流程构建', hideInMenu: true, path: '/kcheck/createProcess' },
      {
        name: '评审工作台',
        path: '/kcheck/workshop',
      },
    ],
  },
];

export { asideMenuConfig };
