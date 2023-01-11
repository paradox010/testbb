import RND from '@/pages/Struct/Construct/RND';
import { DeleteOutlined, FolderOpenOutlined, CommentOutlined } from '@ant-design/icons';
import { StepProps } from '../../msg.d';
import TrashTree from './TrashTree';
import Objection from './Objection';
import TrashAttr from '../Attr/TrashAttr';
import Domains from './Domains';
import { useState } from 'react';

const DiscussTool: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const [tab, setTab] = useState('tree');

  stepMsg$.useSubscription((msg) => {
    if (msg.type === 'route') {
      setTimeout(() => {
        setTab(msg.path);
      });
    }
  });
  return (
    <>
      <RND
        text={
          <>
            <FolderOpenOutlined style={{ fontSize: 20 }} />
            <div>修订文件</div>
          </>
        }
        noPadding
        title={'修订文件'}
      >
        <Domains editable={msgData.self.userRole === '1'} stepMsg$={stepMsg$} msgData={msgData} />
      </RND>
      <RND
        text={
          <>
            <DeleteOutlined style={{ fontSize: 20 }} />
            <div>回收站</div>
          </>
        }
        noPadding
        title={'回收站'}
        style={tab === 'tree' ? {} : { display: 'none' }}
      >
        <TrashTree editable={msgData.self.userRole === '1'} stepMsg$={stepMsg$} msgData={msgData} />
      </RND>
      {tab === 'attr' && (
        <RND
          text={
            <>
              <DeleteOutlined style={{ fontSize: 20 }} />
              <div>回收站</div>
            </>
          }
          noPadding
          title={'回收站'}
        >
          <TrashAttr
            editable={msgData.self.userRole === '1'}
            stepMsg$={msgData?.attrMsg$}
            msgData={msgData?.attrMsgData}
          />
        </RND>
      )}
      {msgData.self.userRole === '4' && (
        <RND
          text={
            <>
              <CommentOutlined style={{ fontSize: 20 }} />
              <div>异议列表</div>
            </>
          }
          noPadding
          title={'异议列表'}
        >
          <Objection stepMsg$={stepMsg$} msgData={msgData} />
        </RND>
      )}
    </>
  );
};

export default DiscussTool;
