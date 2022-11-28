/* eslint-disable max-len */
import { CloseOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import styles from './index.module.less';

const SouthEastArrow = () => (
  <svg width="20px" height="20px" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="m70.129 67.086l1.75-36.367c-0.035156-2.6523-2.9414-3.6523-4.8164-1.7773l-8.4531 8.4531-17.578-17.574c-2.3438-2.3438-5.7188-1.5625-8.0586 0.78125l-13.078 13.078c-2.3438 2.3438-2.4141 5.0117-0.074219 7.3516l17.574 17.574-8.4531 8.4531c-1.875 1.875-0.83594 4.8203 1.8164 4.8555l36.258-1.8594c1.6836 0.019531 3.1328-1.2812 3.1133-2.9688z" />
  </svg>
);

const CustomHandle = (props) => (
  <div
    style={{
      background: '#fff',
      borderRadius: '2px',
      border: '1px solid #ddd',
      height: '100%',
      width: '100%',
      padding: 0,
    }}
    className={'SomeCustomHandle'}
    {...props}
  />
);
const BottomRightHandle = () => (
  <CustomHandle>
    <SouthEastArrow />
  </CustomHandle>
);

const findOtherDrag = (ele: HTMLElement) => {
  const res: HTMLElement[] = [];
  if (!ele) return res;
  if (!ele.parentElement) return res;
  const childs = ele.parentElement.children;
  for (let i = 0; i < childs.length; i++) {
    if (childs[i] === ele) {
      continue;
    }
    if (childs[i].className.split(' ').includes('react-draggable')) {
      res.push(childs[i] as HTMLElement);
    }
  }
  return res;
};
const RndWrap = ({ text, title, children, noPadding = false, defaultPosY = -28 }) => {
  const rndRef = useRef<Rnd>(null);
  const [open, setOpen] = useState(false);
  const onClickLayerUp = () => {
    const ele = rndRef?.current?.resizableElement?.current;
    if (!ele) return;
    const otherDrag = findOtherDrag(ele);
    ele.style.zIndex = '30';
    otherDrag.forEach((e) => {
      e.style.zIndex = '29';
    });
  };
  const onOpenStyle = () => {
    onClickLayerUp();
    return open ? {} : { display: 'none' };
  };

  return (
    <>
      <div className={styles.rndIconTitle} onClick={() => setOpen(!open)}>
        {text}
      </div>
      <Rnd
        default={{
          x: -240,
          y: defaultPosY,
          width: 450,
          height: 500,
        }}
        ref={rndRef}
        style={onOpenStyle()}
        bounds={'body'}
        onMouseDown={onClickLayerUp}
        resizeHandleComponent={{ bottomRight: <BottomRightHandle /> }}
      >
        <div className={styles.rndModal}>
          <div className={styles.rndModalTitle}>
            {title}
            <span
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              className={styles.closeIcon}
              onClick={() => setOpen(false)}
            >
              <CloseOutlined />
            </span>
          </div>
          <div
            className={styles.rndModalContent}
            style={noPadding ? { padding: 0 } : {}}
            onMouseDown={(e) => {
              onClickLayerUp();
              e.stopPropagation();
            }}
          >
            {children}
          </div>
        </div>
      </Rnd>
    </>
  );
};
export default RndWrap;
