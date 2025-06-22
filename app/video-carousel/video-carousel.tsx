import { useEffect, useRef, useState } from "react";
import Draggable from "./draggable";
import { cx, throttle } from "./utils";
import "./video-carousel.css";

type Props = {
  loadVideoByIndex: (index: number, video: HTMLVideoElement) => void;
  index?: number;
};

const SNAP_DISTANCE = 200;
function VideoCarousel({ loadVideoByIndex, index = 0 }: Props) {
  useEffect(() => {
    loadVideoByIndex(index, videoRef1.current!);
    loadVideoByIndex(index + 1, videoRef2.current!);
    loadVideoByIndex(index + 2, videoRef3.current!);
    setIdx(index);
  }, [loadVideoByIndex, index]);

  const [idx, setIdx] = useState(index);

  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);

  const handleUserInteraction = () => {
    videoRef1.current?.play();
    videoRef2.current?.play();
    videoRef2.current?.pause();
    videoRef3.current?.play();
    videoRef3.current?.pause();
  };
  const [isDragging, setIsDragging] = useState(false);
  const [xOffset, setXOffset] = useState(0);
  const handleDrag = ({ x, dx }: { x: number; dx: number }) => {
    if (!isDragging) {
      return;
    }
    const slideThreshold =
      (videoRef1.current?.getBoundingClientRect().width ?? 200) / 2;
    const SWIPE_THRESHOLD = 0.5;
    if (dx < -SWIPE_THRESHOLD) {
      // Handle quick swipe left
      setIdx(idx + 1);
      setIsDragging(false);
      setXOffset(0);
    } else if (dx > SWIPE_THRESHOLD) {
      // Handle quick swipe right
      setIdx(idx - 1);
      setIsDragging(false);
      setXOffset(0);
    } else if (x > slideThreshold || x < -slideThreshold) {
      if (x > 0) {
        setIdx(idx - 1);
      } else {
        setIdx(idx + 1);
      }
      setIsDragging(false);
      setXOffset(0);
    } else {
      setXOffset(x);
    }
  };
  const throttledHandleDrag = throttle(handleDrag);

  return (
    <div className="video-carousel">
      <Draggable
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onDrag={throttledHandleDrag}
        onClick={handleUserInteraction}
      >
        <div
          className={cx("video-players", {
            uno: idx % 3 === 0,
            dos: idx % 3 === 1,
            tres: idx % 3 === 2,
            [`num-${idx}`]: true,
          })}
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
