document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS MENÚ Y VISTAS ---
    const navInicio = document.getElementById('nav-inicio');
    const navContacto = document.getElementById('nav-contacto');
    
    const btnLoginMenu = document.getElementById('btn-login-menu');
    const btnLogout = document.getElementById('btn-logout');
    let sesionIniciada = false; 
    
    const vistas = {
        inicio: document.getElementById('vista-carrusel'),
        auth: document.getElementById('vista-auth'),
        contacto: document.getElementById('vista-contacto')
    };

    const paneles = {
        login: document.getElementById('caja-login'),
        registro: document.getElementById('caja-registro')
    };

    // --- NAVEGACIÓN ---
    function cambiarVista(nombre) {
        Object.values(vistas).forEach(v => v.classList.add('vista-oculta'));
        vistas[nombre].classList.remove('vista-oculta');
    }

    navInicio.onclick = () => cambiarVista('inicio');
    navContacto.onclick = () => cambiarVista('contacto');
    
    btnLoginMenu.onclick = (e) => {
        e.preventDefault();
        if (!sesionIniciada) {
            cambiarVista('auth');
        }
    };

    // --- LÓGICA DE CERRAR SESIÓN ---
    btnLogout.onclick = (e) => {
        e.preventDefault();
        sesionIniciada = false;
        
        // Restaurar menú a su estado original
        btnLoginMenu.textContent = "Acceso / Registro";
        btnLoginMenu.classList.remove('btn');
        btnLoginMenu.classList.add('outline-btn');
        btnLogout.style.display = 'none'; 
        
        cambiarVista('inicio');
    };

    // --- SWITCH LOGIN/REGISTRO ---
    document.getElementById('ir-registro').onclick = (e) => {
        e.preventDefault();
        paneles.login.style.display = 'none';
        paneles.registro.style.display = 'block';
    };

    document.getElementById('ir-login').onclick = (e) => {
        e.preventDefault();
        paneles.registro.style.display = 'none';
        paneles.login.style.display = 'block';
    };

    function feedback(idElemento, texto, tipo) {
        const el = document.getElementById(idElemento);
        el.textContent = texto;
        el.className = `mensaje-feedback mensaje-${tipo}`;
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 4000);
    }

    // --- PROCESAR REGISTRO ---
    document.getElementById('form-registro').onsubmit = (e) => {
        e.preventDefault();
        
        const correo = document.getElementById('reg-correo').value;
        if(!validarCorreo(correo)) {
            feedback('feedback-registro', "Formato de correo inválido.", 'error');
            return;
        }

        const res = registrarUsuario(
            limpiarEntrada(document.getElementById('reg-nombre').value),
            correo,
            document.getElementById('reg-pass').value
        );
        feedback('feedback-registro', res.mensaje, res.exito ? 'exito' : 'error');
        if(res.exito) {
            e.target.reset();
            setTimeout(() => document.getElementById('ir-login').click(), 1500);
        }
    };

    // --- PROCESAR LOGIN ---
    document.getElementById('form-login').onsubmit = (e) => {
        e.preventDefault();
        const res = iniciarSesion(
            document.getElementById('log-correo').value,
            document.getElementById('log-pass').value
        );
        
        if(res.exito) {
            sesionIniciada = true; 
            feedback('feedback-login', "¡Acceso concedido!", 'exito');
            
            btnLoginMenu.textContent = `Bienvenida ${res.usuario.nombre}`;
            btnLoginMenu.classList.remove('outline-btn');
            btnLoginMenu.classList.add('btn');
            
            btnLogout.style.display = 'inline-block';
            
            e.target.reset();
            setTimeout(() => cambiarVista('inicio'), 1500);
        } else {
            feedback('feedback-login', res.mensaje, 'error');
        }
    };

    // --- PROCESAR CONTACTO ---
    document.getElementById('form-contacto').onsubmit = (e) => {
        e.preventDefault();
        feedback('feedback-contacto', "¡Mensaje enviado a Vinlume con éxito!", 'exito');
        e.target.reset();
    };

    // --- LÓGICA CARRUSEL AUTOMÁTICO ---
    const imagenes = [
        "../login/imagenes/imagen1.jpg",
        "../login/imagenes/imagen2.webp",
        "../login/imagenes/imagen3.jpg",
        "../login/imagenes/imagen4.jpg",
    ];
    
    let index = 0;
    const imgEl = document.getElementById('img-carrusel');
    let intervaloCarrusel;

    function cambiarImagen(direccion) {
        // Suave transición
        imgEl.style.opacity = 0;
        
        setTimeout(() => {
            if (direccion === 'sig') {
                index = (index + 1) % imagenes.length;
            } else {
                index = (index - 1 + imagenes.length) % imagenes.length;
            }
            imgEl.src = imagenes[index];
            imgEl.style.opacity = 0.8; // Coincide con la opacidad en el CSS
        }, 250); 
    }

    function iniciarCarrusel() {
        intervaloCarrusel = setInterval(() => {
            cambiarImagen('sig');
        }, 3000); 
    }

    function reiniciarIntervalo() {
        clearInterval(intervaloCarrusel);
        iniciarCarrusel(); 
    }

    document.getElementById('btn-sig').onclick = () => {
        cambiarImagen('sig');
        reiniciarIntervalo();
    };

    document.getElementById('btn-ant').onclick = () => {
        cambiarImagen('ant');
        reiniciarIntervalo();
    };

    iniciarCarrusel();
});