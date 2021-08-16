import { useEffect, useRef } from "react";

export function useShortcut(key, cb) {
  const callbackRef = useRef(cb);

  useEffect(() => {
    callbackRef.current = cb;
  });

  useEffect(() => {
    function handle(event) {
      event.preventDefault();
      event.stopPropagation();

      if (event.ctrlKey && event.key === key) {
        callbackRef.current(event);
      }
    }

    document.addEventListener("keyup", handle);
    return () => document.removeEventListener("keyup", handle);
  }, [key]);
}
