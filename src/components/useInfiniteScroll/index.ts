import { useEventListener, useMemoizedFn, useRequest, useUpdateEffect } from 'ahooks';
import { getTargetElement } from 'ahooks/lib/utils/domTarget';
import { useState } from 'react';

const getScrollTop = (el: Document | Element) => {
  if (el === document || el === document.body) {
    return Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
  }
  return (el as Element).scrollTop;
};

const getScrollHeight = (el: Document | Element) => {
  return (el as Element).scrollHeight || Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
};

const getClientHeight = (el: Document | Element) => {
  return (el as Element).clientHeight || Math.max(document.documentElement.clientHeight, document.body.clientHeight);
};

const useInfiniteScroll = (service, options) => {
  const { isNoMore, target, threshold = 50, onSuccess, onError, reloadDeps } = options;

  const [loadingMore, setLoadingMore] = useState(false);

  const { loading, run, cancel } = useRequest(service, {
    manual: true,
    onFinally: () => {
      setLoadingMore(false);
    },
    onSuccess: (d) => {
      onSuccess?.(d);
    },
    onError: (e) => onError?.(e),
  });

  const loadMore = () => {
    if (isNoMore) return;
    setLoadingMore(true);
    run();
  };

  const scrollMethod = () => {
    const el = getTargetElement(target);
    if (!el) {
      return;
    }

    const scrollTop = getScrollTop(el);
    const scrollHeight = getScrollHeight(el);
    const clientHeight = getClientHeight(el);
    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      loadMore();
    }
  };
  useEventListener(
    'scroll',
    () => {
      if (loading || loadingMore) {
        return;
      }
      scrollMethod();
    },
    { target },
  );
  return {
    loading: !loadingMore && loading,
    loadingMore,

    loadMore: useMemoizedFn(loadMore),
    cancel,
  };
};

export default useInfiniteScroll;
