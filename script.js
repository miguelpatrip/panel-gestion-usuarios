// =============================================
// EVA 2 - Panel de Gestión de Usuarios
// VERSIÓN MEJORADA POR IA
// FECHA DE ACTUALIZACIÓN: 2026
// =============================================

// DATOS INICIALES
const USUARIOS_INICIALES = [
  { id: Date.now() + 1, nombre: "Juan Pérez", edad: 30, rol: "Administrador", activo: true, fechaRegistro: new Date().toISOString() },
  { id: Date.now() + 2, nombre: "Ana Gómez", edad: 25, rol: "Usuario", activo: true, fechaRegistro: new Date().toISOString() },
  { id: Date.now() + 3, nombre: "Carlos Ruiz", edad: 40, rol: "Administrador", activo: false, fechaRegistro: new Date().toISOString() }
];

let usuarios = JSON.parse(JSON.stringify(USUARIOS_INICIALES)); // Deep clone para evitar mutaciones accidentales
let ordenAscendente = true;
let ultimoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) : 0;

// REFERENCIAS A ELEMENTOS DEL HTML
const formularioUsuario = document.getElementById("formularioUsuario");
const filtroRol = document.getElementById("filtroRol");
const btnOrdenar = document.getElementById("btnOrdenar");
const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");
const listaUsuarios = document.getElementById("listaUsuarios");
const mensajeVacio = document.getElementById("mensajeVacio");
const totalUsuarios = document.getElementById("totalUsuarios");
const usuariosActivos = document.getElementById("usuariosActivos");
const usuariosInactivos = document.getElementById("usuariosInactivos");
const inputNombre = document.getElementById("inputNombre");
const inputEdad = document.getElementById("inputEdad");
const inputRol = document.getElementById("inputRol");
const errorNombre = document.getElementById("errorNombre");
const errorEdad = document.getElementById("errorEdad");
const errorRol = document.getElementById("errorRol");
const buscador = document.getElementById("buscador");
const btnExportar = document.getElementById("btnExportar");

// =============================================
// VALIDAR FORMULARIO (MEJORADO)
// =============================================
function validarFormulario() {
  let esValido = true;

  // Limpiar mensajes de error previos
  errorNombre.textContent = "";
  errorEdad.textContent = "";
  errorRol.textContent = "";

  // Obtener valores del formulario
  const nombre = inputNombre.value.trim();
  const edad = inputEdad.value.trim();
  const rol = inputRol.value;

  // Validar nombre (mejorado)
  if (nombre === "") {
    errorNombre.textContent = "El nombre no puede estar vacío.";
    esValido = false;
  } else if (nombre.length < 3) {
    errorNombre.textContent = "El nombre debe tener al menos 3 caracteres.";
    esValido = false;
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
    errorNombre.textContent = "El nombre solo debe contener letras y espacios.";
    esValido = false;
  }

  // Validar edad (mejorado)
  if (edad === "" || isNaN(Number(edad)) || Number(edad) < 1 || Number(edad) > 120) {
    errorEdad.textContent = "La edad debe estar entre 1 y 120 años.";
    esValido = false;
  } else if (!Number.isInteger(Number(edad))) {
    errorEdad.textContent = "La edad debe ser un número entero.";
    esValido = false;
  }

  // Validar rol
  if (rol === "") {
    errorRol.textContent = "Debes seleccionar un rol.";
    esValido = false;
  }

  // Validar si el usuario ya existe (NUEVA FUNCIONALIDAD)
  const nombreExiste = usuarios.some(u => u.nombre.toLowerCase() === nombre.toLowerCase());
  if (esValido && nombreExiste) {
    errorNombre.textContent = "Ya existe un usuario con este nombre.";
    esValido = false;
  }

  return esValido;
}

// =============================================
// AGREGAR USUARIO (MEJORADO)
// =============================================
function agregarUsuario() {
  if (!validarFormulario()) {
    return;
  }

  // Crear nuevo usuario con ID único y fecha de registro
  ultimoId++;
  const usuario = {
    id: ultimoId,
    nombre: inputNombre.value.trim(),
    edad: Number(inputEdad.value.trim()),
    rol: inputRol.value,
    activo: true,
    fechaRegistro: new Date().toISOString()
  };

  // Agregar a la lista
  usuarios.push(usuario);

  // Limpiar formulario
  limpiarFormulario();

  // Mostrar mensaje de éxito (NUEVA FUNCIONALIDAD)
  mostrarMensajeTemporal("✅ Usuario agregado exitosamente", "success");

  // Actualizar tabla
  mostrarTabla();
}

// =============================================
// MOSTRAR MENSAJE TEMPORAL (NUEVA FUNCIÓN)
// =============================================
function mostrarMensajeTemporal(mensaje, tipo) {
  const mensajeDiv = document.createElement("div");
  mensajeDiv.textContent = mensaje;
  mensajeDiv.style.position = "fixed";
  mensajeDiv.style.top = "20px";
  mensajeDiv.style.right = "20px";
  mensajeDiv.style.padding = "12px 20px";
  mensajeDiv.style.borderRadius = "8px";
  mensajeDiv.style.backgroundColor = tipo === "success" ? "#1d9e75" : "#e24b4a";
  mensajeDiv.style.color = "white";
  mensajeDiv.style.zIndex = "1000";
  mensajeDiv.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  mensajeDiv.style.fontWeight = "500";
  
  document.body.appendChild(mensajeDiv);
  
  setTimeout(() => {
    mensajeDiv.style.opacity = "0";
    setTimeout(() => mensajeDiv.remove(), 300);
  }, 3000);
}

