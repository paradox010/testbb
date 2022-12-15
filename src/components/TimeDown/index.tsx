import { useUpdate } from 'ahooks';
import * as React from 'react';

import type { countdownValueType, valueType } from './utils';
import { formatCountdown } from './utils';

const REFRESH_INTERVAL = 1000 / 300;

export interface CountdownProps {
  value?: countdownValueType;
  format?: string;
}

function getTime(value?: countdownValueType) {
  return new Date(value as valueType).getTime();
}

const Countdown: React.FC<CountdownProps> = (props) => {
  const { value, format = 'HH:mm:ss' } = props;

  const forceUpdate = useUpdate();

  const countdown = React.useRef<NodeJS.Timer | null>(null);

  const stopTimer = () => {
    if (countdown.current) {
      clearInterval(countdown.current);
      countdown.current = null;
    }
  };

  const syncTimer = () => {
    const timestamp = getTime(value);
    // if (timestamp <= Date.now()) {
    countdown.current = setInterval(() => {
      forceUpdate();
      // if (timestamp > Date.now()) {
      //   stopTimer();
      // }
    }, REFRESH_INTERVAL);
    // }
  };

  React.useEffect(() => {
    syncTimer();
    return () => {
      if (countdown.current) {
        clearInterval(countdown.current);
        countdown.current = null;
      }
    };
  }, [value]);

  return <span>{formatCountdown(value || 0, { format })}</span>;
};

export default React.memo(Countdown);
