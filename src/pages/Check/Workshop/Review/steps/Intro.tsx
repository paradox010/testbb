import { Button, Collapse, Descriptions, Table } from 'antd';
import { reviewUserRoleTypeEnum } from '@/dataType';
import styles from './intro.module.less';

import { StepProps, StepCompType } from '../msg.d';
import { useContext } from 'react';
import BasicContext from '../basicContext';
import dayjs from 'dayjs';

const Step: React.FC<StepProps> = ({ stepMsg$, msgData }) => {
  const basic = useContext(BasicContext);
  return (
    <div className={styles.introContent}>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="与会人员介绍" key="1">
          {reviewUserRoleTypeEnum.map((v) => (
            <div className={styles.roleItem} key={v.value}>
              <div className={styles.roleTitle}>{v.label}</div>
              <div style={{ display: 'flex' }}>
                {basic.member
                  .filter((u) => u.userRole === v.value)
                  ?.map((u) => (
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
            <div>本期评选版本7个，入围版本2个</div>
            <div className={styles.versionWrap}>
              {basic.domain?.map((v) => (
                <div key={v.id} className={styles.versionItem}>
                  <div className={styles.titleWrap}>{v.domainName}</div>
                  <div className={styles.subTitle}>演讲人：{v.userName}</div>
                  <div style={{ display: 'flex' }}>
                    <div className={styles.subItem}>
                      <div className={styles.desLabel}>产品类目</div>
                      <div>{v.categoryCount}</div>
                    </div>
                    <div className={styles.subItem}>
                      <div className={styles.desLabel}>产品属性</div>
                      <div>{v.featureCount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        </Collapse.Panel>
        <Collapse.Panel header="会议流程介绍" key="3">
          <Table
            dataSource={basic.process}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: '阶段内容',
                dataIndex: 'content',
              },
              {
                title: '开始时间',
                dataIndex: 'startTime',
                render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
              },
              {
                title: '结束时间',
                dataIndex: 'endTime',
                render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
              },
            ]}
          />
        </Collapse.Panel>
        <Collapse.Panel header="规章流程介绍" key="4">
          <Descriptions bordered>
            {basic.regulation.map((v) => (
              <Descriptions.Item label={v.name} key={v.name} span={3} labelStyle={{ width: 250 }}>
                <a href={v.fileUrl} target="_blank" rel="noreferrer">
                  {v.fileName}
                </a>
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

const TypedStep = Step as StepCompType;

TypedStep.Title = ({ stepMsg$, msgData }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const basic = useContext(BasicContext);
  const goNext = () => {
    stepMsg$.emit({
      type: 'process',
      content: {
        processState: 3,
        isFirstProposal: true,
        proposalDomainId: basic.domain?.[0]?.id,
      },
    });
  };
  return (
    <>
      开场介绍
      <Button type="primary" onClick={goNext}>
        开始提议介绍
      </Button>
    </>
  );
};

export default TypedStep;
