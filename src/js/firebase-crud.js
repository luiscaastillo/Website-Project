import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, get, child, update, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Sustituye "TU_API_KEY", "TU_SENDER_ID" y "TU_APP_ID" con los valores de tu consola en Firebase (Project Settings).
const firebaseConfig = {
  apiKey: "0ta92JF6DEv4I-9bbOOpo4nqpE5w8WvgEKqITnqGPt4",
  authDomain: "cb-routes.firebaseapp.com",
  databaseURL: "https://cb-routes-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "cb-routes",
  storageBucket: "cb-routes.appspot.com",
  messagingSenderId: "294196440876",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ---------------------------------------------------------
// 1. CREATE (Crear o sobrescribir datos puntuales)
// ---------------------------------------------------------
export function crearDato(rutaRama, id, datos) {
  // ejemplo: rutaRama="rutas", id="ruta_01"
  set(ref(db, `${rutaRama}/${id}`), datos)
    .then(() => {
      console.log("Datos guardados exitosamente.");
    })
    .catch((error) => {
      console.error("Error al guardar:", error);
    });
}

// ---------------------------------------------------------
// 2. READ (Leer datos)
// ---------------------------------------------------------
export function leerDatos(rutaRama) {
  const dbRef = ref(db);
  get(child(dbRef, rutaRama)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log("Datos recuperados:", snapshot.val());
      return snapshot.val();
    } else {
      console.log("No hay datos disponibles en esa ruta");
      return null;
    }
  }).catch((error) => {
    console.error("Error al leer:", error);
  });
}

// ---------------------------------------------------------
// 3. UPDATE (Actualizar ciertos campos sin pisar todo)
// ---------------------------------------------------------
export function actualizarDato(rutaRama, id, nuevosDatos) {
  const actualizaciones = {};
  actualizaciones[`${rutaRama}/${id}`] = nuevosDatos;

  update(ref(db), actualizaciones)
    .then(() => {
      console.log("Datos actualizados exitosamente.");
    })
    .catch((error) => {
      console.error("Error al actualizar:", error);
    });
}

// ---------------------------------------------------------
// 4. DELETE (Borrar un nodo/documento entero)
// ---------------------------------------------------------
export function borrarDato(rutaRama, id) {
  remove(ref(db, `${rutaRama}/${id}`))
    .then(() => {
      console.log("Datos borrados exitosamente.");
    })
    .catch((error) => {
      console.error("Error al borrar:", error);
    });
}

// Ejemplos de uso que puedes llamar en tu app:

const rutaDefault = {
  titulo: "Route 1: The Grandeur of the Square",
  duracion: "2 hours",
  dificultad: "Easy",
  distancia: "2.5 km",
  descripcionCorta: "Panoramic view of Přemysl Otakar II Square",
  puntos_interes: [
    {
      lugar: "Přemysl Otakar II Square",
      detalle: "Start your tour in this impressive square, one of the largest in Europe (133 × 133 meters). Admire the Baroque and Renaissance buildings surrounding it."
    },
    {
      lugar: "Samson Fountain (Samsonova kašna)",
      detalle: "In the center of the square, this 18th-century Baroque fountain is one of the most photographed symbols of the city."
    },
    {
      lugar: "Town Hall (Radnice)",
      detalle: "The majestic Baroque Town Hall building, with its decorated facade and three towers, dominates one side of the square."
    },
    {
      lugar: "St. Nicholas Cathedral (Katedrála sv. Mikuláše)",
      detalle: "A few steps from the square, this imposing Baroque cathedral houses valuable frescoes and an impressive organ."
    },
    {
      lugar: "Black Tower (Černá věž)",
      detalle: "Climb the 225 steps of this 16th-century hola for unmatched panoramic views of the city."
    }
  ]
};

console.log("Subiendo datos default a Firebase...");
crearDato("rutas_urbanas", "route_1", rutaDefault);
