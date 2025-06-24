import { useId, useRef } from "react";
import { getBoundedIdx } from "../nick/utils";

export type Role = "previous" | "focus" | "next";
export type VideoLoader = (index: number, video: HTMLVideoElement) => void;

function useVideoCarousel(loadVideoByIndex: VideoLoader, currentIdx: number) {
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

  const getPlayerIdx = (idx: number) => (900 + idx) % 3;

  // Whenever the user swipes, the video players change roles. This getter simplifies
  // accessing video components by the current role.
  const getVideoPlayer = (idx: number, role: Role) => {
    if (role === "previous") {
      return videoRefs[getPlayerIdx(idx)].ref.current;
    }
    if (role === "focus") {
      return videoRefs[getPlayerIdx(idx + 1)].ref.current;
    }
    return videoRefs[getPlayerIdx(idx + 2)].ref.current;
  };

  const playFocusVideo = (idx: number) => {
    const focusPlayer = getVideoPlayer(idx, "focus");
    videoRefs.forEach(({ ref }) => {
      if (ref.current !== focusPlayer) {
        ref.current?.pause();
      }
    });
    focusPlayer?.play();
  };

  const loadVideo = (role: Role) => {
    // Depending on the role of the video player, we load different videos.
    const indices = {
      previous: currentIdx - 1,
      focus: currentIdx,
      next: currentIdx + 1,
    };
    // Focus idx represents the index of the video component that is currently in focus.
    const focusIdx = getBoundedIdx(currentIdx, { max: 3 });
    loadVideoByIndex(indices[role], getVideoPlayer(focusIdx, role)!);
  };

  // Video components should be dynamically reordered based on their roles, so the
  // previous-focus-next order is preserved as roles change. This getter returns a
  // convenient className. (This method is agnostic about how you actually display
  // the video players on the page.)
  const getOrderingClass = (idx: number) =>
    ["a-b-c", "b-c-a", "c-a-b"][getPlayerIdx(idx)];

  return {
    videoRefs,
    getOrderingClass,
    loadVideo,
    playFocusVideo,
  };
}

export default useVideoCarousel;
