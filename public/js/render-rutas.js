import { leerDatos } from './firebase-crud.js';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('dynamic-routes');
    if (!container) return;

    // Detectar de qué página estamos pidiendo info basado en el nombre del archivo o ruta
    const isNatural = window.location.pathname.includes('rutas-naturales');
    const collectionName = isNatural ? 'rutas_naturales' : 'rutas_urbanas';

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
            // Leer los datos según la estructura de Firebase que vimos (español) 
            // o según los que crees tú desde el Admin Dashboard (inglés):
            const titulo = route.titulo || route.title || 'Untitled Route';
            const imagen = route.img || route.imagen || ''; // Si no tiene imagen, la omitimos
            const descripcion = route.desc || '';
            const distancia = route.distancia || '';
            const duracion = route.duracionVisita || '';
            const transporte = route.transporte || '';
            
            // Construir los puntos de interés como lista
            let puntosHtml = '';
            if (route.puntos_interes && Array.isArray(route.puntos_interes)) {
                puntosHtml = '<ul class="route-stops">';
                route.puntos_interes.forEach(punto => {
                    puntosHtml += `<li>${punto}</li>`;
                });
                puntosHtml += '</ul>';
            }

            const html = `
                <div class="route-section fade-in">
                    <h3>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
                      ${titulo}
                    </h3>
                    
                    ${distancia || transporte || duracion ? 
                      `<p>Distance: ${distancia} · Transport: ${transporte} · Visit duration: ${duracion}</p>` 
                      : ''}
                    
                    ${imagen ? `<img src="${imagen}" alt="${titulo}" class="route-img" loading="lazy">` : ''}
                    
                    ${descripcion ? `<div>${descripcion}</div>` : ''}
                    
                    ${puntosHtml}
                </div>
            `;
            container.innerHTML += html;
        });
    } else {
        container.innerHTML = '<p>Oops! No routes available at the moment.</p>';
    }
});