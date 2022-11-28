import Menu from 'antd/lib/menu';
import React from 'react';
import MentionsContext from './context';

import type { DataDrivenOptionProps } from './Option';

interface DropdownMenuProps {
  options: DataDrivenOptionProps[];
}

function DropdownMenu(props: DropdownMenuProps) {
  const {
    notFoundContent = 'not found',
    setActiveIndex,
    activeIndex,
    selectOption,
    onFocus,
    onBlur,
  } = React.useContext(MentionsContext);
  const { options } = props;
  const activeOption = options[activeIndex] || {};

  return (
    <Menu
      activeKey={activeOption.key}
      onSelect={({ key }) => {
        const option = options.find((v) => v.key === key);
        option && selectOption(option);
      }}
    >
      {options.map((option, index) => {
        const { key, disabled, className, style, label } = option;
        return (
          <Menu.Item
            key={key}
            disabled={disabled}
            className={className}
            style={style}
            onMouseEnter={() => {
              setActiveIndex(index);
            }}
          >
            {label}
          </Menu.Item>
        );
      })}
      {!options.length && <Menu.Item disabled>{notFoundContent}</Menu.Item>}
    </Menu>
  );
}
export default DropdownMenu;
