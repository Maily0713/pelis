// ================= USUARIOS Y AUTENTICACIÓN =================
const usuarios = [
    { id: 1, usuario: 'admin', contrasena: 'admin123', nombre: 'Administrador' },
    { id: 2, usuario: 'usuario', contrasena: '1234', nombre: 'Usuario Demo' },
    { id: 3, usuario: 'demo', contrasena: 'demo', nombre: 'Demo User' }
];

let usuarioActual = null;

// ================= BASE DE DATOS DE PELÍCULAS =================
let peliculas = [
    { id: 1, titulo: 'Interestelar', año: 2014, genero: 'Ciencia Ficción', director: 'Christopher Nolan', duracion: 169, sinopsis: 'Un viaje a través de agujeros negros en busca de un nuevo hogar para la humanidad.', imagen: 'https://images.unsplash.com/photo-1533613220915-609f21a01a28?w=400&h=600&fit=crop' },
    { id: 2, titulo: 'La Shawshank Redemption', año: 1994, genero: 'Drama', director: 'Frank Darabont', duracion: 142, sinopsis: 'La historia de un prisionero condenado injustamente buscando libertad.', imagen: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=600&fit=crop' },
    { id: 3, titulo: 'Inception', año: 2010, genero: 'Ciencia Ficción', director: 'Christopher Nolan', duracion: 148, sinopsis: 'Un ladrón que roba secretos corporativos de los sueños de las personas.', imagen: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop' },
    { id: 4, titulo: 'Pulp Fiction', año: 1994, genero: 'Crimen', director: 'Quentin Tarantino', duracion: 154, sinopsis: 'Historias entrelazadas de criminales, gánsters y danzarinas en Los Ángeles.', imagen: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=400&h=600&fit=crop' },
    { id: 5, titulo: 'Forrest Gump', año: 1994, genero: 'Drama', director: 'Robert Zemeckis', duracion: 142, sinopsis: 'La vida de un hombre con discapacidad intelectual que se convierte en un ícono.', imagen: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop' }
];

let peliculaEditandoId = null;

// ================= ELEMENTOS DEL DOM =================
const loginSection = document.getElementById('loginSection');
const mainContent = document.getElementById('mainContent');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const btnAgregar = document.getElementById('btnAgregar');
const formLogin = document.getElementById('formLogin');
const formRegistro = document.getElementById('formRegistro');
const inputUser = document.getElementById('inputUser');
const inputPassword = document.getElementById('inputPassword');
const linkLogin = document.getElementById('linkLogin');
const containerPeliculas = document.getElementById('containerPeliculas');
const inputBuscar = document.getElementById('inputBuscar');
const selectGenero = document.getElementById('selectGenero');
const selectAño = document.getElementById('selectAño');
const btnResetFiltros = document.getElementById('btnResetFiltros');
const formPelicula = document.getElementById('formPelicula');
const inputTitulo = document.getElementById('inputTitulo');
const inputAño = document.getElementById('inputAño');
const inputGenero = document.getElementById('inputGenero');
const inputDirector = document.getElementById('inputDirector');
const inputDuracion = document.getElementById('inputDuracion');
const inputSinopsis = document.getElementById('inputSinopsis');
const inputImagen = document.getElementById('inputImagen');
const lblTitleModal = document.getElementById('lblTitleModal');
const modalPelicula = new bootstrap.Modal(document.getElementById('modalPelicula'));

// ================= EVENTOS DE LOGIN/REGISTRO =================
btnLogin.addEventListener('click', () => {
    loginSection.style.display = 'flex';
    mainContent.style.display = 'none';
});

btnLogout.addEventListener('click', () => {
    usuarioActual = null;
    loginSection.style.display = 'flex';
    mainContent.style.display = 'none';
    limpiarFormularios();
});

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = inputUser.value.trim();
    const pass = inputPassword.value.trim();

    const usuarioEncontrado = usuarios.find(u => u.usuario === user && u.contrasena === pass);

    if (usuarioEncontrado) {
        usuarioActual = usuarioEncontrado;
        loginSection.style.display = 'none';
        mainContent.style.display = 'block';
        btnAgregar.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        btnLogin.style.display = 'none';
        renderizarPeliculas();
        limpiarFormularios();
    } else {
        alert('❌ Usuario o contraseña incorrectos');
    }
});

formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('inputNombre').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const userReg = document.getElementById('inputUserReg').value.trim();
    const passReg = document.getElementById('inputPasswordReg').value.trim();
    const confirmPass = document.getElementById('inputConfirmPassword').value.trim();

    if (userReg.length < 4) {
        alert('❌ El usuario debe tener mínimo 4 caracteres');
        return;
    }

    if (passReg.length < 6) {
        alert('❌ La contraseña debe tener mínimo 6 caracteres');
        return;
    }

    if (passReg !== confirmPass) {
        alert('❌ Las contraseñas no coinciden');
        return;
    }

    if (usuarios.some(u => u.usuario === userReg)) {
        alert('❌ El usuario ya existe');
        return;
    }

    const nuevoUsuario = {
        id: usuarios.length + 1,
        usuario: userReg,
        contrasena: passReg,
        nombre: nombre
    };

    usuarios.push(nuevoUsuario);
    alert('✅ Cuenta registrada exitosamente. Ahora puedes hacer login.');
    document.getElementById('formRegistro').reset();
    document.getElementById('login-tab').click();
});

