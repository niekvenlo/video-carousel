import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Draggable from "./draggable";
import usePrevious from "./hooks/use-previous";
import { cx, throttle } from "./utils";
import "./video-carousel.css";

type Props = {
  className?: string;
  loadVideoByIndex: (index: number, video: HTMLVideoElement) => void;
  startIndex?: number;
  style?: CSSProperties;
};

function VideoCarousel(
  { className, loadVideoByIndex, startIndex = 0, style }: Props,
  ref: React.Ref<HTMLDivElement>
) {
  // We need direct user interaction to trigger playback, so we track whether
  // that's been achieved.
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // We define a total of three video components, and cycle between them.
  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ];

  // Index defines our place in the carousel. At any time:
  // - The previous player should display the video for the index - 1.
  // - The focused player should display the video associated with the current index.
  // - The next player should display the video for the index - 1.
  const [idx, setIdx] = useState(startIndex);
  const previousIdx = usePrevious(idx);

  const getSafeIdx = (offset = 0) => (9 + idx + offset) % 3;

  // Derived state.
  const playerOrderingClass = ["uno", "dos", "tres"][getSafeIdx()];
  const previousPlayer = videoRefs[getSafeIdx()];
  const focusPlayer = videoRefs[getSafeIdx(1)];
  const nextPlayer = videoRefs[getSafeIdx(2)];

  useEffect(() => {
    // On mount, we initialise a videos in each player.
    loadVideoByIndex(idx - 1, previousPlayer.current!);
    loadVideoByIndex(idx, focusPlayer.current!);
    loadVideoByIndex(idx + 1, nextPlayer.current!);
    setIdx(startIndex);
  }, [loadVideoByIndex, setIdx, startIndex]);

  useEffect(() => {
    // Whenever idx changes, we move our attention to a different video.
    // We cancel any dragging, and move the players back to their initial location.
    setIsDragging(false);
    setXOffset(0);
    // And we play the video that is now front-and-center
    if (hasUserInteracted) {
      // We must not fire `.play` or `.pause` commands unless the user has interacted.
      playFocusPlayer();
    }
    // And change the video that's currently loaded in the player that's moved.
    if (previousIdx !== null) {
      if (previousIdx < idx) {
        loadVideoByIndex(idx + 1, nextPlayer.current!);
      } else {
        loadVideoByIndex(idx - 1, previousPlayer.current!);
      }
    }
    if (previousIdx !== null && previousIdx < idx) {
    }
  }, [idx]);

  const playFocusPlayer = () => {
    previousPlayer.current?.pause();
    focusPlayer.current?.play();
    nextPlayer.current?.pause();
  };

  const handleUserInteraction = () => {
    if (hasUserInteracted) {
      return;
    }
    // We capture a single user interaction to trigger all three video components.
    // This initialises the players so we can later trigger them with code.
    videoRefs.forEach((ref) => ref.current?.play());
    videoRefs.forEach((ref) => ref.current?.pause());
    playFocusPlayer();
    setHasUserInteracted(true);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [xOffset, setXOffset] = useState(0);
  const handleDragEnd = ({ x, dx }: { x: number; dx: number }) => {
    const swipeThreshold = 0.5; // Magic number
    const slideThreshold =
      (videoRefs[0].current?.getBoundingClientRect().width ?? 200) / 2;

    if (dx < -swipeThreshold) {
      // Handle quick swipe left
      setIdx((idx) => idx + 1);
    } else if (dx > swipeThreshold) {
      // Handle quick swipe right
      setIdx((idx) => idx - 1);
    } else if (x < -slideThreshold) {
      // Handle slow slide left
      setIdx((idx) => idx + 1);
    } else if (x > slideThreshold) {
      // Handle slow slide right
      setIdx((idx) => idx - 1);
    } else {
      setXOffset(0);
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
    <div className={cx("video-carousel", className)} style={style} ref={ref}>
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
            <video data-1 ref={videoRefs[0]} playsInline loop width="500" />
          </div>
          <div className="elephant">
            <video data-2 ref={videoRefs[1]} playsInline loop width="500" />
          </div>
          <div className="zebra">
            <video data-2 ref={videoRefs[2]} playsInline loop width="500" />
          </div>
        </div>
        {!hasUserInteracted && <div className="placeholder" />}
      </Draggable>
    </div>
  );
}

export default forwardRef(VideoCarousel);
