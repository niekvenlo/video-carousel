import { useState } from "react";
import usePrevious from "./use-previous";

const useIndex = (initialIndex: number) => {
  const [idx, setIdx] = useState(initialIndex);
  const previousIdx = usePrevious(idx) ?? initialIndex;
  const incrementIdx = () => setIdx((i) => i + 1);
  const decrementIdx = () => setIdx((i) => i - 1);
  return {
    currentIdx: idx,
    previousIdx,
    decrementIdx,
    incrementIdx,
    setCurrentIdx: setIdx,
  };
};

export default useIndex;
