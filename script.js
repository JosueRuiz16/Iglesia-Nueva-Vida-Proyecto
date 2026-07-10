// Menú flotante (FAB)
document.addEventListener('DOMContentLoaded', () => {
  const fabWrap = document.querySelector('.fab-wrap');
  const fabMain = document.querySelector('.fab-main');
  const overlay = document.querySelector('.fab-overlay');
  if(!fabWrap || !fabMain) return;

  function toggle(){
    const willOpen = !fabWrap.classList.contains('open');
    fabWrap.classList.toggle('open', willOpen);
    overlay?.classList.toggle('show', willOpen);
    fabMain.setAttribute('aria-expanded', String(willOpen));
  }
  function close(){
    fabWrap.classList.remove('open');
    overlay?.classList.remove('show');
    fabMain.setAttribute('aria-expanded', 'false');
  }
  fabMain.addEventListener('click', toggle);
  overlay?.addEventListener('click', close);
  document.querySelectorAll('.fab-item').forEach(item => {
    item.addEventListener('click', close);
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') close();
  });
});

// ===== Carrusel de fotos (páginas de ministerio) =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel-wrap').forEach((wrap) => {
    const track = wrap.querySelector('.carousel');
    const slides = Array.from(wrap.querySelectorAll('.carousel-slide'));
    const dots = Array.from(wrap.querySelectorAll('.carousel-dots .dot'));
    const prevBtn = wrap.querySelector('.carousel-arrow.prev');
    const nextBtn = wrap.querySelector('.carousel-arrow.next');
    if (!track || slides.length === 0) return;

    const AUTOPLAY_MS = 4000;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let autoplayTimer = null;

    function setActive(index){
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    function currentIndex(){
      const activeIdx = dots.findIndex((d) => d.classList.contains('active'));
      return activeIdx === -1 ? 0 : activeIdx;
    }

    function goTo(index){
      // bucle: si se pasa del final vuelve al inicio, y viceversa
      const looped = (index + slides.length) % slides.length;
      slides[looped].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    function startAutoplay(){
      if (prefersReducedMotion) return; // respeta accesibilidad, no forzamos movimiento
      stopAutoplay();
      autoplayTimer = setInterval(() => goTo(currentIndex() + 1), AUTOPLAY_MS);
    }
    function stopAutoplay(){
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    if ('IntersectionObserver' in window){
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(slides.indexOf(entry.target));
        });
      }, { root: track, threshold: 0.6 });
      slides.forEach((slide) => observer.observe(slide));
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => { goTo(index); startAutoplay(); });
    });
    prevBtn?.addEventListener('click', () => { goTo(currentIndex() - 1); startAutoplay(); });
    nextBtn?.addEventListener('click', () => { goTo(currentIndex() + 1); startAutoplay(); });

    // Pausa al interactuar a mano (tocar/arrastrar), y reanuda un momento después
    track.addEventListener('touchstart', stopAutoplay, { passive: true });
    track.addEventListener('mousedown', stopAutoplay);
    track.addEventListener('touchend', startAutoplay, { passive: true });
    track.addEventListener('mouseup', startAutoplay);

    startAutoplay();
  });
});