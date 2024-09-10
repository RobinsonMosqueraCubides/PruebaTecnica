const API_URL = 'http://127.0.0.1:8000/api/proveedores/';
const LOGIN_URL = 'http://127.0.0.1:8000/api/token/';
const REFRESH_URL = 'http://127.0.0.1:8000/api/token/refresh/';

// Función para deshabilitar la página hasta que se obtenga el token
function bloquearPagina() {
    document.body.style.pointerEvents = 'none';  // Deshabilitar todos los clics y acciones
}

// Función para habilitar la página después de obtener el token
function habilitarPagina() {
    document.body.style.pointerEvents = 'auto';  // Habilitar todas las acciones
}

// Función para iniciar sesión y obtener el token JWT
function iniciarSesion(username, password) {
    bloquearPagina();  // Deshabilitar la página hasta que se obtenga el token
    fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access) {
            localStorage.setItem('token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            console.log('Token JWT almacenado:', data.access);
            habilitarPagina();  // Habilitar la página tras obtener el token
            obtenerProveedores();  // Actualizar la lista de proveedores
        } else {
            console.error('Error en las credenciales');
            habilitarPagina();  // Volver a habilitar la página si hubo error
        }
    })
    .catch(error => {
        console.error('Error al iniciar sesión:', error);
        habilitarPagina();  // Volver a habilitar la página si hubo error
    });
}

// Función para manejar el clic en el botón de inicio de sesión
document.getElementById('login').addEventListener('click', function(event) {
    event.preventDefault();  // Prevenir el comportamiento predeterminado del botón
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificar que los campos de usuario y contraseña no estén vacíos
    if (!username || !password) {
        console.error('Usuario o contraseña no pueden estar vacíos');
        return;
    }

    iniciarSesion(username, password);
});

// Función para obtener la lista de proveedores
function obtenerProveedores() {
    const token = localStorage.getItem('token');
    if (!token) {
        document.getElementById('login-status').textContent = 'Inicia sesión para ver los proveedores';
        return;
    }

    if (tokenHaExpirado(token)) {
        refrescarToken().then(nuevoToken => {
            if (nuevoToken) {
                localStorage.setItem('token', nuevoToken);
                realizarSolicitudProveedores(nuevoToken);
            }
        });
    } else {
        realizarSolicitudProveedores(token);
    }
}

// Función para realizar la solicitud GET a proveedores
function realizarSolicitudProveedores(token) {
    fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const proveedoresList = document.getElementById('proveedores-list');
        proveedoresList.innerHTML = '';
        if (Array.isArray(data)) {
            data.forEach(proveedor => {
                const li = document.createElement('li');
                li.textContent = `${proveedor.nombre} ${proveedor.apellido} (NIT: ${proveedor.NIT})`;
                proveedoresList.appendChild(li);
            });
        } else {
            console.error('La respuesta no es una lista de proveedores');
        }
    })
    .catch(error => console.error('Error al obtener los proveedores:', error));
}

// Función para refrescar el token JWT
function refrescarToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    return fetch(REFRESH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: refreshToken })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access) {
            return data.access;  // Retornar el nuevo token de acceso
        } else {
            console.error('Error al refrescar el token');
            return null;
        }
    })
    .catch(error => {
        console.error('Error al refrescar el token:', error);
        return null;
    });
}

// Función para verificar si el token ha expirado
function tokenHaExpirado(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));  // Decodificar el payload del token JWT
    const expiracion = payload.exp * 1000;  // Convertir la expiración a milisegundos
    const ahora = Date.now();
    return ahora > expiracion;
}

