import { useEffect, useRef, useState } from "react";
import Draggable from "./draggable";
import { cx, throttle } from "./utils";
import "./video-carousel.css";

type Props = {
  loadCurrent: (video: HTMLVideoElement) => void;
  loadNext: (video: HTMLVideoElement) => void;
  loadPrevious: (video: HTMLVideoElement) => void;
};

function VideoCarousel({ loadCurrent, loadNext, loadPrevious }: Props) {
  useEffect(() => {
    loadCurrent(videoRef1.current!);
    loadNext(videoRef2.current!);
  }, []);

  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  const [[video0Id, video1Id, video2Id], setVideoIds] = useState([
    "previous",
    "current",
    "next",
  ]);

  const handleUserInteraction = () => {
    videoRef1.current?.play();
    videoRef2.current?.play();
    videoRef2.current?.pause();
  };
  const [xOffset, setXOffset] = useState(0);
  const handleDrag = (x: number) => {
    setXOffset(x);
  };
  const throttledHandleDrag = throttle(handleDrag);

  return (
    <div className="video-carousel">
      <Draggable onDrag={throttledHandleDrag} onClick={handleUserInteraction}>
        <div
          className={cx("video-players", {})}
          style={{ translate: `${xOffset}px` }}
        >
          <div className={video0Id}>Previous</div>
          <div className={video1Id}>
            <video data-1 ref={videoRef1} playsInline loop width="400" />
          </div>
          <div className={video2Id}>
            <video data-2 ref={videoRef2} playsInline loop width="400" />
          </div>
        </div>
      </Draggable>
    </div>
  );
}

export default VideoCarousel;
