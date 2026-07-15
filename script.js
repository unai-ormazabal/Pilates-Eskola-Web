const loader = document.querySelector('.loader');
window.addEventListener('load', () => setTimeout(() => loader.classList.add('done'), 450));

const menuButton = document.querySelector('.menu');
const navigation = document.querySelector('.header nav');
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.classList.toggle('active', open);
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -45px' });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 80}ms`;
  revealObserver.observe(element);
});

const parallaxImages = document.querySelectorAll('.hero-image img, .movement-image img, .studio-strip img');
let ticking = false;
function updateParallax() {
  parallaxImages.forEach(image => {
    const rect = image.parentElement.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const offset = (rect.top + rect.height / 2 - innerHeight / 2) * -0.025;
    image.style.transform = `scale(1.04) translateY(${offset}px)`;
  });
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

document.querySelector('#year').textContent = new Date().getFullYear();

const galleryItems = [...document.querySelectorAll('[data-gallery]')];
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('.lightbox-stage img');
const lightboxCount = lightbox.querySelector('.lightbox-count');
const closeLightboxButton = lightbox.querySelector('.lightbox-close');
let currentImage = 0;

function showGalleryImage(index) {
  currentImage = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentImage];
  lightboxImage.classList.add('changing');
  setTimeout(() => {
    lightboxImage.src = item.dataset.gallery;
    lightboxImage.alt = item.dataset.alt;
    lightboxCount.textContent = `${currentImage + 1} / ${galleryItems.length}`;
    lightboxImage.classList.remove('changing');
  }, 140);
}

function openLightbox(index) {
  showGalleryImage(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  closeLightboxButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  galleryItems[currentImage].focus();
}

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
  item.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(index);
    }
  });
});
closeLightboxButton.addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showGalleryImage(currentImage - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showGalleryImage(currentImage + 1));
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showGalleryImage(currentImage - 1);
  if (event.key === 'ArrowRight') showGalleryImage(currentImage + 1);
});

const seasonButtons = [...document.querySelectorAll('[data-season]')];
const seasonPanels = [...document.querySelectorAll('[data-panel]')];
function selectSeason(season) {
  seasonButtons.forEach(button => button.setAttribute('aria-selected', String(button.dataset.season === season)));
  seasonPanels.forEach(panel => {
    const selected = panel.dataset.panel === season;
    panel.hidden = !selected;
    panel.classList.toggle('active', selected);
  });
}
seasonButtons.forEach(button => button.addEventListener('click', () => selectSeason(button.dataset.season)));
const today = new Date();
const monthDay = (today.getMonth() + 1) * 100 + today.getDate();
const isSummerSchedule = (monthDay >= 623 && monthDay <= 730) || (monthDay >= 901 && monthDay <= 917);
selectSeason(isSummerSchedule ? 'summer' : 'winter');
