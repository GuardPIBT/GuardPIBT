(() => {
  'use strict';
  const video = document.getElementById('million-video');
  const data = window.MILLION_REPLAY;
  if (!video || !data) return;
  const step = document.getElementById('million-step');
  const arrived = document.getElementById('million-arrived');
  const number = new Intl.NumberFormat('en-US');
  function updateFrame(index) {
    const frame = Math.max(0, Math.min(data.at_goal.length - 1, index));
    step.textContent = number.format(frame);
    arrived.textContent = number.format(data.at_goal[frame]) + ' / 1,000,000';
  }
  function update() {
    updateFrame(Math.floor(video.currentTime * data.fps + 0.0001));
  }
  for (const event of ['loadedmetadata', 'timeupdate', 'seeked', 'ended']) {
    video.addEventListener(event, () => update());
  }
  if ('requestVideoFrameCallback' in video) {
    const onFrame = (_, metadata) => {
      // Presentation timestamps are quantized; select the nearest source frame.
      updateFrame(Math.round(metadata.mediaTime * data.fps));
      video.requestVideoFrameCallback(onFrame);
    };
    video.requestVideoFrameCallback(onFrame);
  }
  update();
})();
