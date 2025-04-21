import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";

export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const debounced = useMemo(
    () =>
      debounce((val: T) => {
        setDebouncedValue(val);
      }, delay),
    [delay]
  );

  useEffect(() => {
    debounced(value);
    return () => {
      debounced.cancel();
    };
  }, [value, debounced]);



  return debouncedValue;
};
