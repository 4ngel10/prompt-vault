try { if (JSON.parse(localStorage.getItem('pv-dark'))) document.documentElement.classList.add('dark'); } catch { /* sin almacenamiento: modo claro */ }
