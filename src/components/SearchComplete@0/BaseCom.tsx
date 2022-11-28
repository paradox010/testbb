import { Input, InputRef } from 'antd';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import * as React from 'react';
import DropdownMenu from './DropdownMenu';
import { DataDrivenOptionProps } from './Option';
import SelectTrigger, { RefTriggerProps } from './SelectTrigger';
import { useComposeRef } from 'rc-util/lib/ref';
import useSelectTriggerControl from './useSelectTriggerControl';

export type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

export interface BaseSelectProps {
  emptyOptions?: boolean;
  options?: DataDrivenOptionProps[];

  // >>> Dropdown
  animation?: string;
  transitionName?: string;
  dropdownStyle?: React.CSSProperties;
  dropdownClassName?: string;
  dropdownMatchSelectWidth?: boolean | number;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  getPopupContainer?: () => HTMLElement;

  getRawInputElement?: () => JSX.Element;
}

interface BaseSelectContextProps extends BaseSelectProps {
  triggerOpen: boolean;
  toggleOpen: (open?: boolean) => void;
}

const BaseSelectContext = React.createContext<BaseSelectContextProps>(null);

function useBaseProps() {
  return React.useContext(BaseSelectContext);
}

const BaseSelect = React.forwardRef((props: BaseSelectProps, ref: React.Ref<BaseSelectRef>) => {
  const {
    emptyOptions,

    options = [],
    animation,
    transitionName,
    dropdownStyle,
    dropdownClassName,
    dropdownMatchSelectWidth,
    dropdownRender,
    getPopupContainer,

    getRawInputElement,
  } = props;

  // ============================== Refs ==============================
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<RefTriggerProps>(null);
  const selectorDomRef = React.useRef<HTMLDivElement>(null);

  // ============================== Open ==============================
  const [innerOpen, setInnerOpen] = useMergedState<boolean>(undefined, {
    defaultValue: false,
    value: false,
  });

  let mergedOpen = innerOpen;

  // Not trigger `open` in `combobox` when `notFoundContent` is empty
  const emptyListContent = emptyOptions;
  if (emptyListContent && mergedOpen) {
    mergedOpen = false;
  }
  const triggerOpen = emptyListContent ? false : mergedOpen;

  const onToggleOpen = React.useCallback(
    (newOpen?: boolean) => {
      const nextOpen = newOpen !== undefined ? newOpen : !mergedOpen;
      setInnerOpen(nextOpen);
    },
    [mergedOpen, setInnerOpen],
  );

  const customizeRawInputElement: React.ReactElement = typeof getRawInputElement === 'function' && getRawInputElement();
  const customizeRawInputRef = useComposeRef<HTMLElement>(selectorDomRef, customizeRawInputElement?.props?.ref);

  // ============================ Dropdown ============================
  const [containerWidth, setContainerWidth] = React.useState(0);

  useLayoutEffect(() => {
    if (triggerOpen) {
      const newWidth = Math.ceil(containerRef.current?.offsetWidth);
      if (containerWidth !== newWidth && !Number.isNaN(newWidth)) {
        setContainerWidth(newWidth);
      }
    }
  }, [triggerOpen]);

  // Used for raw custom input trigger
  // let onTriggerVisibleChange: null | ((newOpen: boolean) => void);
  // if (customizeRawInputElement) {
  const onTriggerVisibleChange = (newOpen: boolean) => {
    onToggleOpen(newOpen);
  };
  // }

  const optionList = (
    <>
      {options.map((v) => (
        <div>{v.label}</div>
      ))}
    </>
  );

  const [, forceUpdate] = React.useState({});
  // We need force update here since popup dom is render async
  function onPopupMouseEnter() {
    console.log('mouseenter');
    forceUpdate({});
  }
  // ============================ Context =============================
  const baseSelectContext = React.useMemo(
    () => ({
      ...props,
      open: mergedOpen,
      triggerOpen,
      toggleOpen: onToggleOpen,
    }),
    [props, triggerOpen, mergedOpen, onToggleOpen],
  );
  console.log('h');

  // Give focus back of Select
  const activeTimeoutIds: any[] = [];
  React.useEffect(
    () => () => {
      activeTimeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
      activeTimeoutIds.splice(0, activeTimeoutIds.length);
    },
    [],
  );

  useSelectTriggerControl(
    () => [containerRef.current, triggerRef.current?.getPopupElement()],
    triggerOpen,
    onToggleOpen,
    !!customizeRawInputElement,
  );

  return (
    <BaseSelectContext.Provider value={baseSelectContext}>
      <SelectTrigger
        ref={triggerRef}
        visible={triggerOpen}
        popupElement={optionList}
        containerWidth={containerWidth}
        animation={animation}
        transitionName={transitionName}
        dropdownStyle={dropdownStyle}
        dropdownClassName={dropdownClassName}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        dropdownRender={dropdownRender}
        getPopupContainer={getPopupContainer}
        getTriggerDOMNode={() => {
          console.log(selectorDomRef.current);
          return selectorDomRef.current as HTMLDivElement;
        }}
        onPopupVisibleChange={onTriggerVisibleChange}
        onPopupMouseEnter={onPopupMouseEnter}
      >
        {React.cloneElement(customizeRawInputElement, {
          ref: customizeRawInputRef,
        })}
      </SelectTrigger>
    </BaseSelectContext.Provider>
  );
});

export default BaseSelect;
