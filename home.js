// En tu función dentro de home.js, cambia el fetch por esto:

async function nuevoRegistro() {
    const btn = document.querySelector('.btn-nueva');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';

    const nuevoID = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Configuración del Proxy (La solución al error CORS)
    const PROXY_URL = "https://corsproxy.io/?"; 
    const URL_CON_PROXY = PROXY_URL + encodeURIComponent(CONFIG.URL_APPS_SCRIPT);

    const payload = {
        action: "crearChecklist",
        ID: nuevoID,
        USUARIO: sessionStorage.getItem("usuario"),
        SECTOR: sessionStorage.getItem("sector"),
        FECHA: new Date().toLocaleDateString(),
        ESTADO: "Pendiente"
    };

    try {
        // Hacemos el fetch al PROXY, no directo a Google
        const response = await fetch(URL_CON_PROXY, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        
        // Si todo sale bien, redirigimos
        window.location.href = `checklist.html?id=${nuevoID}`;
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión. Intenta de nuevo.");
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-plus"></i> NUEVO REGISTRO';
    }
}
