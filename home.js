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
        // Llamamos a la función principal
        cargarRegistros();
    }

    // --- ESTÉTICA: LÓGICA PARA ILUMINAR BOTONES DE FILTRO ---
    const botonesFiltro = document.querySelectorAll('.btn-filtro');
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', function() {
            // 1. Quitar la clase 'activo' a todos los botones
            botonesFiltro.forEach(btn => btn.classList.remove('activo'));
            
            // 2. Agregar la clase 'activo' solo al botón clickeado
            this.classList.add('activo');
            
            // Aquí puedes llamar a tu función filtrar() si ya la tienes
            // let criterio = this.innerText.trim();
            // filtrar(criterio);
        });
    });
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
    // NOTA: Asegúrate de que en tu home.html ya reemplazaste el <table> por el <div id="contenedor-registros">
    const contenedor = document.getElementById("contenedor-registros");
    if (!contenedor) return;
    
    // Estado de carga adaptado al nuevo diseño
    contenedor.innerHTML = '<div style="text-align:center; grid-column: 1 / -1; padding: 20px;"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Cargando datos...</p></div>';

    try {
        // GET simple idéntico al de Maniobras
        const urlFinal = `${CONFIG.URL_APPS_SCRIPT}?action=obtenerRegistros`;
        
        const res = await fetch(urlFinal);
        const data = await res.json();
        
        contenedor.innerHTML = "";
        
        if (data.error) throw new Error(data.error);

        if (data.length === 0) {
            contenedor.innerHTML = '<div style="text-align:center; grid-column: 1 / -1; color: var(--muted-text);">No hay registros aún.</div>';
            return;
        }

        data.forEach(row => {
            // --- TU CORRECCIÓN DE FORMATO DE FECHA (CONSERVADA INTACTA) ---
            let fechaOriginal = row.FECHA;
            let fechaFormateada = "";
            
            if (fechaOriginal) {
                let d = new Date(fechaOriginal);
                // Validamos que sea una fecha correcta antes de operar
                if (!isNaN(d.getTime())) {
                    // Usamos getUTC para evitar saltos de zona horaria
                    let dia = String(d.getUTCDate()).padStart(2, '0');
                    let mes = String(d.getUTCMonth() + 1).padStart(2, '0');
                    let anio = d.getUTCFullYear();
                    
                    fechaFormateada = `${dia}/${mes}/${anio}`; 
                } else {
                    fechaFormateada = fechaOriginal; // Si viene texto normal, se deja igual
                }
            } else {
                fechaFormateada = "Sin fecha";
            }

            // Normalizar el estado para los colores (ej: "pendiente", "aprobado")
            const estadoClase = (row.ESTADO || 'pendiente').toLowerCase().trim();

            // --- CREACIÓN DE LA TARJETA MÓVIL EN LUGAR DE LA FILA (TR) ---
            const card = document.createElement("div");
            card.className = "registro-card";
            card.innerHTML = `
                <div class="registro-header">
                    <span class="registro-id"><i class="fas fa-hashtag"></i> ${row.ID || ""}</span>
                    <span class="badge badge-${estadoClase}">${row.ESTADO || "Sin estado"}</span>
                </div>
                <div class="registro-body">
                    <p><i class="far fa-calendar-alt"></i> ${fechaFormateada}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${row.SECTOR || "N/A"}</p>
                    <p><i class="fas fa-user-hard-hat"></i> ${row.USUARIO || "N/A"}</p>
                </div>
                <div class="registro-footer">
                    <button class="btn-editar" onclick="editar('${row.ID}')">
                        <i class="fas fa-pen"></i> Editar
                    </button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar:", error);
        contenedor.innerHTML = '<div style="text-align:center; grid-column: 1 / -1; color: #e74c3c;">Error de conexión.</div>';
    }
}

// --- FUNCIÓN EDITAR ---
// Agrega esto justo debajo de cargarRegistros() para que el botón funcione
function editar(idRegistro) {
    // No abre archivos, simplemente redirige a la pantalla de checklist enviando el ID para consultarlo/editarlo
    window.location.href = `checklist.html?id=${idRegistro}&modo=editar`;
}
