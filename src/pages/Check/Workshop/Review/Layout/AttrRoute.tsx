/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import Attr from '../steps/Attr/Show';

const AttrRoute = ({ stepMsg$, children, style = {}, type = 'view' }) => {
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
      <div style={tab === 'tree' ? { display: 'block', ...style } : { display: 'none', ...style }}>
        {type === 'view' ? children : children[0]}
      </div>
      {tab === 'attr' ? (
        type === 'view' ? (
          <Attr id={id} back={back} />
        ) : (
          React.cloneElement(children[1], {
            id,
            back,
          })
        )
      ) : null}
    </>
  );
};

export default AttrRoute;
