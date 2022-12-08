import RND from '@/pages/Struct/Construct/RND';
import { FileTextOutlined } from '@ant-design/icons';
import Online from '../Online';
import Record from '../Record';

export default ({ stepMsg$, msgData }) => {
  return (
    <>
      <RND
        text={
          <>
            <FileTextOutlined style={{ fontSize: 20 }} />
            <div>会议直播</div>
          </>
        }
        noPadding
        title={'会议直播'}
      >
        <Record stepMsg$={stepMsg$} msgData={msgData} />
      </RND>
      <RND
        defaultPosX={-270}
        defaultPosY={70}
        defaultWidth={310}
        defaultHeight={400}
        text={
          <>
            <FileTextOutlined style={{ fontSize: 20 }} />
            <div>参与人员</div>
          </>
        }
        noPadding
        title={'参与/离线人员'}
      >
        <Online stepMsg$={stepMsg$} msgData={msgData} />
      </RND>
    </>
  );
};
