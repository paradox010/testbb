import { Select, Input, InputRef } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import useTriggerControl from './useTriggerControl';
import OptionList from './Option';

import { InputProps } from 'antd/es/input';

type InputAttrs = Omit<InputProps, 'prefix' | 'onChange' | 'onSelect' | 'value'>;
interface SProps extends InputAttrs {
  value?: string;
  onChange?: (text: string) => void;
  onSelect?: (value: string, v: { label: string; value: string | number }) => void;
  options?: Array<{ label: string; value: string | number }>;
}
const SearchComplete: React.FC<SProps> = ({ value, onChange, onSelect, options = [], ...restProps }) => {
  const containerRef = useRef<InputRef>(null);

  const [open, setOpen] = useState(false);

  const onToggleOpen = React.useCallback(
    (newOpen?: boolean) => {
      const nextOpen = newOpen !== undefined ? newOpen : !open;
      setOpen(nextOpen);
      // if (!nextOpen || (!options || options?.length === 0)) {
      // }
    },
    [open, setOpen],
  );

  const [val, setVal] = useState(value || '');
  const [innerSelect, setInnerSelect] = useState('');
  const onInnerSelect = (v) => {
    setVal(v.label);
    setInnerSelect(v.value);
    onToggleOpen();
    containerRef.current?.focus();
    onSelect?.(v.value, v);
  };
  const onInput = (e) => {
    setVal(e.target.value);
    setInnerSelect('');
    onToggleOpen(true);
    onChange?.(e.target.value);
  };

  const [width, setWidth] = useState(200);
  useEffect(() => {
    if (containerRef.current?.input?.offsetWidth) {
      setWidth(containerRef.current?.input?.offsetWidth);
    }
  }, []);

  useTriggerControl(
    () => [containerRef.current?.input as HTMLInputElement, listRef.current?.divRef?.current as HTMLElement],
    open,
    onToggleOpen,
    true,
  );

  const listRef = useRef(null);

  const onKeyDown = (event) => {
    if (open && listRef.current) {
      listRef.current.onKeyDown(event);
    }
  };
  return (
    <>
      <Select
        // value={innerSelect}
        // onSelect={onInnerSelect}
        open={open}
        dropdownMatchSelectWidth={width}
        dropdownStyle={{ padding: 0 }}
        // options={options}
        dropdownRender={() => {
          return (
            <OptionList open={open} ref={listRef} options={options} select={innerSelect} onSelect={onInnerSelect} />
            // <div
            //   ref={listRef}
            //   style={{ maxHeight: 256, overflow: 'auto', padding: options?.length > 0 ? '4px 0' : 0 }}
            // >
            //   <div className={styles.items} style={{ display: 'flex', flexDirection: 'column' }}>
            //     {options?.map((v) => (
            //       <div
            //         onClick={() => onInnerSelect(v)}
            //         className={`ant-select-item ${
            //           innerSelect === v.value
            //             ? 'ant-select-item-option-selected ant-select-item-option'
            //             : 'ant-select-item-option'
            //         }`}
            //       >
            //         <div className="ant-select-item-option-content">{v.label}</div>
            //       </div>
            //     ))}
            //   </div>
            // </div>
          );
        }}
        getRawInputElement={() => (
          <span style={{ display: 'inline-block' }}>
            <Input
              {...restProps}
              onMouseDown={() => {
                onToggleOpen(true);
              }}
              value={val}
              ref={containerRef}
              onChange={onInput}
              placeholder="请输入关键词搜索"
              onKeyDown={onKeyDown}
            />
          </span>
        )}
      />
    </>
  );
};

export default SearchComplete;
