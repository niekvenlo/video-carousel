import { useEffect, useRef, useState } from "react";
import Draggable from "./draggable";
import { cx, throttle } from "./utils";
import "./video-carousel.css";

type Props = {
  loadVideoByIndex: (index: number, video: HTMLVideoElement) => void;
  startIndex?: number;
};

function VideoCarousel({ loadVideoByIndex, startIndex = 0 }: Props) {
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  // We define a total of three video components.
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const videoRefs = [videoRef1, videoRef2, videoRef3];

  const [idx, setIdx] = useState(startIndex);
  const getSafeIdx = (offset = 0) => (9 + idx + offset) % 3;
  // Derived state.
  const playerOrderingClass = ["uno", "dos", "tres"][getSafeIdx()];
  console.log(getSafeIdx(-1), getSafeIdx(), getSafeIdx(1));
  const previousPlayer = videoRefs[getSafeIdx()];
  const focusPlayer = videoRefs[getSafeIdx(1)];
  const nextPlayer = videoRefs[getSafeIdx(2)];
  console.log({
    p: previousPlayer.current,
    f: focusPlayer.current,
    n: nextPlayer.current,
  });

  useEffect(() => {
    // On mount, we initialise three videos using `loadVideoByIndex`
    loadVideoByIndex(idx - 1, videoRef1.current!);
    loadVideoByIndex(idx, videoRef2.current!);
    loadVideoByIndex(idx + 1, videoRef3.current!);
    setIdx(startIndex);
  }, [loadVideoByIndex, startIndex]);

  useEffect(() => {
    if (!hasUserInteracted) {
      return;
    }
    // Whenever idx changes, we move our attention to a different video.
    // We cancel any dragging, and move the players back to their initial location.
    setIsDragging(false);
    setXOffset(0);
    // And we play the video that is now front-and-center
    playVideoAtCurrentIndex();
    // loadVideoByIndex(idx + 1, videoRef3.current!);
  }, [idx]);

  const playVideoAtCurrentIndex = () => {
    videoRefs.forEach((ref) => ref.current?.pause());
    const playIndex = (idx + 1) % 3;
    videoRefs[playIndex].current?.play();
  };

  const handleUserInteraction = () => {
    if (hasUserInteracted) {
      return;
    }
    // We capture a single user interaction to trigger all three video components.
    // This initialises the players so we can later trigger them with code.
    videoRefs.forEach((ref) => ref.current?.play());
    videoRefs.forEach((ref) => ref.current?.pause());
    playVideoAtCurrentIndex();
    setHasUserInteracted(true);
  };
  const slideThreshold =
    (videoRef1.current?.getBoundingClientRect().width ?? 200) / 2;
  const swipeThreshold = 0.5;
  const [isDragging, setIsDragging] = useState(false);
  const [xOffset, setXOffset] = useState(0);
  const handleDragEnd = ({ x, dx }: { x: number; dx: number }) => {
    if (dx < -swipeThreshold) {
      // Handle quick swipe left
      setIdx(idx + 1);
    } else if (dx > swipeThreshold) {
      // Handle quick swipe right
      setIdx(idx - 1);
    } else if (x > slideThreshold) {
      setIdx(idx - 1);
    } else if (x < -slideThreshold) {
      setIdx(idx + 1);
    } else {
      setXOffset(x);
    }
  };
  const handleDrag = ({ x }: { x: number }) => {
    if (isDragging) {
      setXOffset(x);
      return;
    }
  };
  const throttledHandleDrag = throttle(handleDrag);

  return (
    <div className="video-carousel">
      <Draggable
        onDragStart={() => {
          handleUserInteraction();
          setIsDragging(true);
        }}
        onDragEnd={handleDragEnd}
        onDrag={throttledHandleDrag}
        onClick={handleUserInteraction}
      >
        <div
          className={cx("video-players", playerOrderingClass)}
          style={{ translate: `${xOffset}px` }}
        >
          <div className="giraffe">
            <video data-1 ref={videoRef1} playsInline loop width="500" />
          </div>
          <div className="elephant">
            <video data-2 ref={videoRef2} playsInline loop width="500" />
          </div>
          <div className="zebra">
            <video data-2 ref={videoRef3} playsInline loop width="500" />
          </div>
        </div>
      </Draggable>
    </div>
  );
}

export default VideoCarousel;
