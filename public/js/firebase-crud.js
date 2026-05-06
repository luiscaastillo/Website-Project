const DEFAULT_API_BASE = '/api/data';

function getApiBaseUrl() {
  if (window.__CB_ROUTES_API_BASE__) {
    return window.__CB_ROUTES_API_BASE__.replace(/\/$/, '');
  }

  if (window.location.origin && window.location.origin !== 'null') {
    return window.location.origin + DEFAULT_API_BASE;
  }

  return `http://localhost:3000${DEFAULT_API_BASE}`;
}

async function parseJsonResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  throw new Error(`API returned non-JSON (${response.status}). ${text}`);
}

const API_BASE_URL = getApiBaseUrl();

// ---------------------------------------------------------
// 1. CREATE (Crear o sobrescribir datos puntuales)
// ---------------------------------------------------------
export async function crearDato(rutaRama, id, datos) {
  try {
    const token = localStorage.getItem('adminToken') || '';
    const response = await fetch(`${API_BASE_URL}/${rutaRama}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(datos)
    });
    const result = await parseJsonResponse(response);
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create data.');
    }
    console.log('Crear:', result);
    return result;
  } catch (error) {
    console.error("Error al guardar:", error);
    return null;
  }
}

// ---------------------------------------------------------
// 2. READ (Leer datos)
// ---------------------------------------------------------
export async function leerDatos(rutaRama) {
  try {
    const response = await fetch(`${API_BASE_URL}/${rutaRama}`);
    const result = await parseJsonResponse(response);
    if (!response.ok || !result.success) {
      console.log(result.message || 'Failed to load data.');
      return null;
    }
    console.log('Datos recuperados:', result.data);
    return result.data;
  } catch (error) {
    console.error("Error al leer:", error);
    return null;
  }
}

// ---------------------------------------------------------
// 3. UPDATE (Actualizar ciertos campos sin pisar todo)
// ---------------------------------------------------------
export async function actualizarDato(rutaRama, id, nuevosDatos) {
  try {
    const token = localStorage.getItem('adminToken') || '';
    const response = await fetch(`${API_BASE_URL}/${rutaRama}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(nuevosDatos)
    });
    const result = await parseJsonResponse(response);
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update data.');
    }
    console.log('Actualizar:', result);
    return result;
  } catch (error) {
    console.error("Error al actualizar:", error);
    return null;
  }
}

// ---------------------------------------------------------
// 4. DELETE (Borrar un nodo/documento entero)
// ---------------------------------------------------------
export async function borrarDato(rutaRama, id) {
  try {
    const token = localStorage.getItem('adminToken') || '';
    const response = await fetch(`${API_BASE_URL}/${rutaRama}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await parseJsonResponse(response);
    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete data.');
    }
    console.log('Borrar:', result);
    return result;
  } catch (error) {
    console.error("Error al borrar:", error);
    return null;
  }
}