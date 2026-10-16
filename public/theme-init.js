// Aplica el modo oscuro antes de pintar (fondo y color de la barra del navegador) para evitar destellos blancos
try {
  if (JSON.parse(localStorage.getItem('pv-dark'))) {
    document.documentElement.classList.add('dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#1E1E34');
  }
} catch { /* sin almacenamiento: modo claro */ }