// =============================================
// LIMPIAR FORMULARIO
// =============================================
function limpiarFormulario() {
  inputNombre.value = "";
  inputEdad.value = "";
  inputRol.value = "";
  errorNombre.textContent = "";
  errorEdad.textContent = "";
  errorRol.textContent = "";
}

// =============================================
// CAMBIAR ESTADO DEL USUARIO (MEJORADO)
// =============================================
function cambiarEstado(id) {
  const usuario = usuarios.find(u => u.id === id);
  if (usuario) {
    usuario.activo = !usuario.activo;
    const estado = usuario.activo ? "activado" : "desactivado";
    mostrarMensajeTemporal(`✅ Usuario ${estado} correctamente`, "success");
    mostrarTabla();
  }
}

// =============================================
// ELIMINAR USUARIO (MEJORADO)
// =============================================
function eliminarUsuario(id) {
  // Confirmar eliminación (NUEVA FUNCIONALIDAD)
  if (confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
    const index = usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      const nombreUsuario = usuarios[index].nombre;
      usuarios.splice(index, 1);
      mostrarMensajeTemporal(`🗑️ Usuario "${nombreUsuario}" eliminado`, "success");
      mostrarTabla();
    }
  }
}

// =============================================
// EDITAR USUARIO (NUEVA FUNCIONALIDAD)
// =============================================
function editarUsuario(id) {
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return;
  
  const nuevoNombre = prompt("Editar nombre:", usuario.nombre);
  if (nuevoNombre && nuevoNombre.trim() !== "") {
    usuario.nombre = nuevoNombre.trim();
  }
  
  const nuevaEdad = prompt("Editar edad:", usuario.edad);
  if (nuevaEdad && !isNaN(Number(nuevaEdad)) && Number(nuevaEdad) >= 1 && Number(nuevaEdad) <= 120) {
    usuario.edad = Number(nuevaEdad);
  }
  
  const nuevoRol = prompt("Editar rol (Administrador/Usuario):", usuario.rol);
  if (nuevoRol && (nuevoRol === "Administrador" || nuevoRol === "Usuario")) {
    usuario.rol = nuevoRol;
  }
  
  mostrarMensajeTemporal("✏️ Usuario actualizado correctamente", "success");
  mostrarTabla();
}

// =============================================
// ORDENAR POR EDAD (MEJORADO)
// =============================================
function ordenarPorEdad() {
  usuarios.sort(function(a, b) {
    if (ordenAscendente) {
      return a.edad - b.edad;
    } else {
      return b.edad - a.edad;
    }
  });

  ordenAscendente = !ordenAscendente;
  const ordenTexto = ordenAscendente ? "descendente" : "ascendente";
  mostrarMensajeTemporal(`📊 Ordenado por edad (${ordenTexto === "ascendente" ? "menor a mayor" : "mayor a menor"})`, "success");
  mostrarTabla();
}

// =============================================
// LIMPIAR FILTROS (NUEVA FUNCIONALIDAD)
// =============================================
function limpiarFiltros() {
  filtroRol.value = "todos";
  if (buscador) buscador.value = "";
  mostrarMensajeTemporal("🔄 Filtros limpiados", "success");
  mostrarTabla();
}

