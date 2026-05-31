// --- home.js para APP SISO (SIN PROXY) ---

// 1. CARGA INICIAL
document.addEventListener('DOMContentLoaded', () => {
    const user = sessionStorage.getItem("usuario");
    const sector = sessionStorage.getItem("sector");

    if (!user) {
        window.location.href = "index.html";
    } else {
        document.getElementById("nombre-usuario").textContent = user;
        document.getElementById("nombre-sector").textContent = sector;
        // Llamamos a la función
        cargarRegistros();
    }
});

function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

// 2. NUEVO REGISTRO (COPIANDO LÓGICA DE MANIOBRAS)
async function nuevoRegistro() {
    const btn = document.querySelector('.btn-nueva');
    if (btn.disabled) return;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';

    const nuevoID = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // CREAMOS UN OBJETO JSON (La clave del éxito)
    const datosJSON = {
        action: "crearChecklist",
        ID: nuevoID,
        USUARIO: sessionStorage.getItem("usuario"),
        SECTOR: sessionStorage.getItem("sector"),
        FECHA: new Date().toLocaleDateString(),
        ESTADO: "Pendiente"
    };

    try {
        const response = await fetch(CONFIG.URL_APPS_SCRIPT, {
            method: 'POST',
            mode: 'cors', // IGUAL QUE EN MANIOBRAS
            body: JSON.stringify(datosJSON) // Convertimos el objeto a texto
        });

        // Ahora esperamos JSON, no texto
        const res = await response.json();
        
        if (res.status === "ÉXITO") {
            window.location.href = `checklist.html?id=${nuevoID}`;
        } else {
            throw new Error(res.error || res.message);
        }
    } catch (error) {
        console.error("Error al crear:", error);
        alert("Error al crear registro: " + error.message);
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-plus"></i> NUEVO REGISTRO';
    }
}

// 3. CARGAR REGISTROS (GET)
async function cargarRegistros() {
    const tbody = document.getElementById("tabla-body");
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="5">Cargando datos...</td></tr>';

    try {
        // GET simple idéntico al de Maniobras
        const urlFinal = `${CONFIG.URL_APPS_SCRIPT}?action=obtenerRegistros`;
        
        const res = await fetch(urlFinal);
        const data = await res.json();
        
        tbody.innerHTML = "";
        
        if (data.error) throw new Error(data.error);

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
