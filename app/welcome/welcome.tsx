import VideoCarousel from "../video-carousel/video-carousel.js";

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

export function Welcome() {
  return (
    <main>
      <VideoCarousel
        loadVideoByIndex={(index, video) => {
          video.src = `/nato/${tracks.at(index)}.MP4`;
        }}
        loadOverlay={(idx) => <p>{idx}</p>}
        startIndex={0}
      />
      {/* <VideoCarousel
        loadVideoByIndex={(index, video) => {
          video.src = `/nato/${tracks.at(index)}.MP4`;
        }}
        startIndex={0}
        style={{ width: "100px" }}
      /> */}
    </main>
  );
}
