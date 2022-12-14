import { IRouterConfig, lazy } from 'ice';
import Layout from '@/Layouts/BasicLayout';
import ULayout from '@/Layouts/BasicLayout/UserL';
import BLayout from '@/Layouts/BlankLayout';
// import { SmileOutlined, HeartOutlined } from '@ant-design/icons';
import React from 'react';

const Login = lazy(() => import('@/Layouts/UserLayout/Login'));
const NewPassword = lazy(() => import('@/Layouts/UserLayout/NewPassword'));

const Standard = lazy(() => import('@/pages/Standard'));
const Build = lazy(() => import('@/pages/Struct/Construct'));
const Api = lazy(() => import('@/pages/Struct/KApi'));
const Manage = lazy(() => import('@/pages/Struct/Manage'));
const NewBase = lazy(() => import('@/pages/Struct/Manage/New'));
const Ope = lazy(() => import('@/pages/Operation'));

const CreateProcess = lazy(() => import('@/pages/Check/CreateProcess'));
const Workshop = lazy(() => import('@/pages/Check/Workshop'));
const Review = lazy(() => import('@/pages/Check/Workshop/Review'));

const Test = lazy(() => import('@/pages/YtreeTest'));

// const Dashboard = lazy(() => import('@/pages/Dashboard'));
// layout不能作为lazy => <Suspense fallback={<div>loading</div>}><Comp/></Suspense>
// const Home = import('@/pages/Home');
const NotFound = lazy(() => import('@/components/NotFound'));

interface DRouterConfig extends IRouterConfig {
  menuConfig?: {
    name?: string;
    hideMenu?: boolean;
    icon?: React.ComponentType<any>;
  };
  children?: DRouterConfig[];
}

const routerConfig: DRouterConfig[] = [
  {
    path: '/user',
    component: ULayout,
    children: [
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/newPassword',
        component: NewPassword,
      },
      {
        path: '/',
        redirect: '/user/login',
      },
    ],
  },
  {
    path: '/',
    component: Layout,
    pageConfig: {
      title: '浙江省工业产品主数据管理平台专家系统',
    },
    children: [
      {
        path: '/kstandard',
        menuConfig: {
          name: '标准知识服务',
        },
        component: Standard,
      },
      {
        path: '/kstruct',
        menuConfig: {
          name: '知识构建',
        },
        component: BLayout,
        children: [
          {
            path: '/kbuild',
            component: Build,
            menuConfig: {
              name: '知识运维',
            },
          },
          {
            path: '/kapi',
            component: Api,
          },
          {
            path: '/kmanage',
            component: BLayout,
            children: [
              {
                path: '/klist',
                component: Manage,
              },
              {
                path: '/knew',
                component: NewBase,
              },
              {
                path: '/',
                redirect: '/kstruct/kmanage/klist',
              },
            ],
          },
          {
            path: '/',
            redirect: '/kstruct/kmanage/klist',
          },
        ],
      },
      {
        path: '/kope',
        component: Ope,
      },
      {
        path: '/kcheck',
        component: BLayout,
        menuConfig: {
          name: '知识评审',
        },
        children: [
          {
            path: '/createProcess',
            component: CreateProcess,
          },
          {
            path: '/workshop/:id',
            component: Review,
          },
          {
            path: '/workshop',
            component: Workshop,
          },
          {
            path: '/kcheck',
            redirect: '/kcheck/workshop',
          },
        ],
      },
      {
        path: '/test',
        component: Test,
      },
      {
        path: '/',
        redirect: '/kstruct',
      },
      {
        component: NotFound,
      },
    ],
  },
];

export default routerConfig;
