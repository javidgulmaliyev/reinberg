import Swiper from "swiper";
import { Autoplay, EffectFade, Keyboard, Navigation, } from "swiper/modules";

const heroSlider = document.querySelector(".hero-slider");

if (heroSlider) {
  const swiper = new Swiper(heroSlider, {
    modules: [Autoplay, EffectFade, Keyboard, Navigation,],
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    fadeEffect: {
      crossFade: true,
    },
    keyboard: {
      enabled: true,
      pageUpDown: false,
    },
    navigation: {
      enabled: true,
      nextEl: ".hero-arrows__button--next",
      prevEl: ".hero-arrows__button--prev",
    },
    effect: "fade",
    rewind: true,
  });
}
