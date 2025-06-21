import { useRef } from "react";
import VideoCarousel from "../video-carousel/video-carousel.js";
export function Welcome() {
  const tracks = [
    `Alpha`,
    `Bravo`,
    `Charlie`,
    `Delta`,
    `Echo`,
    `Foxtrot`,
    `Golf`,
    `Hotel`,
    `India`,
    `Juliet`,
    `Kilo`,
    `Lima`,
    `Mike`,
    `November`,
    `Oscar`,
    `Papa`,
    `Quebec`,
    `Romeo`,
    `Sierra`,
    `Tango`,
    `Uniform`,
    `Victor`,
    `Whiskey`,
    `Xray`,
    `Yankee`,
    `Zulu`,
  ];

  const index = useRef(0);

  return (
    <main>
      <VideoCarousel
        loadCurrent={(video: HTMLVideoElement) => {
          video.src = `/nato/${tracks[index.current]}.MP4`;
        }}
        loadNext={(video: HTMLVideoElement) => {
          index.current++;
          video.src = `/nato/${tracks[index.current]}.MP4`;
        }}
        loadPrevious={(video: HTMLVideoElement) => {
          index.current--;
          video.src = `/nato/${tracks[index.current]}.MP4`;
        }}
      />
    </main>
  );
}
