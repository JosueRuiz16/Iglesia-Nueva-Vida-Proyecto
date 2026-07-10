// Lee las publicaciones desde Firestore y las muestra en blog.html
// Solo se muestran las que no han pasado las 24 horas (campo expiraEn).

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('blog-posts');
  const loadingMsg = document.getElementById('blog-loading');
  const emptyMsg = document.getElementById('blog-empty');
  const setupMsg = document.getElementById('blog-setup');

  if (typeof FIREBASE_NOT_CONFIGURED === 'undefined' || FIREBASE_NOT_CONFIGURED) {
    loadingMsg.style.display = 'none';
    setupMsg.style.display = 'block';
    return;
  }

  db.collection('posts')
    .orderBy('creadoEn', 'desc')
    .get()
    .then(snapshot => {
      loadingMsg.style.display = 'none';
      const now = Date.now();
      let visibleCount = 0;

      snapshot.forEach(doc => {
        const post = doc.data();
        const expiraMs = post.expiraEn ? post.expiraEn.toMillis() : null;
        if (expiraMs && expiraMs < now) return; // ya pasaron las 24h, se omite

        visibleCount++;

        const fecha = post.creadoEn
          ? new Date(post.creadoEn.toMillis()).toLocaleString('es-NI', {
              day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
            })
          : '';

        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
          <span class="eyebrow"></span>
          <h3></h3>
          <p></p>
        `;
        card.querySelector('.eyebrow').textContent = 'Devocional · ' + fecha;
        card.querySelector('h3').textContent = post.titulo || 'Sin título';
        card.querySelector('p').textContent = post.detalle || '';
        list.appendChild(card);
      });

      if (visibleCount === 0) emptyMsg.style.display = 'block';
    })
    .catch(err => {
      loadingMsg.textContent = 'No se pudo cargar el blog. Revisa tu conexión a internet.';
      console.error('Error leyendo Firestore:', err);
    });
});
