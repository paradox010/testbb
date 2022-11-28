import Input, { InputProps, InputRef } from 'antd/lib/input';
import React, { useState, useRef, useEffect } from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import KeywordTrigger from './KeywordTrigger';

import type { DataDrivenOptionProps, OptionProps } from './Option';
import CompleteContext from './context';

export type Placement = 'top' | 'bottom';
export type Direction = 'ltr' | 'rtl';

export interface CompleteRef {
  focus: () => void;
  blur: () => void;
}
type InputAttrs = Omit<InputProps, 'prefix' | 'onChange' | 'onSelect'>;

// 1. 不会被选中
// 2. 输入记录

export interface CompleteProps extends InputAttrs {
  autoFocus?: boolean;
  defaultValue?: string;
  notFoundContent?: React.ReactNode;
  placement?: Placement;
  direction?: Direction;
  value?: string;

  onChange?: (text: string) => void;
  onSelect?: (option: OptionProps) => void;
  onSearch?: () => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  getPopupContainer?: () => HTMLElement;
  dropdownClassName?: string;

  open?: boolean;
  children?: React.ReactNode;
  options?: DataDrivenOptionProps[];
}

const Complete = React.forwardRef<CompleteRef, CompleteProps>((props, ref) => {
  const {
    style,

    notFoundContent,
    value,
    defaultValue,
    children,
    options,
    open,

    onChange,
    onKeyDown,
    onKeyUp,
    onPressEnter,
    onSearch,
    onSelect,

    onFocus,
    onBlur,

    placement,
    direction,
    getPopupContainer,
    dropdownClassName,

    ...restProps
  } = props;

  const inputRef = useRef<InputRef>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const [mergeValue, setMergedValue] = useMergedState('', {
    defaultValue,
    value,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // ============================== Change ==============================

  const triggerChange = (nextValue: string) => {
    setMergedValue(nextValue);
    onChange?.(nextValue);
  };
  const selectOption = (option: DataDrivenOptionProps) => {
    triggerChange(option.label?.toString() as string);
    onSelect?.(option);
  };

  const onInternalChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value: nextValue } }) => {
    triggerChange(nextValue);
  };
  const onInternalPressEnter: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (onPressEnter) {
      onPressEnter(event);
    }
  };

  // ============================ Focus Blur ============================
  const [isFocus, setIsFocus] = useState(false);
  const focusRef = useRef<number>();

  const onInternalFocus = (event?: React.FocusEvent<HTMLInputElement>) => {
    window.clearTimeout(focusRef.current);
    if (!isFocus && event && onFocus) {
      onFocus(event);
    }
    setIsFocus(true);
  };

  const onInternalBlur = (event?: React.FocusEvent<HTMLInputElement>) => {
    focusRef.current = window.setTimeout(() => {
      setIsFocus(false);
      onBlur?.(event as any);
    }, 0);
  };

  const onDropdownFocus = () => {
    onInternalFocus();
  };

  const onDropdownBlur = () => {
    onInternalBlur();
  };

  return (
    <div style={style}>
      <Input
        ref={inputRef}
        value={mergeValue}
        onChange={onInternalChange}
        // onKeyDown={onInternalKeyDown}
        // onKeyUp={onInternalKeyUp}
        onPressEnter={onInternalPressEnter}
        onFocus={onInternalFocus}
        onBlur={onInternalBlur}
      />
      <div ref={measureRef}>
        <CompleteContext.Provider
          value={{
            notFoundContent,
            activeIndex,
            setActiveIndex,
            selectOption,
            onFocus: onDropdownFocus,
            onBlur: onDropdownBlur,
          }}
        >
          <KeywordTrigger
            placement={placement}
            direction={direction}
            visible
            getPopupContainer={getPopupContainer}
            dropdownClassName={dropdownClassName}
            options={[]}
          >
            <span>1</span>
          </KeywordTrigger>
        </CompleteContext.Provider>
      </div>
    </div>
  );
}) as React.ForwardRefExoticComponent<React.PropsWithoutRef<CompleteProps> & React.RefAttributes<CompleteRef>> & {
  Option: typeof Option;
};

Complete.defaultProps = {
  notFoundContent: null,
};

Complete.Option = Option;

export default Complete;
