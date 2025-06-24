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
          video.dataset.id = `${index}`;
          video.dataset.name = tracks.at(index);
        }}
        loadOverlay={(dataset) =>
          dataset && (
            <div
              style={{
                padding: "10vmin",
                flexGrow: 1,
                backgroundImage:
                  "linear-gradient(0deg, #332195FF 0%, #71C4FF33 20%)",
                fontSize: "4vmin",
                alignContent: "flex-end",
              }}
            >
              <p>
                This is the video with index #{dataset?.id}, called "
                {dataset?.name}"
              </p>
            </div>
          )
        }
        startIndex={0}
      />
      <VideoCarousel
        loadVideoByIndex={(index, video) => {
          video.src = `/nato/${tracks.at(index)}.MP4`;
          video.dataset.name = tracks.at(index);
        }}
        loadOverlay={(dataset) =>
          dataset && (
            <div
              style={{
                padding: "10vmin",
                flexGrow: 1,
                background: "purple",
                fontSize: "14px",
                alignContent: "center",
              }}
            >
              {dataset?.name}
            </div>
          )
        }
        startIndex={0}
        style={{ width: "100px" }}
      />
    </main>
  );
}
