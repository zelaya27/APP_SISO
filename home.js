// Carga inicial
window.onload = function() {
    if (!sessionStorage.getItem("usuario")) {
        window.location.href = "index.html";
    }
    document.getElementById("nombre-usuario").innerText = sessionStorage.getItem("usuario");
    document.getElementById("nombre-sector").innerText = sessionStorage.getItem("sector");
};

// Generar ID y Crear Registro
async function nuevoRegistro() {
    const btn = document.querySelector('.btn-nueva');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';

    const nuevoID = "REG-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const payload = {
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
            body: JSON.stringify(payload)
        });
        
        window.location.href = `checklist.html?id=${nuevoID}`;
    } catch (error) {
        alert("Error al crear registro");
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-plus"></i> NUEVO REGISTRO';
    }
}

function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = "index.html";
}
