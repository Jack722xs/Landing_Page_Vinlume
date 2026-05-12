let usuariosRegistrados = [];

class Usuario {
    constructor(nombre, correo, password) {
        this.nombre = nombre;
        this.correo = correo;
        this.password = password;
    }
}

function registrarUsuario(nombre, correo, password) {
    const existe = usuariosRegistrados.find(u => u.correo === correo);
    if (existe) return { exito: false, mensaje: "Este correo ya está registrado." };
    
    usuariosRegistrados.push(new Usuario(nombre, correo, password));
    return { exito: true, mensaje: "¡Cuenta creada! Ya puedes entrar." };
}

function iniciarSesion(correo, password) {
    const u = usuariosRegistrados.find(u => u.correo === correo && u.password === password);
    if (u) return { exito: true, usuario: u };
    return { exito: false, mensaje: "Correo o clave incorrectos." };
}