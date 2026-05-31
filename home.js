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
