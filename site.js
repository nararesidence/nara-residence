const menuButton = document.querySelector('[data-menu-button]');
const navigation = document.querySelector('[data-navigation]');

if (menuButton && navigation) {
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton.addEventListener('click', () => {
    const willOpen = !navigation.classList.contains('is-open');
    navigation.classList.toggle('is-open', willOpen);
    menuButton.setAttribute('aria-expanded', String(willOpen));
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

for (const year of document.querySelectorAll('[data-current-year]')) {
  year.textContent = new Date().getFullYear();
}

const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = lightbox?.querySelector('[data-lightbox-image]');
const lightboxCaption = lightbox?.querySelector('[data-lightbox-caption]');
const lightboxClose = lightbox?.querySelector('[data-lightbox-close]');

if (lightbox && lightboxImage && lightboxCaption && lightboxClose) {
  for (const trigger of document.querySelectorAll('[data-zoom-src]')) {
    trigger.addEventListener('click', () => {
      lightboxImage.src = trigger.dataset.zoomSrc;
      lightboxImage.alt = trigger.dataset.zoomAlt || '';
      lightboxCaption.textContent = trigger.dataset.zoomAlt || '';
      lightbox.showModal();
    });
  }

  lightboxClose.addEventListener('click', () => lightbox.close());

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}

const musicCopy = {
  en: {
    play: 'Play background music',
    pause: 'Pause background music',
    playLabel: 'Play music',
    on: 'Music on',
    off: 'Music off',
  },
  zh: {
    play: '播放背景音乐',
    pause: '暂停背景音乐',
    playLabel: '播放音乐',
    on: '音乐已开启',
    off: '音乐已关闭',
  },
}[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'];

const soundtrack = document.createElement('audio');
soundtrack.src = '/audio/sky-forgot-to-fall.mp3';
soundtrack.preload = 'metadata';
soundtrack.loop = true;
soundtrack.setAttribute('playsinline', '');
soundtrack.setAttribute('aria-hidden', 'true');
document.body.append(soundtrack);

const musicControl = document.createElement('button');
musicControl.type = 'button';
musicControl.className = 'music-control';
musicControl.innerHTML = '<span class="music-bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="music-label"></span>';
document.body.append(musicControl);

const musicLabel = musicControl.querySelector('.music-label');
const musicDuration = 188;
let wantsMusic = true;

try {
  wantsMusic = window.sessionStorage.getItem('nara-music-enabled') !== 'false';
  const savedTime = Number(window.sessionStorage.getItem('nara-music-time'));
  if (Number.isFinite(savedTime) && savedTime > 0 && savedTime < musicDuration) soundtrack.currentTime = savedTime;
} catch {
  wantsMusic = true;
}

const updateMusicControl = () => {
  const playing = !soundtrack.paused;
  musicControl.setAttribute('aria-pressed', String(playing));
  musicControl.setAttribute('aria-label', playing ? musicCopy.pause : musicCopy.play);
  musicLabel.textContent = playing ? musicCopy.on : wantsMusic ? musicCopy.playLabel : musicCopy.off;
};

const playSoundtrack = async () => {
  if (!wantsMusic) return false;
  try {
    await soundtrack.play();
  } catch {
    // Browsers block audio until the visitor taps or clicks; the unlock listeners below retry.
  }
  updateMusicControl();
  return !soundtrack.paused;
};

musicControl.addEventListener('click', async () => {
  if (!soundtrack.paused) {
    wantsMusic = false;
    soundtrack.pause();
  } else {
    wantsMusic = true;
    await playSoundtrack();
  }
  try {
    window.sessionStorage.setItem('nara-music-enabled', String(wantsMusic));
  } catch {
    // Music still works when storage is unavailable.
  }
  updateMusicControl();
});

// Touch taps only count as a permitted gesture on pointerup (not pointerdown), so listen for all three.
const unlockEvents = ['pointerup', 'click', 'keydown'];
const unlockSoundtrack = async (event) => {
  if (event.target.closest?.('.music-control')) return;
  if (!wantsMusic || !soundtrack.paused) return;
  if (await playSoundtrack()) {
    for (const name of unlockEvents) document.removeEventListener(name, unlockSoundtrack);
  }
};
for (const name of unlockEvents) document.addEventListener(name, unlockSoundtrack, { passive: true });

window.addEventListener('pageshow', playSoundtrack);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') playSoundtrack();
  else soundtrack.pause();
});

window.addEventListener('pagehide', () => {
  try {
    window.sessionStorage.setItem('nara-music-time', String(soundtrack.currentTime || 0));
  } catch {
    // Navigation continues normally when storage is unavailable.
  }
});

soundtrack.addEventListener('play', updateMusicControl);
soundtrack.addEventListener('pause', updateMusicControl);
updateMusicControl();
playSoundtrack();
