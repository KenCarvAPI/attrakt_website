export function initLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
    }, 1600);
  });
}

export function initRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

export function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function animate() {
    currentX += (targetX - currentX) * 0.03;
    currentY += (targetY - currentY) * 0.03;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 6;
      orb.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
