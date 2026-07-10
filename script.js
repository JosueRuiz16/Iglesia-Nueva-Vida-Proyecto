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

    let activeIndex = 0;

    function setActive(index){
      activeIndex = index;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    // Mueve el carrusel calculando la posición exacta con scrollTo,
    // en vez de scrollIntoView (que a veces no se mueve bien cuando
    // el contenedor tiene scroll-snap, sobre todo en navegadores de PC).
    function goTo(index){
      const looped = (index + slides.length) % slides.length;
      const slide = slides[looped];
      const targetLeft = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;
      track.scrollTo({ left: targetLeft, behavior: 'smooth' });
      setActive(looped);
    }

    // Mantiene sincronizados los puntos cuando el usuario desliza con el dedo
    if ('IntersectionObserver' in window){
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting){
            activeIndex = slides.indexOf(entry.target);
            dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
          }
        });
      }, { root: track, threshold: 0.6 });
      slides.forEach((slide) => observer.observe(slide));
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goTo(index));
    });
    prevBtn?.addEventListener('click', () => goTo(activeIndex - 1));
    nextBtn?.addEventListener('click', () => goTo(activeIndex + 1));
  });
});
