## VideoCarousel for React

This is a proof of concept implementation of a video carousel player.
It uses three video players, and reuses them to play any number of videos.
At any moment you'll only see a single video, but you can swipe forward and backward to navigate between the videos.
This demo has been tested on:

- Safari and Chrome on iOS on mobile.
- Safari and Chrome on macOS.

### Installation

As usual,

```bash
npm  install
```

```bash
npm  run  dev
```

Your application will be available at `http://localhost:3006`. Note the port number.

### Usage

```jsx
<VideoCarousel
  width={500}
  height={888}
  startIndex={0} // Defaults to zero.
  loadVideoByIndex={(index, video) => {
    // Each video in the carousel will be identified by index. Use
    // the index to decide which video to load.
    // You have access to the internal video DOM element here, so you
    // can load your video however you like.
    // E.g. video.src = '/yourfile.mp4';
    // E.g. hls.attachMedia(video);
    // E.g. videojs(video.id);
    video.src = `/nato/${tracks.at(index % tracks.length)}.MP4`;
    // You can also add meta data to the video component. This will
    // be accessible in the `loadOverlay` function.
    video.dataset.id = `${index}`;
    video.dataset.name = tracks.at(index % tracks.length);
  }}
  loadOverlay={(dataset) =>
    // You can render an overlay component over each video.
    // If you have attached meta data to the video component in
    // `loadVideoByIndex` you can access it here.
    dataset && (
      <div
        style={{
          padding: "10vmin",
          flexGrow: 1,
          backgroundImage: "linear-gradient(0deg, #332195FF 0%, #71C4FF33 20%)",
          fontSize: "4vmin",
          alignContent: "flex-end",
        }}
      >
        <p>
          This is the video with index #{dataset?.id}, called "{dataset?.name}"
        </p>
      </div>
    )
  }
/>
```
