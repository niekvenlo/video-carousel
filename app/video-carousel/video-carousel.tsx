import {
  forwardRef,
  useEffect,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import Draggable from "./draggable";
import useIndex from "./hooks/use-index";
import useVideoCarousel, { type Role } from "./hooks/use-video-carousel";
import { cx, getBoundedIdx, throttle } from "./utils";
import "./video-carousel.css";

type Props = {
  // We pass the video component to you, so you can attach your video src however you like.
  // E.g. video.src = '/yourfile.mp4';
  // E.g. hls.attachMedia(video);
  // E.g. videojs(video.id);
  // TODO: Allow the carousel to the bounded by returning `null` from this function to
  // indicate the index is out-of-bounds.
  loadVideoByIndex: (index: number, video: HTMLVideoElement) => void;
  // TODO: Check whether players re-render when startIndex changes.
  loadOverlay?: (index: number) => ReactElement;
  startIndex?: number;
  // Allow you to override styling.
  className?: string;
  style?: CSSProperties;
};

function VideoCarousel(
  { className, loadVideoByIndex, loadOverlay, startIndex = 0, style }: Props,
  ref: React.Ref<HTMLDivElement>
) {
  // We need direct user interaction to trigger playback, so we track whether
  // that's been achieved.
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // We define a total of three video components, and cycle between them.
  const { videoRefs, getOrderingClass, getVideoPlayer, playVideoPlayer } =
    useVideoCarousel();

  // Index defines our place in the carousel. At any time:
  // - The previous player should display the video for the index - 1.
  // - The focused player should display the video associated with the current index.
  // - The next player should display the video for the index - 1.
  const { currentIdx, previousIdx, decrementIdx, incrementIdx, setCurrentIdx } =
    useIndex(startIndex);

  const loadVideo = (role: Role) => {
    // Focus idx represents the index of the video component that is currently in focus.
    const focusIdx = getBoundedIdx(currentIdx, { max: 3 });
    if (role === "previous") {
      loadVideoByIndex(currentIdx - 1, getVideoPlayer(focusIdx, role)!);
    }
    if (role === "focus") {
      loadVideoByIndex(currentIdx, getVideoPlayer(focusIdx, role)!);
    }
    if (role === "next") {
      loadVideoByIndex(currentIdx + 1, getVideoPlayer(focusIdx, role)!);
    }
  };

  useEffect(() => {
    // On mount, we initialise a videos in each player.
    loadVideo("previous");
    loadVideo("focus");
    loadVideo("next");
    setCurrentIdx(startIndex);
  }, [loadVideoByIndex, setCurrentIdx, startIndex]);

  useEffect(() => {
    // Whenever idx changes, we move our attention to a different video.
    // We cancel any dragging, including the translation we've applied to the
    // `video-players` div. Ideally, this movement would be animated more pleasantly.
    // And we play the video that is now front-and-center.
    if (hasUserInteracted) {
      // We must not fire `.play` or `.pause` commands unless the user has interacted.
      playVideoPlayer(currentIdx, "focus");
    }
    setIsDragging(false);
    setXOffset(0);
    if (currentIdx > previousIdx) {
      // We are incrementing the idx, so we should load the next video.
      loadVideo("next");
    } else {
      // We are decrementing the idx, so we should load the previous video.
      loadVideo("previous");
    }
  }, [currentIdx]);

  // We capture a single user interaction to trigger all three video components.
  // This initialises the players so we can later trigger them with code.
  const handleUserInteraction = () => {
    if (hasUserInteracted) {
      return;
    }
    videoRefs.forEach(({ ref }) => ref.current?.play());
    videoRefs.forEach(({ ref }) => ref.current?.pause());
    playVideoPlayer(currentIdx, "focus");
    setHasUserInteracted(true);
  };

  // Handle dragging. There are much better libraries for this kind of thing.
  const [isDragging, setIsDragging] = useState(false);
  const [xOffset, setXOffset] = useState(0);
  const handleDragEnd = ({ x, dx }: { x: number; dx: number }) => {
    const swipeThreshold = 0.1; // Magic number
    const slideThreshold =
      (videoRefs[0].ref.current?.getBoundingClientRect().width ?? 200) / 2;

    const isQuickSwipeLeft = dx < -swipeThreshold;
    const isQuickSwipeRight = dx > swipeThreshold;
    const isSlowSlideLeft = x < -slideThreshold;
    const isSlowSlideRight = x > slideThreshold;
    if (isQuickSwipeLeft || isSlowSlideLeft) {
      incrementIdx();
    } else if (isQuickSwipeRight || isSlowSlideRight) {
      decrementIdx();
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
          className={cx("video-players", getOrderingClass(currentIdx))}
          style={{ translate: `${xOffset}px` }}
        >
          {videoRefs.map(({ ref, key, id }) => (
            <div key={key}>
              {loadOverlay && loadOverlay(currentIdx)}
              <video id={id} ref={ref} playsInline loop width="500" />
            </div>
          ))}
        </div>
        {!hasUserInteracted && <div className="placeholder" />}
      </Draggable>
    </div>
  );
}

export default forwardRef(VideoCarousel);
