import RND from '@/pages/Struct/Construct/RND';
import { FileTextOutlined } from '@ant-design/icons';

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
        <div>111</div>
      </RND>
      <RND
        text={
          <>
            <FileTextOutlined style={{ fontSize: 20 }} />
            <div>参与人员</div>
          </>
        }
        noPadding
        title={'参与人员'}
      >
        <div>111</div>
      </RND>
    </>
  );
};
