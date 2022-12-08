import { useRequest } from 'ahooks';
import { request } from 'ice';
import Header from './Header';
import ShowTable from './ShowTable';

async function getAttr(params) {
  const resData = await request({
    url: '/api/review/productFeaturePub/getFeature',
    params,
  });
  return resData;
}

function Show({ id, back, type = 'page' }) {
  const { data } = useRequest(() =>
    getAttr({
      categoryPubId: id,
    }),
  );
  return (
    <>
      {type === 'page' ? <div onClick={back}>返回</div> : null}
      <Header data={data?.category || {}} />
      <ShowTable data={data?.currentFeature || []} />
    </>
  );
}

export default Show;
