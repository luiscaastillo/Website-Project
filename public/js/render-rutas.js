import { leerDatos } from './firebase-crud.js';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('dynamic-routes');
    if (!container) return;

    // Detectar de qué página estamos pidiendo info basado en el nombre del archivo o ruta
    const isNatural = window.location.pathname.includes('rutas-naturales');
    const collectionName = isNatural ? 'rutas-naturales' : 'rutas-urbanas';

    const data = await leerDatos(collectionName);
    container.innerHTML = ''; // Limpiar mensaje de carga

    if (data) {
        // Firebase realtime DB devuelve un objeto clave-valor
        const routes = Object.values(data);
        if (routes.length === 0) {
            container.innerHTML = '<p>No routes found.</p>';
            return;
        }

        routes.forEach(route => {
            const html = `
                <div class="route-section fade-in">
                    <h3>${route.title || 'Untitled Route'}</h3>
                    ${route.img ? `<img src="${route.img}" alt="${route.title}" class="route-img" loading="lazy">` : ''}
                    <div>${route.desc || 'No description available'}</div>
                </div>
            `;
            container.innerHTML += html;
        });
    } else {
        container.innerHTML = '<p>Oops! No routes available at the moment.</p>';
    }
});