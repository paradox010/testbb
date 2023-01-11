/* eslint-disable no-nested-ternary */
// 建立websocket链接 获取评审的基本信息
import store from '@/store';
import { useRequest, useUnmount } from 'ahooks';
import { Button, Result } from 'antd';
import { useParams, request, history } from 'ice';
import BasicContext, { BasicContextProps, init } from './basicContext';
import MsgCenter from './MsgCenter';

const getBasic = async (params) => {
  return request({
    url: '/api/review/review/info',
    method: 'get',
    params,
  });
};
function transData(data, user) {
  if (!data) return;
  const item = data?.member?.find((v) => v.userId === user.userId);
  if (!item) return;
  if (data?.self.isRemoved) return;
  const { member, ...rest } = data;
  return {
    ...rest,
    self: { ...user, ...(data?.self || {}) },
    userRole: item.userRole,
  };
}
const Review = () => {
  const id = useParams<{ id: string }>()?.id;
  const [user] = store.useModel('user');
  const { data, loading } = useRequest(() => getBasic({ reviewId: id }));

  useUnmount(() => {
    init();
  });

  const goBack = () => {
    history?.push('/kcheck/workshop');
  };

  return transData(data, user) ? (
    <BasicContext.Provider value={transData(data, user) as BasicContextProps}>
      <MsgCenter />
    </BasicContext.Provider>
  ) : loading ? (
    'loading'
  ) : (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问该会议，请联系管理员"
      extra={
        <Button type="primary" onClick={goBack}>
          返回评审工作台
        </Button>
      }
    />
  );
};

export default Review;
