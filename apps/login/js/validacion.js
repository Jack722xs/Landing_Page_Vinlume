// validaciones

function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

// Sanitización para prevenir XSS al mostrar datos en el DOM
function limpiarEntrada(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML; 
}