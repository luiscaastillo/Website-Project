import { leerDatos } from './firebase-crud.js';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('dynamic-routes');
    if (!container) return;

    // Detectar de qué página estamos pidiendo info basado en el nombre del archivo o ruta
    const isNatural = window.location.pathname.includes('rutas-naturales');
    const collectionName = isNatural ? 'rutas_naturales' : 'rutas_urbanas';

    const data = await leerDatos(collectionName);
    container.innerHTML = '';

    if (!data) {
        container.innerHTML = '<p>Oops! No routes available at the moment.</p>';
        return;
    }

    const routes = Array.isArray(data) ? data : Object.values(data);
    if (routes.length === 0) {
        container.innerHTML = '<p>No routes found.</p>';
        return;
    }

    const fragments = [];

    routes.forEach((route) => {
        const titulo = route.titulo || route.title || route.nombre || 'Untitled Route';
        const imagen = route.img || route.imagen || '';
        const descripcion = route.desc || route.descripcion || route.descripcionCorta || '';
        const distancia = route.distancia || '';
        const duracion = route.duracion || route.duracionVisita || '';
        const transporte = route.transporte || '';
        const dificultad = route.dificultad || '';

        const metaParts = [];
        if (distancia) metaParts.push(`Distance: ${distancia}`);
        if (duracion) metaParts.push(`Duration: ${duracion}`);
        if (transporte) metaParts.push(`Transport: ${transporte}`);
        if (dificultad) metaParts.push(`Difficulty: ${dificultad}`);

        let puntosList = [];
        if (Array.isArray(route.puntos_interes)) {
            puntosList = route.puntos_interes;
        } else if (route.puntos_interes && typeof route.puntos_interes === 'object') {
            puntosList = Object.values(route.puntos_interes);
        }

        let puntosHtml = '';
        if (puntosList.length > 0) {
            puntosHtml = '<ul class="route-stops">';
            puntosList.forEach((punto) => {
                if (typeof punto === 'object' && punto !== null) {
                    puntosHtml += `<li><strong>${punto.lugar || ''}</strong> — ${punto.detalle || ''}</li>`;
                } else {
                    puntosHtml += `<li>${punto}</li>`;
                }
            });
            puntosHtml += '</ul>';
        }

        fragments.push(`
            <div class="route-section fade-in">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
                  ${titulo}
                </h3>
                
                ${metaParts.length > 0 ? `<p>${metaParts.join(' · ')}</p>` : ''}
                
                ${imagen ? `<img src="${imagen}" alt="${titulo}" class="route-img" loading="lazy">` : ''}
                
                ${descripcion ? `<div>${descripcion}</div>` : ''}
                
                ${puntosHtml}
            </div>
        `);
    });

    container.innerHTML = fragments.join('');
});