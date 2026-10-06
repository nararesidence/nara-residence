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
