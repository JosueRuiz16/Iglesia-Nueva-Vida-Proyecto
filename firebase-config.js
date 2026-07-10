/* =========================================================================
   CONFIGURACIÓN DE FIREBASE
   Este es el ÚNICO archivo que tienes que editar para conectar el blog.
   Tanto blog.html como admin.html leen este archivo.
   =========================================================================

   Ya está completado con los datos de tu proyecto "Iglesia Nueva Vida".
   No necesitas tocar nada más aquí abajo.

   Recordatorio de lo que ya hiciste (por si vuelves a este archivo después):
   1. Proyecto creado en Firebase Console ✔
   2. App web registrada ✔ (los datos de abajo salen de ahí)
   3. Firestore Database creado, modo de prueba ✔
   4. Reglas de seguridad publicadas en la pestaña "Reglas" ✔

   Si algún día cambias de proyecto de Firebase, repite esos pasos y
   reemplaza el objeto firebaseConfig de abajo por el nuevo.

   ⚠️ Nota de seguridad honesta: las reglas que dejamos permiten que
   cualquiera que conozca tu proyecto pueda escribir directamente a la
   base de datos (no solo desde tu panel). La clave del panel (admin.html)
   es un filtro básico para gente casual, NO seguridad real. Para algo
   más serio se necesitaría Firebase Authentication (paso extra). Para
   publicaciones cortas y de bajo riesgo (devocionales) esto es razonable.

   (Recomendado, opcional) En Firestore ve a la pestaña "TTL" (Time-to-live)
   → "Crear política" → Colección = posts → Campo de fecha = expiraEn.
   Esto hace que Firestore borre solo las publicaciones viejas de la base
   de datos (el sitio ya las oculta de inmediato apenas pasan las 24h,
   esto solo es para que la base de datos no crezca sin fin).
   ========================================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyBfAfUGLeuiVO9z3i86gDb1zIKLfUuQA2w",
  authDomain: "iglesia-nueva-vida-6247c.firebaseapp.com",
  projectId: "iglesia-nueva-vida-6247c",
  storageBucket: "iglesia-nueva-vida-6247c.firebasestorage.app",
  messagingSenderId: "495232919888",
  appId: "1:495232919888:web:b7b372b2dfc6c52cc26455",
  measurementId: "G-C6G60JJ3VN"
};

// No toques nada de aquí para abajo.
const FIREBASE_NOT_CONFIGURED = (firebaseConfig.apiKey === "TU_API_KEY");

if (!FIREBASE_NOT_CONFIGURED) {
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
}