linkLogin.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-tab').click();
});

// ================= EVENTOS DEL CRUD =================
btnAgregar.addEventListener('click', () => {
    peliculaEditandoId = null;
    lblTitleModal.textContent = '➕ Agregar Nueva Película';
    formPelicula.reset();
    inputImagen.value = 'https://via.placeholder.com/400x600?text=Sin+Imagen';
});

formPelicula.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (peliculaEditandoId) {
        // Actualizar película existente
        const pelicula = peliculas.find(p => p.id === peliculaEditandoId);
        if (pelicula) {
            pelicula.titulo = inputTitulo.value;
            pelicula.año = parseInt(inputAño.value);
            pelicula.genero = inputGenero.value;
            pelicula.director = inputDirector.value;
            pelicula.duracion = parseInt(inputDuracion.value);
            pelicula.sinopsis = inputSinopsis.value;
            pelicula.imagen = inputImagen.value || 'https://via.placeholder.com/400x600?text=Sin+Imagen';
            alert('✅ Película actualizada correctamente');
        }
    } else {
        // Crear nueva película
        const nuevaPelicula = {
            id: Math.max(...peliculas.map(p => p.id), 0) + 1,
            titulo: inputTitulo.value,
            año: parseInt(inputAño.value),
            genero: inputGenero.value,
            director: inputDirector.value,
            duracion: parseInt(inputDuracion.value),
            sinopsis: inputSinopsis.value,
            imagen: inputImagen.value || 'https://via.placeholder.com/400x600?text=Sin+Imagen'
        };
        peliculas.push(nuevaPelicula);
        alert('✅ Película agregada correctamente');
    }

    modalPelicula.hide();
    formPelicula.reset();
    renderizarPeliculas();
});

// ================= BÚSQUEDA Y FILTROS =================
inputBuscar.addEventListener('input', () => {
    renderizarPeliculas();
});

selectGenero.addEventListener('change', () => {
    renderizarPeliculas();
});

selectAño.addEventListener('change', () => {
    renderizarPeliculas();
});

btnResetFiltros.addEventListener('click', () => {
    inputBuscar.value = '';
    selectGenero.value = '';
    selectAño.value = '';
    renderizarPeliculas();
});

