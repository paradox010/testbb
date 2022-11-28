import { runApp, IAppConfig, request } from 'ice';
import { message } from 'antd';
// const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(1), time));

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    title: '浙江省',
    getInitialData: async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const resData = await request({
          url: '/api/sys/sysUser/userInfo',
          headers: {
            Token: token,
          },
        });
        return {
          initialStates: {
            user: { ...resData, token },
          },
        };
      }

      // await delay(1000);
      return {
        // initialStates 是约定好的字段，会透传给 store 的初始状态
        initialStates: {
          user: { userId: `${Math.random()}` },
        },
      };
    },
  },
  router: {
    type: 'browser',
    fallback: <div>loading....</div>,
  },
  request: {
    baseURL: '/',
    headers: {},
    // withFullResponse: true,
    interceptors: {
      request: {
        onConfig: (config) => {
          // eslint-disable-next-line no-param-reassign
          // config.headers = { a: 1 };
          return config;
        },
        onError: (error) => {
          return Promise.reject(error);
        },
      },
      response: {
        onConfig: (response) => {
          // if (!response.data.status !== 1) {
          //   //errro
          // }
          if (response.data?.header.code !== 200) {
            message.error(response.data?.header?.message);
            return Promise.reject(response.data?.header?.message);
          }
          response.data = response.data.body;
          return response;
        },
        onError: (error) => {
          // console.log(error);
          return Promise.reject(error);
        },
      },
    },
  },
};

runApp(appConfig);
