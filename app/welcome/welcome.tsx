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

  return (
    <main>
      <VideoCarousel
        loadVideoByIndex={(index, video) => {
          video.src = `/nato/${tracks.at(index)}.MP4`;
        }}
        startIndex={0}
      />
    </main>
  );
}
