// import { AutoComplete, Input } from 'antd';
import { useRequest } from 'ahooks';
import { request } from 'ice';
import SearchComplete from '@/components/SearchComplete';
import { getParams } from '@/utils/location';

async function getWords(keywords) {
  const resData = await request({
    url: `/api/standard/productCategory/search?domainId=${getParams()?.domainId}&keywords=${keywords}`,
  });
  return resData;
}

const Search: React.FC<{
  onSelect?: (value: string, option: any) => void;
}> = ({ onSelect }) => {
  const { data, run } = useRequest(getWords, {
    debounceWait: 400,
    manual: true,
  });

  const onSearch = (v) => {
    run(v);
  };
  const tData = data?.map((v) => ({
    label: v.name,
    value: v.id,
  }));

  return (
    <SearchComplete style={{ width: 250, marginRight: 10 }} onChange={onSearch} onSelect={onSelect} options={tData} />
    // <AutoComplete
    //   onSearch={onSearch}
    //   onSelect={onSelect}
    //   style={{ width: 300, marginRight: 10 }}
    //   placeholder="请输入关键词搜索"
    //   options={tData || []}
    // >
    //   <Input />
    // </AutoComplete>
  );
};
export default Search;
