// --- home.js ---

// 1. CARGA INICIAL: Lee los datos y los pone en el HTML
document.addEventListener('DOMContentLoaded', () => {
    const user = sessionStorage.getItem("usuario");
    const sector = sessionStorage.getItem("sector");

    // Seguridad básica: si no hay usuario, regresa al login
    if (!user) {
        window.location.href = "index.html";
    } else {
        // Ponemos los datos en el HTML
        document.getElementById("nombre-usuario").textContent = user;
        document.getElementById("nombre-sector").textContent = sector;
    }
});

// 2. CERRAR SESIÓN
function cerrarSesion() {
    sessionStorage.clear(); // Limpia los datos
    window.location.href = "index.html"; // Regresa al login
}

// 3. NUEVO REGISTRO
async function nuevoRegistro() {
    const btn = document.querySelector('.btn-nueva');
    if (btn.disabled) return;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';

    const nuevoID = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Parámetros simples para evitar problemas de CORS
    const params = new URLSearchParams();
    params.append("action", "crearChecklist");
    params.append("ID", nuevoID);
    params.append("USUARIO", sessionStorage.getItem("usuario"));
    params.append("SECTOR", sessionStorage.getItem("sector"));
    params.append("FECHA", new Date().toLocaleDateString());
    params.append("ESTADO", "Pendiente");

    try {
        const response = await fetch(CONFIG.URL_APPS_SCRIPT, {
            method: 'POST',
            body: params 
        });

        const resultado = await response.text();
        
        if (resultado.trim() === "ÉXITO") {
            window.location.href = `checklist.html?id=${nuevoID}`;
        } else {
            throw new Error("Respuesta servidor: " + resultado);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al crear registro. Verifica conexión.");
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-plus"></i> NUEVO REGISTRO';
    }
}

// 1. Cargamos los registros automáticamente al abrir la página
document.addEventListener('DOMContentLoaded', () => {
    // ... tu código de usuario que ya tenías ...
    
    // Llamamos a la función de carga
    cargarRegistros();
});

async function cargarRegistros() {
    const tbody = document.getElementById("tabla-body");
    tbody.innerHTML = '<tr><td colspan="5">Cargando datos...</td></tr>'; // Indicador de carga

    try {
        // Llamamos al mismo URL con el parámetro ?action=obtenerRegistros
        const res = await fetch(`${CONFIG.URL_APPS_SCRIPT}?action=obtenerRegistros`);
        const data = await res.json();
        
        tbody.innerHTML = ""; // Limpiamos el mensaje de "cargando"
        
        // Dibujamos las filas
        data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.ID || ""}</td>
                <td>${row.FECHA || ""}</td>
                <td>${row.ESTADO || ""}</td>
                <td>(Descripción aquí)</td> 
                <td><button onclick="editar('${row.ID}')">Ver</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al cargar:", error);
        tbody.innerHTML = '<tr><td colspan="5">Error al cargar registros.</td></tr>';
    }
}
