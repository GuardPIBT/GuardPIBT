(() => {
  const $ = (id) => document.getElementById(id);
  const replay = $('replay'), image = $('scene-image'), hero = $('hero-video');
  const scenes = {
    warehouse: { global: 'warehouse-replay.mp4', local: 'warehouse-local.webp', video: true,
      caption: '100,000 recorded agent positions per frame. Teal includes both moving and arrived agents. The vertical display scale is exaggerated 5× relative to the horizontal scale. This is a 30 s time-compressed replay, not real-time flight.',
      localCaption: 'Recorded 100k warehouse state at step 301, selected layer. Original ROS mesh at 0.45 relative scale; blue arrows show recorded next-step directions. This is a static snapshot, separate from the playback clock.' },
    city: { global: 'city-global.webp', local: 'city-local.webp', caption: '1,000,000 exact recorded positions at step 219. Display-height scaling is preserved from the archived render. This is a static snapshot, not an execution video.', localCaption: 'Selected-layer close-up from the same million-agent state. Original ROS meshes at 0.45 relative scale and recorded next-step arrows. Robot meshes and display scaling are not physical clearance guarantees.' },
    maze: { global: 'maze.webp', local: null, caption: 'Archived 100k maze midpoint with its corresponding local view. Obstacles and agent coordinates come from the recorded map and solver state. This is a static snapshot.' },
    throat: { global: 'throat-global.webp', local: 'throat-local.webp', caption: '10,000-agent 3D bottleneck: exact archived state at solver step 19,467, with 5,000 agents at goal. Blue and orange distinguish arrived and unresolved agents in this source render. This state is in the repair phase; not a new performance result.', localCaption: 'Local view of the same 10k bottleneck state. Mesh size and yaw are display conventions; yaw points toward goals and is not a recorded next-step command.' }
  };
  let active = 'warehouse', local = false;
  function icons() { if (window.lucide) window.lucide.createIcons(); }
  function render() {
    const scene = scenes[active];
    const file = local ? scene.local : scene.global;
    const isReplay = scene.video && !local;
    replay.pause(); replay.hidden = !isReplay; image.hidden = isReplay;
    if (!isReplay) { image.src = 'assets/' + file; image.alt = local ? scene.localCaption : scene.caption; }
    $('replay-readout').hidden = !isReplay;
    $('scene-kind').textContent = isReplay ? 'Exact sampled execution' : 'Recorded static snapshot';
    $('scene-caption').textContent = local ? scene.localCaption : scene.caption;
    $('download-view').href = 'assets/' + file;
    $('global-view').setAttribute('aria-pressed', String(!local));
    $('local-view').setAttribute('aria-pressed', String(local));
    $('local-view').disabled = !scene.local;
    $('scene-panel').setAttribute('aria-labelledby', 'tab-' + active);
    document.querySelectorAll('[data-scene]').forEach((button) => {
      const selected = button.dataset.scene === active;
      button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1;
    });
  }
  const tabs = [...document.querySelectorAll('[data-scene]')];
  tabs.forEach((button, index) => {
    button.addEventListener('click', () => { active = button.dataset.scene; local = false; render(); });
    button.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); tabs[next].click(); tabs[next].focus(); }
    });
  });
  $('global-view').addEventListener('click', () => { local = false; render(); });
  $('local-view').addEventListener('click', () => { local = true; render(); });
  function updateReadout() {
    const data = window.REPLAY_DATA;
    if (!data) return;
    const frame = data.frames[Math.min(data.frames.length - 1, Math.floor(replay.currentTime * data.fps))];
    $('step').textContent = frame.step.toLocaleString('en-US');
    $('arrived').textContent = frame.at_goal.toLocaleString('en-US') + ' / 100,000';
  }
  replay.addEventListener('timeupdate', updateReadout);
  replay.addEventListener('seeked', updateReadout);
  replay.addEventListener('play', () => hero.pause());
  function heroState() {
    $('hero-toggle').innerHTML = `<i data-lucide="${hero.paused ? 'play' : 'pause'}"></i>`;
    const label = hero.paused ? 'Play background' : 'Pause background';
    $('hero-toggle').setAttribute('aria-label', label); $('hero-toggle').title = label; icons();
  }
  $('hero-toggle').addEventListener('click', async () => {
    if (hero.paused) { try { await hero.play(); } catch { /* Native poster remains usable. */ } }
    else hero.pause();
  });
  hero.addEventListener('play', heroState); hero.addEventListener('pause', heroState);
  const allVideos = [...document.querySelectorAll('video')];
  allVideos.forEach(video => video.addEventListener('play', () => {
    allVideos.forEach(other => { if (other !== video) other.pause(); });
  }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) allVideos.forEach(video => video.pause()); });
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) hero.play().catch(() => {});
  icons(); updateReadout();
})();
