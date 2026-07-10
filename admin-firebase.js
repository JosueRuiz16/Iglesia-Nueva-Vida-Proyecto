// Panel privado para publicar en el blog.
// La "clave" de abajo es solo un filtro básico (no seguridad real, ver
// notas en firebase-config.js). Cámbiala por la que tú quieras usar.
const ADMIN_PASSWORD = "nuevavida2026";

document.addEventListener('DOMContentLoaded', () => {
  const lockScreen   = document.getElementById('admin-lock');
  const panel        = document.getElementById('admin-panel');
  const passInput    = document.getElementById('admin-pass');
  const unlockBtn     = document.getElementById('admin-unlock');
  const lockError    = document.getElementById('admin-lock-error');

  const form         = document.getElementById('post-form');
  const tituloInput  = document.getElementById('post-titulo');
  const detalleInput = document.getElementById('post-detalle');
  const formMsg      = document.getElementById('form-msg');
  const postsList    = document.getElementById('admin-posts-list');
  const setupMsg     = document.getElementById('admin-setup');

  function unlock(){
    lockScreen.style.display = 'none';
    panel.style.display = 'block';
    sessionStorage.setItem('nv_admin_unlocked', '1');
    if (typeof FIREBASE_NOT_CONFIGURED !== 'undefined' && !FIREBASE_NOT_CONFIGURED) loadPosts();
  }

  if (sessionStorage.getItem('nv_admin_unlocked') === '1') unlock();

  unlockBtn.addEventListener('click', () => {
    if (passInput.value === ADMIN_PASSWORD) {
      lockError.style.display = 'none';
      unlock();
    } else {
      lockError.style.display = 'block';
    }
  });
  passInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') unlockBtn.click(); });

  if (typeof FIREBASE_NOT_CONFIGURED === 'undefined' || FIREBASE_NOT_CONFIGURED) {
    setupMsg.style.display = 'block';
    form.style.display = 'none';
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = tituloInput.value.trim();
    const detalle = detalleInput.value.trim();
    if (!titulo || !detalle) return;

    const ahora = new Date();
    const expira = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

    formMsg.textContent = 'Publicando…';
    formMsg.style.color = 'var(--ink-soft)';

    db.collection('posts').add({
      titulo: titulo,
      detalle: detalle,
      creadoEn: firebase.firestore.Timestamp.fromDate(ahora),
      expiraEn: firebase.firestore.Timestamp.fromDate(expira)
    }).then(() => {
      formMsg.textContent = '¡Publicado! Se verá en el blog durante las próximas 24 horas.';
      formMsg.style.color = 'var(--teal)';
      form.reset();
      loadPosts();
    }).catch((err) => {
      formMsg.textContent = 'No se pudo publicar. Intenta de nuevo.';
      formMsg.style.color = 'var(--coral)';
      console.error('Error al publicar:', err);
    });
  });

  function loadPosts(){
    postsList.innerHTML = '<p class="admin-hint">Cargando…</p>';

    db.collection('posts').orderBy('creadoEn', 'desc').get().then((snapshot) => {
      postsList.innerHTML = '';
      const now = Date.now();
      let count = 0;

      snapshot.forEach((doc) => {
        const post = doc.data();
        const expiraMs = post.expiraEn ? post.expiraEn.toMillis() : null;
        const vencido = expiraMs && expiraMs < now;
        count++;

        const row = document.createElement('div');
        row.className = 'admin-post-row' + (vencido ? ' vencido' : '');
        row.innerHTML = `
          <div class="admin-post-info">
            <h4></h4>
            <p></p>
            <span class="estado"></span>
          </div>
          <button type="button" class="btn coral admin-delete">🗑️ Eliminar</button>
        `;
        row.querySelector('h4').textContent = post.titulo || 'Sin título';
        row.querySelector('p').textContent = post.detalle || '';
        row.querySelector('.estado').textContent = vencido
          ? 'Vencido · ya no se muestra en el blog'
          : 'Visible en el blog ahora mismo';

        row.querySelector('.admin-delete').addEventListener('click', () => {
          if (confirm('¿Eliminar esta publicación ahora mismo?')) {
            db.collection('posts').doc(doc.id).delete().then(loadPosts);
          }
        });

        postsList.appendChild(row);
      });

      if (count === 0) {
        postsList.innerHTML = '<p class="admin-hint">No hay publicaciones todavía. Usa el formulario de arriba.</p>';
      }
    }).catch((err) => {
      postsList.innerHTML = '<p class="admin-hint">No se pudo cargar la lista.</p>';
      console.error('Error leyendo posts:', err);
    });
  }
});
