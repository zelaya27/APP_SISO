async function nuevoRegistro() {
    const btn = document.querySelector('.btn-nueva');
    if (btn.disabled) return;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';

    const nuevoID = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // CREAMOS PARÁMETROS EN LUGAR DE JSON
    const params = new URLSearchParams();
    params.append("action", "crearChecklist");
    params.append("ID", nuevoID);
    params.append("USUARIO", sessionStorage.getItem("usuario") || "Anónimo");
    params.append("SECTOR", sessionStorage.getItem("sector") || "General");
    params.append("FECHA", new Date().toLocaleDateString());
    params.append("ESTADO", "Pendiente");

    try {
        // Fetch sin headers (el navegador pone los necesarios para URLSearchParams)
        const response = await fetch(CONFIG.URL_APPS_SCRIPT, {
            method: 'POST',
            body: params 
        });

        if (!response.ok) throw new Error('Error en la conexión');

        // La respuesta ya no es JSON, ahora es texto plano ("ÉXITO")
        const resultado = await response.text(); 
        
        if (resultado.trim() === "ÉXITO") {
            window.location.href = `checklist.html?id=${nuevoID}`;
        } else {
            throw new Error("Respuesta del servidor: " + resultado);
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al crear el registro. Verifica tu conexión.");
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-plus"></i> NUEVO REGISTRO';
    }
}
