import { useNavigation } from '@remix-run/react';
import { createRef, useEffect, lazy, useRef, useCallback } from 'react';
import type { LoadingBarRef } from 'react-top-loading-bar';
import ClientOnly from '~/core/ui/ClientOnly';

const LoadingBar = lazy(() => import('react-top-loading-bar'));

// we wait 50ms before displaying the loading bar
// to avoid useless animations when navigation is fast
const DEFAULT_MIN_WAITING = 50;

function AppRouteLoadingIndicator() {
  const ref = createRef<LoadingBarRef>();
  const runningRef = useRef(false);
  const timeoutRef = useRef<number>();
  const navigation = useNavigation();

  const scheduleAnimation = useCallback(() => {
    return window.setTimeout(() => {
      runningRef.current = true;
      ref.current?.continuousStart();
    }, DEFAULT_MIN_WAITING);
  }, [ref]);

  const state = navigation.state;

  useEffect(() => {
    const isIdle = state === 'idle';
    const isRouteLoading = state === 'loading';

    if (isRouteLoading) {
      timeoutRef.current = scheduleAnimation();
    }

    if (isIdle) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      if (runningRef.current) {
        ref.current?.complete();
        runningRef.current = false;
      }
    }
  }, [ref, navigation.state, scheduleAnimation, state]);

  return (
    <ClientOnly>
      <LoadingBar
        height={4}
        waitingTime={200}
        shadow
        className={'bg-primary-500'}
        color={''}
        ref={ref}
      />
    </ClientOnly>
  );
}

export default AppRouteLoadingIndicator;
