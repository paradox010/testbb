/* eslint-disable no-nested-ternary */
// 建立websocket链接 获取评审的基本信息
import store from '@/store';
import { useRequest } from 'ahooks';
import { useParams, request } from 'ice';
import BasicContext, { BasicContextProps } from './basicContext';
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
  return {
    ...data,
    self: { ...user, ...(data?.self || {}) },
    userRole: item.userRole,
  };
}
const Review = () => {
  const id = useParams<{ id: string }>()?.id;
  const [user] = store.useModel('user');
  const { data, loading } = useRequest(() => getBasic({ reviewId: id }));

  return transData(data, user) ? (
    <BasicContext.Provider value={transData(data, user) as BasicContextProps}>
      <MsgCenter />
    </BasicContext.Provider>
  ) : loading ? (
    'loading'
  ) : (
    'need reload'
  );
};

export default Review;
