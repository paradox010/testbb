import RND from '@/pages/Struct/Construct/RND';
import { FileTextOutlined } from '@ant-design/icons';
import { StepProps } from '../../msg.d';
import TrashTree from './TrashTree';
import TrashAttr from '../Attr/TrashAttr';
import Domains from './Domains';
import { useState } from 'react';

const DiscussTool: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const [tab, setTab] = useState('tree');

  stepMsg$.useSubscription((msg) => {
    if (msg.type === 'route') {
      setTimeout(()=>{
        setTab(msg.path);
      })
    }
  });
  return (
    <>
      <RND
        text={
          <>
            <FileTextOutlined style={{ fontSize: 20 }} />
            <div>修订文件</div>
          </>
        }
        noPadding
        title={'修订文件'}
      >
        <Domains stepMsg$={stepMsg$} msgData={msgData} />
      </RND>
      <RND
        text={
          <>
            <FileTextOutlined style={{ fontSize: 20 }} />
            <div>回收站</div>
          </>
        }
        noPadding
        title={'回收站'}
        style={tab === 'tree' ? {} : { display: 'none' }}
      >
        <TrashTree stepMsg$={stepMsg$} msgData={msgData} />
      </RND>
      {tab === 'attr' && (
        <RND
          text={
            <>
              <FileTextOutlined style={{ fontSize: 20 }} />
              <div>回收站</div>
            </>
          }
          noPadding
          title={'回收站'}
        >
          <TrashAttr stepMsg$={msgData?.attrMsg$} msgData={msgData?.attrMsgData} />
        </RND>
      )}
    </>
  );
};

export default DiscussTool;
