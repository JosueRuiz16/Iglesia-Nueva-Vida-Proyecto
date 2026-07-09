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