// ================= FUNCIONES PRINCIPALES =================
function renderizarPeliculas() {
    const textoBusqueda = inputBuscar.value.toLowerCase();
    const generoFiltro = selectGenero.value;
    const añoFiltro = selectAño.value;

    let peliculasFiltradas = peliculas.filter(pelicula => {
        const cumpleBusqueda = pelicula.titulo.toLowerCase().includes(textoBusqueda) ||
                              pelicula.director.toLowerCase().includes(textoBusqueda) ||
                              pelicula.sinopsis.toLowerCase().includes(textoBusqueda);
        
        const cumpleGenero = generoFiltro === '' || pelicula.genero === generoFiltro;
        const cumpleAño = añoFiltro === '' || pelicula.año.toString() === añoFiltro;

        return cumpleBusqueda && cumpleGenero && cumpleAño;
    });

    containerPeliculas.innerHTML = '';

    if (peliculasFiltradas.length === 0) {
        containerPeliculas.innerHTML = '<div class="col-12 text-center mt-5"><h4 class="text-muted">📽️ No se encontraron películas</h4></div>';
        return;
    }

    peliculasFiltradas.forEach(pelicula => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'col-md-6 col-lg-4 mb-4';
        tarjeta.innerHTML = `
            <div class="card pelicula-card h-100">
                <img src="${pelicula.imagen}" class="card-img-top" alt="${pelicula.titulo}" onerror="this.src='https://via.placeholder.com/400x600?text=Sin+Imagen'">
                <div class="card-body">
                    <h5 class="card-title">${pelicula.titulo}</h5>
                    <p class="card-text">
                        <small class="text-muted">
                            📅 ${pelicula.año} | ⏱️ ${pelicula.duracion}min
                        </small>
                    </p>
                    <p class="card-text">
                        <small>
                            <span class="badge bg-primary">${pelicula.genero}</span>
                        </small>
                    </p>
                    <p class="card-text"><small><strong>Director:</strong> ${pelicula.director}</small></p>
                    <p class="card-text sinopsis">${pelicula.sinopsis}</p>
                </div>
                <div class="card-footer bg-light d-flex gap-2">
                    <button class="btn btn-sm btn-warning flex-grow-1" onclick="editarPelicula(${pelicula.id})">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger flex-grow-1" onclick="confirmarEliminar(${pelicula.id}, '${pelicula.titulo}')">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        containerPeliculas.appendChild(tarjeta);
    });
}

function editarPelicula(id) {
    peliculaEditandoId = id;
    const pelicula = peliculas.find(p => p.id === id);
    
    if (pelicula) {
        lblTitleModal.textContent = '✏️ Editar Película';
        inputTitulo.value = pelicula.titulo;
        inputAño.value = pelicula.año;
        inputGenero.value = pelicula.genero;
        inputDirector.value = pelicula.director;
        inputDuracion.value = pelicula.duracion;
        inputSinopsis.value = pelicula.sinopsis;
        inputImagen.value = pelicula.imagen;
        
        modalPelicula.show();
    }
}

function confirmarEliminar(id, titulo) {
    if (confirm(`¿Estás seguro que deseas eliminar "${titulo}"?`)) {
        eliminarPelicula(id);
    }
}

function eliminarPelicula(id) {
    peliculas = peliculas.filter(p => p.id !== id);
    alert('✅ Película eliminada correctamente');
    renderizarPeliculas();
}

function limpiarFormularios() {
    formLogin.reset();
    formRegistro.reset();
}

// ================= CARGAR GÉNEROS Y AÑOS EN SELECTORES =================
function cargarOpciones() {
    // Cargar géneros
    const generosUnicos = [...new Set(peliculas.map(p => p.genero))].sort();
    generosUnicos.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero;
        option.textContent = genero;
        selectGenero.appendChild(option);
    });

    // Cargar años
    const añosUnicos = [...new Set(peliculas.map(p => p.año))].sort((a, b) => b - a);
    añosUnicos.forEach(año => {
        const option = document.createElement('option');
        option.value = año;
        option.textContent = año;
        selectAño.appendChild(option);
    });
}

// ================= INICIALIZACIÓN =================
document.addEventListener('DOMContentLoaded', () => {
    cargarOpciones();
    loginSection.style.display = 'flex';
    mainContent.style.display = 'none';
});