// Función para agregar un proveedor al hacer clic en el botón "Agregar Proveedor"
document.getElementById('add').addEventListener('click', function(event) {
    event.preventDefault();  // Evitar el comportamiento predeterminado del botón de enviar

    // Obtener los valores del formulario
    const NIT = document.getElementById('NIT').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const cedula = document.getElementById('cedula').value;
    const tipo_proveedor = document.getElementById('tipo_proveedor').value;
    const tipo_persona = document.getElementById('tipo_persona').value;
    
    // Recoger los beneficiarios
    const nombreBene = document.getElementById('nombreBene').value;
    const ccBene = document.getElementById('ccBene').value;
    const beneficiarios = [
        {
            "nombre": nombreBene,
            "cedula": ccBene
        }
    ];
    
    // Datos bancarios
    const banco = document.getElementById('banco').value;
    const numero_cuenta = document.getElementById('numero_cuenta').value;
    const tipo_cuenta = document.getElementById('tipo_cuenta').value;

    const datos_bancarios = {
        banco: banco,
        numero_cuenta: numero_cuenta,
        tipo_cuenta: tipo_cuenta
    };

    // Validar que todos los campos estén completos
    if (!NIT || !nombre || !apellido || !cedula || !tipo_proveedor || !tipo_persona || beneficiarios.length === 0 || !banco || !numero_cuenta || !tipo_cuenta) {
        console.error('Por favor completa todos los campos.');
        return;
    }

    // Estructurar el objeto para el proveedor
    const proveedor = {
        NIT: NIT,
        nombre: nombre,
        apellido: apellido,
        cedula: cedula,
        tipo_proveedor: tipo_proveedor,
        tipo_persona: tipo_persona,
        beneficiarios: beneficiarios,
        datos_bancarios: datos_bancarios,
        estado: 'Pendiente de Validación'  // Estado inicial por defecto
    };

    // Llamar a la función para agregar el proveedor enviando los datos formateados
    agregarProveedor(proveedor);
});

// Función para agregar un proveedor (envía los datos al servidor)
function agregarProveedor(proveedor) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se encontró el token JWT. Inicia sesión.');
        return;
    }

    // Enviar la solicitud POST al servidor con los datos del proveedor
    fetch('http://127.0.0.1:8000/api/proveedores/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(proveedor)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error('Error en la solicitud POST:', errorData);
                throw new Error('Error en la solicitud POST');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Proveedor agregado:', data);
        // Aquí podrías mostrar un mensaje de éxito o actualizar la lista de proveedores
    })
    .catch(error => console.error('Error al agregar el proveedor:', error));
}

