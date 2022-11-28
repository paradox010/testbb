module.exports = {
  '/api/getbasic': {
    header: { code: 200 },
    body: {
      userType: '1',
      name: '评审详情',
      userList: [
        {
          name: 'aaa',
          role: '主持人',
        },
        {
          name: 'bbb',
          role: '演讲人',
        },
        {
          name: 'ccc',
          role: '演讲人',
        },
        {
          name: 'ddd',
          role: '评审人',
        },
        {
          name: 'eee',
          role: '听证人',
        },
      ],
      versionList: [
        {
          name: 'sdfsdfsddf',
          id: '12321',
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
