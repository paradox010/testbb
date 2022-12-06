import { Button, Result } from 'antd';
import { history } from 'ice';

export default () => {
  const goHome = () => {
    history?.push({
      pathname: '/',
    });
  };
  return (
    <>
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问该页面，请联系管理员"
        extra={
          <Button type="primary" onClick={goHome}>
            返回首页
          </Button>
        }
      />
    </>
  );
};
