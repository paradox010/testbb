import { Button, Collapse, Descriptions } from 'antd';
import { RoleType } from '@/dataType';
import styles from './intro.module.less';

const pp = [
  {
    userId: '1',
    userName: '杨纪朝',
  },
  {
    userId: '2',
    userName: 'b',
  },
];
const vs = [
  {
    id: '1',
    name: '海宁万联经编有限公司产品主数据标准',
    speach: '曹立中',
    nodeCount: 6231,
    categoryCount: 6231,
  },
  {
    id: '2',
    name: 'jsiodjfiosdjfios标准',
    speach: '曹立中',
    nodeCount: 6231,
    categoryCount: 6231,
  },
];
const Intro = ({ stepMsg$, msgData }) => {
  return (
    <div className={styles.introContent}>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="与会人员介绍" key="1">
          {RoleType.map((v) => (
            <div className={styles.roleItem} key={v.value}>
              <div className={styles.roleTitle}>{v.label}</div>
              <div style={{ display: 'flex' }}>
                {pp.map((u) => (
                  <div className={styles.userItem} key={u.userId}>
                    <div className={styles.userPic}>pic</div>
                    <div style={{ flex: '1' }}>
                      <div className={styles.userName}>{u.userName}</div>
                      <div className={styles.userDes}>中国纺织工业联合会副会长、中国针织工业协会会长</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Collapse.Panel>
        <Collapse.Panel header="讨论版本介绍" key="2">
          <>
            <div>本期评选版本7个，入围版本3个</div>
            <div className={styles.versionWrap}>
              {vs.map((v) => (
                <div key={v.id} className={styles.versionItem}>
                  <div className={styles.titleWrap}>{v.name}</div>
                  <div className={styles.subTitle}>演讲人：{v.speach}</div>
                  <div style={{ display: 'flex' }}>
                    <div className={styles.subItem}>
                      <div className={styles.desLabel}>产品类目</div>
                      <div>{v.nodeCount}</div>
                    </div>
                    <div className={styles.subItem}>
                      <div className={styles.desLabel}>产品属性</div>
                      <div>{v.categoryCount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        </Collapse.Panel>
        <Collapse.Panel header="会议流程介绍" key="3">
          1232
        </Collapse.Panel>
        <Collapse.Panel header="规章流程介绍" key="4">
          1232
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

Intro.Title = ({ stepMsg$, msgData }) => {
  return (
    <>
      开场介绍
      <Button type="primary">开始提议介绍</Button>
    </>
  );
};
export default Intro;
