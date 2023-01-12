import { Button, Tabs } from 'antd';
import qpng from '@/assets/questionColor.png';

const Tool = () => {
  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab="类目体验" key="item-1">
          <div style={{ display: 'flex' }}>
            <img src={qpng} style={{ width: 70, marginRight: 20 }} />
            <div>
              <span style={{ lineHeight: 2.4, fontWeight: 500 }}>您的问题清单已经生成，请查收 </span>
              <Button type='primary' disabled>重新体验</Button>
            </div>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="类目发现" key="item-2" disabled>
          内容 2
        </Tabs.TabPane>
        <Tabs.TabPane tab="属性发现" key="item-3" disabled>
          内容 2
        </Tabs.TabPane>
        <Tabs.TabPane tab="别名发现" key="item-4" disabled>
          内容 2
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Tool;
