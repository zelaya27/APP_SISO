// --- home.js ---

// Definición del proxy para saltar el bloqueo CORS
const PROXY = "https://corsproxy.io/?";

// 1. CARGA INICIAL: Lee los datos y verifica sesión
document.addEventListener('DOMContentLoaded', () => {
    const user = sessionStorage.getItem("usuario");
    const sector = sessionStorage.getItem("sector");

    if (!user) {
        window.location.href = "index.html";
    } else {
        document.getElementById("nombre-usuario").textContent = user;
        document.getElementById("nombre-sector").textContent = sector;
        // Llamamos a la función de carga automáticamente
        cargarRegistros();
    }
});

// 2. CERRAR SESIÓN
function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

// 3. NUEVO REGISTRO (POST)
async function nuevoRegistro() {
    const btn = document.querySelector('.btn-nueva');
    if (btn.disabled) return;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';

    const nuevoID = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const params = new URLSearchParams();
    params.append("action", "crearChecklist");
    params.append("ID", nuevoID);
    params.append("USUARIO", sessionStorage.getItem("usuario"));
    params.append("SECTOR", sessionStorage.getItem("sector"));
    params.append("FECHA", new Date().toLocaleDateString());
    params.append("ESTADO", "Pendiente");

    try {
        // Usamos el proxy para la petición POST
        const response = await fetch(`${PROXY}${encodeURIComponent(CONFIG.URL_APPS_SCRIPT)}`, {
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

// 4. CARGAR REGISTROS (GET)
async function cargarRegistros() {
    const tbody = document.getElementById("tabla-body");
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="5">Cargando datos...</td></tr>';

    try {
        // Envolvemos la URL original en el proxy usando encodeURIComponent
        const urlFinal = `${PROXY}${encodeURIComponent(CONFIG.URL_APPS_SCRIPT + "?action=obtenerRegistros")}`;
        
        const res = await fetch(urlFinal);
        const data = await res.json();
        
        tbody.innerHTML = "";
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No hay registros aún.</td></tr>';
            return;
        }

        data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.ID || ""}</td>
                <td>${row.FECHA || ""}</td>
                <td>${row.ESTADO || ""}</td>
                <td>N/A</td> 
                <td><button onclick="editar('${row.ID}')">Ver</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al cargar:", error);
        tbody.innerHTML = '<tr><td colspan="5">Error de conexión.</td></tr>';
    }
}
