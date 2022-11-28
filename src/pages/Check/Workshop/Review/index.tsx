// 建立websocket链接 获取评审的基本信息
import { useRequest } from 'ahooks';
import { useParams, request } from 'ice';
import React from 'react';
import MsgCenter from './MsgCenter';

const getBasic = async (params) => {
  return request({
    url: '/api/getbasic',
    method: 'get',
    params,
  });
};

interface BasicContextProps {
  id: string;
  name: string;
  userList: [];
  versionList: [];
}
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const BasicContext = React.createContext<BasicContextProps>({} as BasicContextProps);

const Review = () => {
  const id = useParams<{ id: string }>()?.id;
  const { data } = useRequest(() => getBasic({ id }));

  return data ? (
    <BasicContext.Provider value={data as BasicContextProps}>
      <MsgCenter />
    </BasicContext.Provider>
  ) : (
    'need reload'
  );
};

export default Review;
