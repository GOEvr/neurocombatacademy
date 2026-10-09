/* NeuroCombat Academy — carrossel automático de cursos. */
(function () {
  'use strict';

  function initCarousel(carousel) {
    const viewport = carousel.querySelector('[data-nc-viewport]');
    const track = carousel.querySelector('[data-nc-track]');
    const slides = Array.from(carousel.querySelectorAll('.nc-slide'));
    const prev = carousel.querySelector('[data-nc-prev]');
    const next = carousel.querySelector('[data-nc-next]');
    const dots = carousel.querySelector('[data-nc-dots]');
    const status = carousel.querySelector('[data-nc-status]');
    if (!viewport || !track || !slides.length || !prev || !next || !dots) return;

    const intervalMs = 4500;
    let timer = null;
    let activeIndex = 0;
    let userInteracting = false;
    let interactionTimer = null;

    function visibleCount() {
      const value = parseInt(getComputedStyle(carousel).getPropertyValue('--nc-visible'), 10);
      return Number.isFinite(value) && value > 0 ? value : 1;
    }
    function pageCount() { return Math.max(1, Math.ceil(slides.length / visibleCount())); }
    function maxIndex() { return Math.max(0, slides.length - visibleCount()); }
    function slideLeft(index) {
      const target = slides[Math.max(0, Math.min(index, maxIndex()))];
      return Math.max(0, Math.min(target.offsetLeft - track.offsetLeft, viewport.scrollWidth - viewport.clientWidth));
    }
    function currentIndex() {
      let closest = 0, distance = Infinity;
      slides.forEach((slide, i) => {
        const d = Math.abs((slide.offsetLeft - track.offsetLeft) - viewport.scrollLeft);
        if (d < distance) { distance = d; closest = i; }
      });
      return Math.min(closest, maxIndex());
    }
    function drawDots() {
      dots.replaceChildren();
      for (let i = 0; i < pageCount(); i++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', 'Ir para o grupo ' + (i + 1) + ' de ' + pageCount());
        button.addEventListener('click', () => { goTo(i * visibleCount()); interact(); });
        dots.appendChild(button);
      }
    }
    function update() {
      activeIndex = currentIndex();
      prev.disabled = activeIndex <= 0;
      next.disabled = activeIndex >= maxIndex();
      const activePage = Math.min(pageCount() - 1, Math.floor(activeIndex / visibleCount()));
      Array.from(dots.children).forEach((dot, i) => {
        if (i === activePage) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      if (status) status.textContent = 'Cursos em desenvolvimento · ' + (activeIndex + 1) + ' de ' + slides.length;
    }
    function goTo(index) {
      activeIndex = Math.max(0, Math.min(index, maxIndex()));
      viewport.scrollTo({ left: slideLeft(activeIndex), behavior: 'smooth' });
      update();
    }
    function stop() { if (timer !== null) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      // Automatic movement is always enabled unless the tab is in the background.
      if (pageCount() < 2 || document.hidden) return;
      timer = window.setInterval(() => {
        if (userInteracting || document.hidden) return;
        const nextIndex = currentIndex() >= maxIndex() ? 0 : currentIndex() + 1;
        goTo(nextIndex);
      }, intervalMs);
    }
    function interact() {
      userInteracting = true;
      stop();
      if (interactionTimer !== null) clearTimeout(interactionTimer);
      interactionTimer = window.setTimeout(() => {
        userInteracting = false;
        start();
      }, 6500);
    }
    prev.addEventListener('click', () => { goTo(currentIndex() - 1); interact(); });
    next.addEventListener('click', () => { goTo(currentIndex() >= maxIndex() ? 0 : currentIndex() + 1); interact(); });
    viewport.addEventListener('scroll', update, { passive: true });
    viewport.addEventListener('pointerdown', interact, { passive: true });
    viewport.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(currentIndex() + 1); interact(); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(currentIndex() - 1); interact(); }
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
    window.addEventListener('resize', () => {
      const current = currentIndex();
      drawDots();
      goTo(Math.min(current, maxIndex()));
      start();
    }, { passive: true });
    drawDots();
    update();
    // Start only after layout has calculated card widths.
    requestAnimationFrame(() => { update(); start(); });
  }

  function boot() {
    document.querySelectorAll('[data-nc-carousel]').forEach(initCarousel);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
