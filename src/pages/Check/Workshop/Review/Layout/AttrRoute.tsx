import { useState } from 'react';
import Attr from '../steps/Attr/Show';

const AttrRoute = ({ stepMsg$, children, style = {} }) => {
  const [tab, setTab] = useState('tree');
  const [id, setId] = useState('');

  stepMsg$.useSubscription((msg) => {
    if (msg.type === 'route') {
      if (msg.path === 'attr' && !msg?.content?.id) return;
      setId(msg?.content?.id);
      setTab(msg.path);
    }
  });

  const back = () => {
    stepMsg$.emit({
      type: 'route',
      path: 'tree',
    });
  };

  return (
    <>
      <div style={tab === 'tree' ? { display: 'block', ...style } : { display: 'none', ...style }}>{children}</div>
      {tab === 'attr' ? <Attr id={id} back={back} /> : null}
    </>
  );
};

export default AttrRoute;
