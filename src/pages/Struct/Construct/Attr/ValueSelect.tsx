import { Select } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import { useRef, useState } from 'react';

// string 以分号作为分隔符
const TagList: React.FC<{
  value?: string | string[];
  onChange?: (value: string) => void;
}> = ({ value, onChange }) => {
  const ref = useRef<RefSelectProps>(null);
  const [inputValue, setInputValue] = useState<string[]>(typeof value === 'string' ? value?.split('；') : value || []);

  const handleInputChange = (v) => {
    setInputValue(v);
    onChange?.(v.join('；'));
  };

  return (
    <>
      <Select
        ref={ref}
        mode="tags"
        placeholder="以分号；作为分隔符"
        style={{ width: '100%' }}
        tokenSeparators={['；']}
        open={false}
        value={inputValue}
        onChange={handleInputChange}
      />
    </>
  );
};

export default TagList;
