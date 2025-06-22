import { useState } from "react";

function useBoundedNumberState(initialValue: number, maximum: number) {
  const [value, setValue] = useState(initialValue);
  const safeSetValue = (newValue: number) =>
    setValue((maximum + newValue) % maximum);
  return [value, safeSetValue] as [typeof value, typeof setValue];
}

export default useBoundedNumberState;
