import { Select, Tag } from 'antd';
import { history, request } from 'ice';
import { domainTypeEnum } from '@/dataType';
import { useRequest } from 'ahooks';

import { getParams, appendSearch } from '@/utils/location';


async function getDomains() {
  return await request('/api/standard/domain/list');
}

export default function DomainSelect() {
  const { data: domains } = useRequest(getDomains);

  const onSelectChange = (v) => {
    history?.push({
      pathname: history.location?.pathname,
      search: appendSearch(history?.location as any, { domainId: v }),
    });
  };
  return (
    <Select style={{ minWidth: 300, marginLeft: 20 }} defaultValue={Number(getParams()?.domainId)} onChange={onSelectChange}>
      {domains?.map((v) => (
        <Select.Option key={v.id} value={v.id}>
          <span>
            {v.name}
            <Tag style={{ marginLeft: 10 }} color={domainTypeEnum.find((e) => e.value === v.type)?.color}>
              {domainTypeEnum.find((e) => e.value === v.type)?.label}
            </Tag>
          </span>
        </Select.Option>
      ))}
    </Select>
  );
}
