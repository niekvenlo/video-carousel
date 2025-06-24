import { useId, useRef } from "react";

export type Role = "previous" | "focus" | "next";

function useVideoCarousel() {
  // We define a total of three video components, and cycle between them.
  const id = useId();
  const videoRefs = Object.freeze([
    {
      key: "video1",
      id: `video-carousel-player-1-${id}`,
      ref: useRef<HTMLVideoElement>(null),
    },
    {
      key: "video2",
      id: `video-carousel-player-2-${id}`,
      ref: useRef<HTMLVideoElement>(null),
    },
    {
      key: "video3",
      id: `video-carousel-player-3-${id}`,
      ref: useRef<HTMLVideoElement>(null),
    },
  ]);
  const getSafeIdx = (idx: number) => (9 + idx) % 3;

  // Whenever the user swipes, the video players change roles. This getter simplifies
  // accessing video components by the current role.
  const getVideoPlayer = (idx: number, role: Role) => {
    if (role === "previous") {
      return videoRefs[getSafeIdx(idx)].ref.current;
    }
    if (role === "focus") {
      return videoRefs[getSafeIdx(idx + 1)].ref.current;
    }
    return videoRefs[getSafeIdx(idx + 2)].ref.current;
  };

  const playVideoPlayer = (idx: number, role: Role) => {
    const focusPlayer = getVideoPlayer(idx, role);
    videoRefs.forEach(({ ref }) => {
      if (ref.current !== focusPlayer) {
        ref.current?.play();
      }
    });
    focusPlayer?.play();
  };

  // Video components should be dynamically reordered based on their roles, so the
  // previous-focus-next order is preserved as roles change. This getter returns a
  // convenient className. (This method is agnostic about how you actually display
  // the video players on the page.)
  const getOrderingClass = (idx: number) =>
    ["a-b-c", "b-c-a", "c-a-b"][getSafeIdx(idx)];

  return {
    videoRefs,
    getOrderingClass,
    getVideoPlayer,
    playVideoPlayer,
  };
}

export default useVideoCarousel;
