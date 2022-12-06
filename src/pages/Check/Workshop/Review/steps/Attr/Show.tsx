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

function Show({ id, back }) {
  const { data } = useRequest(() =>
    getAttr({
      categoryPubId: id,
    }),
  );
  return (
    <>
      <div onClick={back}>返回</div>
      <Header data={{}} />
      <ShowTable data={{ featureInfo: { '1': data || [] } }} />
    </>
  );
}

export default Show;
