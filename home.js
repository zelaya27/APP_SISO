async function nuevoRegistro() {
    const btn = document.querySelector('.btn-nueva');
    
    // Validar estado de carga
    if (btn.disabled) return; 
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';

    const nuevoID = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const payload = {
        action: "crearChecklist",
        ID: nuevoID,
        USUARIO: sessionStorage.getItem("usuario"),
        SECTOR: sessionStorage.getItem("sector"),
        FECHA: new Date().toLocaleDateString(),
        ESTADO: "Pendiente"
    };

    try {
        // Conexión directa a tu Apps Script (sin proxy)
        const response = await fetch(CONFIG.URL_APPS_SCRIPT, {
            method: 'POST',
            mode: 'cors', // Importante para CORS
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        
        if (data.status === "ÉXITO") {
            window.location.href = `checklist.html?id=${nuevoID}`;
        } else {
            throw new Error(data.message || "Error al crear el registro");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al crear el registro. Por favor, verifica tu conexión.");
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-plus"></i> NUEVO REGISTRO';
    }
}
