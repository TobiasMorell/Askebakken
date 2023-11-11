import { useRef, useCallback, useEffect, useState } from "react";

export function useDelayedAction(delay: number, action: () => void) {
  const [secondsRemaining, setSecondsRemaining] = useState(delay);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setSecondsRemaining(delay);
    }
  }, [delay]);

  const executeAction = useCallback(() => {
    action();
    setSecondsRemaining(delay);
  }, [action, delay]);

  const tick = useCallback(() => {
    setSecondsRemaining((prevSecondsRemaining) => {
      if (prevSecondsRemaining === 1) {
        executeAction();
        return delay;
      }
      return prevSecondsRemaining - 1;
    });
    timeoutRef.current = setTimeout(tick, 1000);
  }, [executeAction, setSecondsRemaining]);

  const start = useCallback(() => {
    cancel();
    timeoutRef.current = setTimeout(tick, 1000);
  }, [cancel, tick]);

  return { start, cancel, secondsRemaining };
}
