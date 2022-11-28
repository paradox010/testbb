import { Tabs } from 'antd';

const Tool = () => {
  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab="类目体验" key="item-1">
          内容 1
        </Tabs.TabPane>
        <Tabs.TabPane tab="类目发现" key="item-2">
          内容 2
        </Tabs.TabPane>
        <Tabs.TabPane tab="属性发现" key="item-3">
          内容 2
        </Tabs.TabPane>
        <Tabs.TabPane tab="别名发现" key="item-4">
          内容 2
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Tool;
