const API_BASE_URL = 'http://localhost:3001/api/data';

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
    const result = await response.json();
    console.log("Crear:", result);
    return result;
  } catch (error) {
    console.error("Error al guardar:", error);
  }
}

// ---------------------------------------------------------
// 2. READ (Leer datos)
// ---------------------------------------------------------
export async function leerDatos(rutaRama) {
  try {
    const response = await fetch(`${API_BASE_URL}/${rutaRama}`);
    const result = await response.json();
    if (result.success) {
      console.log("Datos recuperados:", result.data);
      return result.data;
    } else {
      console.log(result.message);
      return null;
    }
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
    const result = await response.json();
    console.log("Actualizar:", result);
    return result;
  } catch (error) {
    console.error("Error al actualizar:", error);
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
    const result = await response.json();
    console.log("Borrar:", result);
    return result;
  } catch (error) {
    console.error("Error al borrar:", error);
  }
}