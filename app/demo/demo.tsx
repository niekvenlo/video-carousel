import VideoCarousel from "../nick/video-carousel/video-carousel.js";

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

export function Demo() {
  return (
    <main>
      <VideoCarousel
        width={500}
        height={888}
        loadVideoByIndex={(index, video) => {
          video.src = `/nato/${tracks.at(index % tracks.length)}.MP4`;
          video.dataset.id = `${index}`;
          video.dataset.name = tracks.at(index % tracks.length);
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
        width={250}
        height={444}
        loadVideoByIndex={(index, video) => {
          video.src = `/nato/${tracks.at(index % tracks.length)}.MP4`;
          video.dataset.name = tracks.at(index % tracks.length);
        }}
        loadOverlay={(dataset) =>
          dataset && (
            <div
              style={{
                padding: "10vmin",
                flexGrow: 1,
                background: "#ddeeff99",
                fontSize: "14px",
                alignContent: "center",
              }}
            >
              {dataset?.name}
            </div>
          )
        }
        startIndex={0}
      />
    </main>
  );
}
