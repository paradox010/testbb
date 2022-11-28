import React, { useEffect, useState, useRef } from 'react';
import KeyCode from 'rc-util/lib/KeyCode';

function isPlatformMac(): boolean {
  return /(mac\sos|macintosh)/i.test(navigator.appVersion);
}

// onkeyup & onkeydown
const OptionList = ({ open, options, select, onSelect }, ref) => {
  const [active, setActive] = useState<string>();
  const listRef = useRef(null);

  useEffect(() => {
    setActive(options?.[0]?.value);
  }, [options]);

  React.useImperativeHandle(ref, () => ({
    onKeyDown: (event) => {
      const { which, ctrlKey } = event;
      switch (which) {
        // >>> Arrow keys & ctrl + n/p on Mac
        case KeyCode.N:
        case KeyCode.P:
        case KeyCode.UP:
        case KeyCode.DOWN: {
          let offset = 0;
          if (which === KeyCode.UP) {
            offset = -1;
          } else if (which === KeyCode.DOWN) {
            offset = 1;
          } else if (isPlatformMac() && ctrlKey) {
            if (which === KeyCode.N) {
              offset = 1;
            } else if (which === KeyCode.P) {
              offset = -1;
            }
          }

          if (offset !== 0) {
            const idx = options.findIndex((v) => v.value === active);
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            if (idx !== -1 && options[idx + offset]) {
              // scrollIntoView(idx + offset);
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              setActive(options[idx + offset].value);
            }
          }

          break;
        }

        // >>> Select
        case KeyCode.ENTER: {
          // value
          const item = options.find((v) => v.value === active);
          if (item && !item?.disabled) {
            onSelect(item);
          } else {
            onSelect(undefined);
          }

          if (open) {
            event.preventDefault();
          }
          break;
        }
        default:
          break;
        // >>> Close
        // case KeyCode.ESC: {
        //   toggleOpen(false);
        //   if (open) {
        //     event.stopPropagation();
        //   }
        // }
      }
    },
    divRef: listRef,
  }));

  return (
    <div ref={listRef} style={{ maxHeight: 256, overflow: 'auto', padding: options?.length > 0 ? '4px 0' : 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {options?.map((v) => (
          <div
            key={v.value}
            onMouseEnter={() => setActive(v.value)}
            onClick={() => onSelect(v)}
            className={`ant-select-item ${
              select === v.value ? 'ant-select-item-option-selected ant-select-item-option' : 'ant-select-item-option'
            } ${active === v.value ? 'ant-select-item-option-active' : ''}`}
          >
            <div className="ant-select-item-option-content">{v.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RefOptionList = React.forwardRef(OptionList);

export default RefOptionList;
