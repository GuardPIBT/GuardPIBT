(() => {
  const tabs = [...document.querySelectorAll('[data-film-scene]')];
  if (!tabs.length) return;
  const activate = (name, updateHash = false) => {
    if (!tabs.some(tab => tab.dataset.filmScene === name)) return;
    tabs.forEach(tab => {
      const selected = tab.dataset.filmScene === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      panel.hidden = !selected;
      if (!selected) panel.querySelectorAll('video').forEach(video => video.pause());
    });
    if (updateHash) history.replaceState(null, '', '#film-' + name);
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.filmScene, true));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        tabs[next].focus(); tabs[next].click();
      }
    });
  });
  const fromHash = () => {
    const match = /^#film-(city|industrial|forest)$/.exec(location.hash);
    if (match) {
      activate(match[1]);
      document.getElementById('film-' + match[1]).scrollIntoView({block:'start'});
    }
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
