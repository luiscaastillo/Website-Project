import { crearDato, borrarDato } from './firebase-crud.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
});

document.getElementById('saveBtn').addEventListener('click', async () => {
    const category = document.getElementById('routeCategory').value;
    const id = document.getElementById('routeId').value;
    const title = document.getElementById('routeTitle').value;
    const img = document.getElementById('routeImg').value;
    const desc = document.getElementById('routeDesc').value;

    if (!category || !id) return alert("Category and ID are required!");

    const payload = { title, img, desc };
    const response = await crearDato(category, id, payload);
    
    if (response && response.success) {
        alert("Route saved successfully!");
    } else {
        alert("Failed to save: " + (response ? response.message : 'Unauthorized'));
    }
});

document.getElementById('deleteBtn').addEventListener('click', async () => {
    const category = document.getElementById('routeCategory').value;
    const id = document.getElementById('routeId').value;

    if (!category || !id) return alert("Category and ID are required!");

    if (confirm("Are you sure?")) {
        const response = await borrarDato(category, id);
        if (response && response.success) {
            alert("Route deleted successfully!");
        } else {
            alert("Failed to delete: " + (response ? response.message : 'Unauthorized'));
        }
    }
});