let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY) {
    // Scrolling down
    header.classList.remove('scroll-up');
    header.classList.add('scroll-down');
  } else {
    // Scrolling up
    header.classList.remove('scroll-down');
    header.classList.add('scroll-up');
  }
  lastScrollY = window.scrollY;
});
const container = document.querySelector('.container');

window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY) {
    // Scrolling down
    container.classList.remove('scroll-up');
    container.classList.add('scroll-down');
  } else {
    // Scrolling up
    container.classList.remove('scroll-down');
    container.classList.add('scroll-up');
  }
  lastScrollY = window.scrollY;
});
