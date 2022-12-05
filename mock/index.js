module.exports = {
  // '/api/standard/domain/list': {
  //   body: [
  //     {
  //       title: '标准1',
  //       type: 1,
  //       id: 1001,
  //     },
  //     {
  //       title: '标准2',
  //       type: 2,
  //       id: 1000,
  //     },
  //   ],
  //   header: { code: 200 },
  // },
  '/api/getbasic': {
    header: { code: 200 },
    body: {
      name: '评审详情',
      member: [
        {
          userName: 'aaa',
          userId: 100001,
          userRole: '1',
        },
        {
          userName: 'bbb',
          userId: 100002,
          userRole: '2',
        },
        {
          userName: 'ccc',
          userId: 100003,
          userRole: '2',
        },
        {
          userName: 'ddd',
          userId: 100004,
          userRole: '3',
        },
        {
          userName: 'eee',
          userId: 100005,
          userRole: '4',
        },
      ],
      versionList: [
        {
          name: '提议标准1',
          id: '1',
        },
        {
          name: '提议标准12',
          id: '2',
        },
      ],
    },
  },
  '/api/getList': {
    header: { code: 200 },
    body: {
      list: [
        {
          id: '1',
          name: '123',
          version: '1.1',
          team: 'xx行业',
          status: '修改中',
          role: '主持人',
        },
      ],
      total: 1,
    },
  },
  '/api/getRepos': {
    dataSource: [
      {
        id: 1,
        name: 'facebook/react',
        description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces',
        logo: 'https://avatars3.githubusercontent.com/u/69631',
      },
      {
        id: 2,
        name: 'vuejs/vue',
        description:
          'Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web. ',
        logo: 'https://avatars1.githubusercontent.com/u/6128107',
      },
      {
        id: 3,
        name: 'angular/angular',
        description: 'One framework. Mobile & desktop. ',
        logo: 'https://avatars3.githubusercontent.com/u/139426',
      },
      {
        id: 4,
        name: 'nuxt/nuxt.js',
        description: 'The Vue.js Framework',
        logo: 'https://avatars2.githubusercontent.com/u/23360933',
      },
      {
        id: 5,
        name: 'zeit/next.js',
        description: 'The React Framework',
        logo: 'https://avatars0.githubusercontent.com/u/14985020',
      },
      {
        id: 6,
        name: 'ice-lab/ice.js',
        description: 'A universal framework based on React.js.',
        logo: 'https://avatars1.githubusercontent.com/u/1961952',
      },
    ],
  },
};
