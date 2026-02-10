import './css/main.css';
import { initNavigation } from './js/navigation.js';
import { initLoader, initRevealAnimations, initParallaxOrbs } from './js/animations.js';
import { initContactForm } from './js/form.js';

initLoader();

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRevealAnimations();
  initParallaxOrbs();
  initContactForm();
});
