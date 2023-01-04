import { Avatar, Badge, Button, ConfigProvider, Input, message, Popover, Select, Tooltip } from 'antd';

import { StepProps } from '../msg.d';

import { stepState } from '../basicContext';
import { snapshot, subscribe, useSnapshot } from 'valtio';
import { IdcardOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';

function resetObj(prev: Object, id: string) {
  const res = {};
  // eslint-disable-next-line guard-for-in
  for (const k in prev) {
    res[k] = false;
  }
  res[id] = true;
  return res;
}
ConfigProvider.config({});
const defaultReason = ['未签到', '掉线后联系不到', '其他原因'];
const Online: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const [clicked, setClicked] = useState({});
  const [hovered, setHovered] = useState({});
  const [select, setSelect] = useState('未签到');
  const [value, setValue] = useState('');

  const handleHoverChange = (open, id) => {
    if (clicked[id] && !open) return;
    setHovered((prev) => ({ ...prev, [id]: open }));
  };
  const handleClickChange = (open, id) => {
    if (open) {
      setValue('');
      setSelect('未签到');
      setHovered((prev) => resetObj(prev, id));
      setClicked((prev) => resetObj(prev, id));
    }
    if (!open) {
      setHovered((prev) => ({ ...prev, [id]: false }));
      setClicked((prev) => ({ ...prev, [id]: false }));
    }
  };

  const { member } = useSnapshot(stepState);
  useEffect(() => {
    let oldMember = snapshot(stepState.member);
    return subscribe(stepState.member, () => {
      stepState.member.forEach((v) => {
        const oldState = oldMember.find((o) => o.userId === v.userId);
        if (oldState && oldState.isOnline !== v.isOnline) {
          console.log(v);
          showMess({ userId: v.userId, userName: v.userName, isOnline: v.isOnline });
        }
      });
      oldMember = snapshot(stepState.member);
    });
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const showMess = (userMess) => {
    if (ref.current) {
      message.open({
        content: (
          <>
            <Avatar icon={<UserOutlined />} size={20} style={{ marginRight: 5, verticalAlign: -5 }} />
            <span style={{ color: '#FFAF5D' }}> {userMess.userName} </span>
            <span>{userMess.isOnline ? '进入' : '退出'}会议</span>
          </>
        ),
        duration: 1,
        key: userMess.userId,
        getPopupContainer: () => ref?.current as HTMLElement,
      });
    }
  };
  return (
    <div className={styles.online}>
      <div className={styles.header}>
        <span>
          <Badge status="success" />
          在线人员({member?.filter((v) => v.isOnline).length})
        </span>
        <span>
          <Badge status="error" />
          离线人员({member?.filter((v) => !v.isOnline).length})
        </span>
      </div>
      <div className={styles.userList} style={{ padding: '0 12px' }} ref={ref}>
        {member?.map((v) => (
          <div key={v.userId} className={styles.user}>
            <Badge status={v.isOnline ? 'success' : 'error'} />
            <Avatar
              size={28}
              style={{ backgroundColor: v.isOnline ? '#87d068' : 'lightgrey', marginRight: 5 }}
              icon={<UserOutlined />}
            />
            <span style={{ flex: '1' }}>{v.userName}</span>
            {/* {msgData.self.userRole === '4' && ( */}
              <Popover
                title={v.userName}
                open={hovered[v.userId]}
                onOpenChange={(open) => handleHoverChange(open, v.userId)}
                content={
                  <>
                    <div>联系方式：</div>
                    <div>手机号：</div>
                    <div>紧急联系人：</div>
                    <div>手机号：</div>
                    <Popover
                      trigger="click"
                      open={clicked[v.userId]}
                      onOpenChange={(open) => handleClickChange(open, v.userId)}
                      placement="left"
                      content={
                        <>
                          <div>请输入剔除原因</div>
                          <Select
                            value={select}
                            onChange={setSelect}
                            style={{ width: 150 }}
                            defaultValue="未签到"
                            options={defaultReason.map((k) => ({ label: k, value: k }))}
                          />
                          <div>
                            <Input.TextArea
                              placeholder="手动输入其他原因"
                              disabled={select !== '其他原因'}
                              onChange={(e) => setValue(e.target.value)}
                              value={value}
                              autoSize={{ minRows: 3, maxRows: 10 }}
                              allowClear
                            />
                          </div>
                          <div>
                            <Button onClick={() => handleClickChange(false, v.userId)}>取消</Button>
                            <Button type="primary">确定剔除</Button>
                          </div>
                        </>
                      }
                    >
                      <Button>剔除会议</Button>
                    </Popover>
                  </>
                }
              >
                <IdcardOutlined />
              </Popover>
            {/* )} */}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Online;
