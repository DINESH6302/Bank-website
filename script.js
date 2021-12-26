"use strict";

const nav = document.querySelector(".nav");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const section1 = document.querySelector("#section--1");
const navLink = document.querySelectorAll(".nav__link");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnOpenModal = document.querySelectorAll(".btn--show-modal");
const tabButton = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabContent = document.querySelectorAll(".operations__content");
const header = document.querySelector(".header");
const allSections = document.querySelectorAll(".section");
const imgTargets = document.querySelectorAll("img[data-src]");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");

//NOTE Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

//* open model
btnOpenModal.forEach((item) => {
  item.addEventListener("click", openModal);
});

//* close model
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//NOTE Learn more Scrolling
btnScrollTo.addEventListener("click", (e) => {
  //? old way
  // const s1coords = section1.getBoundingClientRect();
  // window.scrollTo(
  //   s1coords.x + window.pageXOffset,
  //   s1coords.y + window.pageYOffset
  // );

  //? new way
  section1.scrollIntoView({behavior: "smooth"});
});

//NOTE Smooth Scrolling for NAV

// navLink.forEach((item) => {
//   item.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({behavior: "smooth"});
//   });
// });

//? Best way (Event Delegation)
// 1. Add eve listener to common parent element
// 2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // looking for only links
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({behavior: "smooth"});
  }
});

//NOTE Tabbed component
tabContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;

  // Tab active
  tabButton.forEach((tab) => tab.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  // Content active
  tabContent.forEach((content) =>
    content.classList.remove("operations__content--active")
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//NOTE Nav fade animation
const handleHover = function (e) {
  const hoverIn = e.target;
  if (e.target.classList.contains("nav__link")) {
    const siblings = hoverIn
      .closest(".nav__links")
      .querySelectorAll(".nav__link");

    siblings.forEach((lnk) => {
      if (lnk !== hoverIn) lnk.style.opacity = this;
    });
  }
};

// fade-in
nav.addEventListener("mouseover", handleHover.bind(0.5));

// fade-out
nav.addEventListener("mouseout", handleHover.bind(1));

//NOTE Sticky navbar
//? Traditional way
// window.addEventListener("scroll", () => {
//   window.pageYOffset >= 77 ? nav.classList.add("sticky") : nav.classList.remove("sticky");
// });

//? Advanced way (Intersection Observer API)
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  !entry.isIntersecting
    ? nav.classList.add("sticky")
    : nav.classList.remove("sticky");
};

const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const navObserver = new IntersectionObserver(stickyNav, options);
navObserver.observe(header);

//NOTE Reveal sections
const revealSection = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");

  sectionObserver.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//NOTE Lazy image loading
const lazyImg = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  // after fully loaded img then remove blur
  entry.target.addEventListener("load", () =>
    entry.target.classList.remove("lazy-img")
  );

  lazyLoading.unobserve(entry.target);
};

const lazyLoading = new IntersectionObserver(lazyImg, {
  root: null,
  threshold: 1,
});

imgTargets.forEach((img) => lazyLoading.observe(img));

//NOTE Slider component
let curSlide = 0;
const maxSlide = slides.length - 1;

// Starting position
const gotoSlide = function (slide = 0) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};
gotoSlide();

// Next slide
const nextSlide = function () {
  if (curSlide === maxSlide) curSlide = 0;
  else curSlide++;
  gotoSlide(curSlide);
  activeDots(curSlide);
};

// Previous slide
const prevSlide = function () {
  if (curSlide === 0) curSlide = maxSlide;
  else curSlide--;
  gotoSlide(curSlide);
  activeDots(curSlide);
};

btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

//* Keyboard events
document.addEventListener("keydown", (e) => {
  //? traditional way
  // if (e.key === "ArrowRight") nextSlide();
  // if (e.key === "ArrowLeft") prevSlide();

  //? Shot-circuiting
  e.key === "ArrowRight" && nextSlide();
  e.key === "ArrowLeft" && prevSlide();
});

//* Slide dots
const dotContainer = document.querySelector(".dots");

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide=${i}></button>`
    );
  });
};
createDots();

dotContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("dots__dot")) {
    const {slide} = e.target.dataset;
    gotoSlide(slide);
    activeDots(slide);
  }
});

// Active dot
const activeDots = function (slide = 0) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};
activeDots();
