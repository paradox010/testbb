import { useState } from 'react';
import Attr from './Attr';

const AttrRoute = ({ treeMsg$, children }) => {
  const [tab, setTab] = useState('tree');
  const [id, setId] = useState('');

  treeMsg$.useSubscription((msg) => {
    if (msg.type === 'route') {
      if (msg.path === 'attr' && !msg?.content?.id) return;
      setId(msg?.content?.id);
      setTab(msg.path);
    }
  });

  const back = () => {
    treeMsg$.emit({
      type: 'route',
      path: 'tree',
    });
  };
  return (
    <>
      <div style={{ display: tab === 'tree' ? 'block' : 'none' }}>{children}</div>
      {tab === 'attr' ? <Attr id={id} back={back} /> : null}
    </>
  );
};

export default AttrRoute;
