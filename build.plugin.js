module.exports = (params) => {
  const { onGetConfig, context } = params;
  console.log(context.userConfig.vite);
  // context.userConfig.vite.define = { 'process.env.ANTD_VERSION': '4.24.1' };
  // onGetConfig((config) => {
  //   // 常见需求怎么写参见 issue 回复
  //   console.log(config);

  //   config.define.env.ANTD_VERSION = '4.24';
  // });
};