// Función para eliminar un proveedor al hacer clic en el botón "Eliminar Proveedor"
document.getElementById('delete').addEventListener('click', function(event) {
    event.preventDefault();

    const NIT = document.getElementById('NIT').value;
    if (!NIT) {
        console.error('Por favor ingresa un NIT para eliminar un proveedor.');
        return;
    }
    
    obtenerIdPorNit(NIT,"eliminar");
});
document.getElementById('search').addEventListener('click', function(event) {
    event.preventDefault();
    const NIT = document.getElementById('NIT').value;
    if (!NIT) {
        console.error('Por favor ingresa un NIT para buscar un proveedor.');
        return;
    }
    
    obtenerIdPorNit(NIT,"buscar");
});
document.getElementById('update').addEventListener('click', function(event) {
    event.preventDefault();
    const NIT = document.getElementById('NIT').value;
    if (!NIT) {
        console.error('Por favor ingresa un NIT para actualizar un proveedor.');
        return;
    }
    
    obtenerIdPorNit(NIT,"actualizar");
});
function obtenerIdPorNit(NIT, tipo) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se encontró el token JWT. Inicia sesión.');
        return;
    }

    // Realizar una solicitud GET para obtener todos los proveedores
    fetch('http://127.0.0.1:8000/api/proveedores/', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            if (element.NIT === NIT && tipo == "eliminar") {
                eliminarProveedor(element.id);
            }else if (element.NIT === NIT && tipo == "buscar") {
                obtenerDatosProveedor(element.id);
            }else if (element.NIT === NIT && tipo == "actualizar") {
                actualizarProveedor(element.id)
            }
            else{
                console.log("no encontrado");                
            }                               
        });        
    })
    .catch(error => console.error('Error al obtener los proveedores:', error));
}
function obtenerDatosProveedor(NIT) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se encontró el token JWT. Inicia sesión.');
        return;
    }

    // Realizar una solicitud GET para obtener los datos del proveedor
    fetch(`http://127.0.0.1:8000/api/proveedores/${NIT}/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud GET');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos del proveedor:', data);

        // Llenar los campos del formulario con los datos del proveedor
        document.getElementById('NIT').value = data.NIT;
        document.getElementById('nombre').value = data.nombre;
        document.getElementById('apellido').value = data.apellido;
        document.getElementById('cedula').value = data.cedula;
        document.getElementById('tipo_proveedor').value = data.tipo_proveedor;
        document.getElementById('tipo_persona').value = data.tipo_persona;

        // Beneficiarios: convertir el array en un formato adecuado para el campo de texto
        if (data.beneficiarios && data.beneficiarios.length > 0) {
            document.getElementById('nombreBene').value = data.beneficiarios[0].nombre || '';
            document.getElementById('ccBene').value = data.beneficiarios[0].cedula || '';
        }

        // Datos bancarios
        if (data.datos_bancarios) {
            document.getElementById('banco').value = data.datos_bancarios.banco;
            document.getElementById('numero_cuenta').value = data.datos_bancarios.numero_cuenta;
            document.getElementById('tipo_cuenta').value = data.datos_bancarios.tipo_cuenta;
        }
    })
    .catch(error => console.error('Error al obtener los datos del proveedor:', error));
}
// Función para enviar la solicitud DELETE al servidor para eliminar el proveedor
function eliminarProveedor(NIT) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se encontró el token JWT. Inicia sesión.');
        return;
    }

    // Enviar la solicitud DELETE al servidor utilizando el NIT como identificador
    fetch(`http://127.0.0.1:8000/api/proveedores/${NIT}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log(`Proveedor con NIT ${NIT} eliminado exitosamente.`);
            // Aquí podrías actualizar la lista de proveedores o mostrar un mensaje de éxito
        } else {
            return response.json().then(errorData => {
                console.error('Error en la solicitud DELETE:', errorData);
            });
        }
    })
    .catch(error => console.error('Error al eliminar el proveedor:', error));
}
// Función para actualizar los datos de un proveedor

function actualizarProveedor(NIT) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se encontró el token JWT. Inicia sesión.');
        return;
    }

    // Recoger los datos de los inputs
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const cedula = document.getElementById('cedula').value;
    const tipo_proveedor = document.getElementById('tipo_proveedor').value;
    const tipo_persona = document.getElementById('tipo_persona').value;
    const nombreBene = document.getElementById('nombreBene').value;
    const ccBene = document.getElementById('ccBene').value;
    const banco = document.getElementById('banco').value;
    const numero_cuenta = document.getElementById('numero_cuenta').value;
    const tipo_cuenta = document.getElementById('tipo_cuenta').value;

    // Asegurarse de que el NIT sea un string
    const nitStr = String(NIT).trim();  // Convertir NIT a string y eliminar posibles espacios

    // Crear el objeto con los datos actualizados
    const datosActualizados = {
        NIT: nitStr,  // Convertido a string
        nombre: nombre,
        apellido: apellido,
        cedula: cedula,
        tipo_proveedor: tipo_proveedor,
        tipo_persona: tipo_persona,
        beneficiarios: [
            {
                nombre: nombreBene,
                cedula: ccBene
            }
        ],
        datos_bancarios: {
            banco: banco,
            numero_cuenta: numero_cuenta,
            tipo_cuenta: tipo_cuenta
        }
    };

    // Realizar la solicitud PUT para actualizar los datos
    fetch(`http://127.0.0.1:8000/api/proveedores/${nitStr}/`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error('Error en la solicitud PUT:', errorData);
                throw new Error('Error en la solicitud PUT');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Proveedor actualizado:', data);
        alert('Proveedor actualizado exitosamente.');
    })
    .catch(error => console.error('Error al actualizar el proveedor:', error));
}

