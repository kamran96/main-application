import { useEffect, useRef } from 'react';
import hotkeys from 'hotkeys-js';

export function useShortcut(key, cb) {
  const callbackRef = useRef(cb);

  useEffect(() => {
    callbackRef.current = cb;
  });

  useEffect(() => {
    hotkeys(key, (event) => {
      callbackRef.current(event);
      return false;
    });
  }, [key]);
}
