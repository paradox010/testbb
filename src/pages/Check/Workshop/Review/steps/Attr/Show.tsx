import Header from './Header';
import ShowTable from './ShowTable';

function Show({ id, back }) {
  return (
    <>
      <div onClick={back}>返回</div>
      <Header data={{}} />
      <ShowTable data={{ featureInfo: {} }} />
    </>
  );
}

export default Show;