// =============================================
// EXPORTAR DATOS (NUEVA FUNCIONALIDAD)
// =============================================
function exportarDatos() {
  const dataStr = JSON.stringify(usuarios, null, 2);
  const dataBlob = new Blob([dataStr], {type: "application/json"});
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `usuarios_exportados_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
  mostrarMensajeTemporal("💾 Datos exportados exitosamente", "success");
}

// =============================================
// MOSTRAR TABLA (MEJORADA)
// =============================================
function mostrarTabla() {
  // Obtener el filtro seleccionado
  const filtro = filtroRol.value;
  const textoBusqueda = buscador ? buscador.value.toLowerCase() : "";

  // Limpiar la lista
  listaUsuarios.innerHTML = "";

  // Crear elementos para los usuarios filtrados
  let usuariosEnLista = 0;

  for (let i = 0; i < usuarios.length; i++) {
    const usuario = usuarios[i];

    // Verificar si cumple el filtro
    const cumpleFiltroRol = filtro === "todos" || usuario.rol === filtro;
    const cumpleBusqueda = textoBusqueda === "" || usuario.nombre.toLowerCase().includes(textoBusqueda);
    
    if (cumpleFiltroRol && cumpleBusqueda) {
      // Crear elemento de lista
      const item = document.createElement("li");
      item.style.display = "flex";
      item.style.flexWrap = "wrap";
      item.style.gap = "10px";

      // Información del usuario (mejorada)
      const infoDiv = document.createElement("div");
      infoDiv.style.flex = "1";
      infoDiv.style.minWidth = "200px";
      
      // Formatear fecha de registro (NUEVA FUNCIONALIDAD)
      const fechaRegistro = new Date(usuario.fechaRegistro).toLocaleDateString('es-ES');
      
      infoDiv.innerHTML = `
        <strong>${usuario.nombre}</strong> | Edad: ${usuario.edad} | Rol: ${usuario.rol} | 
        Estado: <span style="color: ${usuario.activo ? '#1d9e75' : '#e24b4a'}; font-weight: bold;">
          ${usuario.activo ? "Activo" : "Inactivo"}
        </span><br>
        <small style="color: #666;">ID: ${usuario.id} | Registrado: ${fechaRegistro}</small>
      `;
      item.appendChild(infoDiv);

      // Contenedor de botones
      const botonesDiv = document.createElement("div");
      botonesDiv.style.display = "flex";
      botonesDiv.style.gap = "5px";

      // Botón de cambiar estado
      const botonEstado = document.createElement("button");
      botonEstado.type = "button";
      botonEstado.textContent = usuario.activo ? "🔴 Desactivar" : "🟢 Activar";
      botonEstado.style.backgroundColor = usuario.activo ? "#fcebeb" : "#e1f5ee";
      botonEstado.style.color = usuario.activo ? "#e24b4a" : "#1d9e75";
      botonEstado.onclick = () => cambiarEstado(usuario.id);
      botonesDiv.appendChild(botonEstado);

      // Botón de editar (NUEVO)
      const botonEditar = document.createElement("button");
      botonEditar.type = "button";
      botonEditar.textContent = "✏️ Editar";
      botonEditar.style.backgroundColor = "#e3f2fd";
      botonEditar.style.color = "#1976d2";
      botonEditar.onclick = () => editarUsuario(usuario.id);
      botonesDiv.appendChild(botonEditar);

      // Botón de eliminar
      const botonEliminar = document.createElement("button");
      botonEliminar.type = "button";
      botonEliminar.textContent = "🗑️ Eliminar";
      botonEliminar.style.backgroundColor = "#fcebeb";
      botonEliminar.style.color = "#e24b4a";
      botonEliminar.onclick = () => eliminarUsuario(usuario.id);
      botonesDiv.appendChild(botonEliminar);

      item.appendChild(botonesDiv);

      // Agregar elemento a la lista
      listaUsuarios.appendChild(item);
      usuariosEnLista++;
    }
  }

  // Mostrar mensaje si no hay usuarios
  if (usuariosEnLista === 0) {
    mensajeVacio.style.display = "block";
  } else {
    mensajeVacio.style.display = "none";
  }

  // =============================================
  // ACTUALIZAR ESTADÍSTICAS (MEJORADO)
  // =============================================
  const totalCount = usuarios.length;
  const activeCount = usuarios.filter(u => u.activo).length;
  const porcentajeActivos = totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(1) : 0;

  totalUsuarios.textContent = totalCount;
  usuariosActivos.textContent = activeCount;
  usuariosInactivos.textContent = totalCount - activeCount;
  
  // Actualizar título de estadísticas con porcentaje (NUEVA FUNCIONALIDAD)
  const estadisticasTitle = document.querySelector("h2");
  if (estadisticasTitle && estadisticasTitle.textContent === "Estadísticas") {
    // No modificar el título, solo actualizar tooltip o información adicional
    const statsContainer = document.querySelector("p");
    if (statsContainer && !statsContainer.querySelector(".porcentaje")) {
      const porcentajeSpan = document.createElement("span");
      porcentajeSpan.className = "porcentaje";
      porcentajeSpan.style.marginLeft = "10px";
      porcentajeSpan.style.fontSize = "12px";
      porcentajeSpan.style.color = "#666";
      porcentajeSpan.textContent = `| ${porcentajeActivos}% activos`;
      statsContainer.appendChild(porcentajeSpan);
    } else if (statsContainer && statsContainer.querySelector(".porcentaje")) {
      statsContainer.querySelector(".porcentaje").textContent = `| ${porcentajeActivos}% activos`;
    }
  }
}

// =============================================
// EVENTOS (MEJORADOS)
// =============================================

// Cuando se envía el formulario
formularioUsuario.onsubmit = function(evento) {
  evento.preventDefault();
  agregarUsuario();
};

// Cuando cambia el filtro
filtroRol.onchange = function() {
  mostrarTabla();
};

// Cuando se presiona el botón de ordenar
btnOrdenar.onclick = function() {
  ordenarPorEdad();
};

// Evento para limpiar filtros (NUEVO)
if (btnLimpiarFiltros) {
  btnLimpiarFiltros.onclick = limpiarFiltros;
}

// Evento para búsqueda en tiempo real (NUEVO)
if (buscador) {
  buscador.oninput = function() {
    mostrarTabla();
  };
}

// Evento para exportar datos (NUEVO)
if (btnExportar) {
  btnExportar.onclick = exportarDatos;
}

// =============================================
// INICIALIZAR (MEJORADO)
// =============================================
mostrarTabla();