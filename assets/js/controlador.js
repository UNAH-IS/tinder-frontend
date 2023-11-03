var usuarios = [];
var idUsuarioSeleccionado; //ID
var usuarioSeleccionado = null; //Objeto
var perfilesDeInteres = [];
var indicePerfilActual;
//funcion convencional
// function seleccionarOpcionMenu(opcion) {

// }

//Funcion tipo flecha (arrow function)
const seleccionarOpcionMenu = (opcion, etiqueta) => {
  // alert('Opcion seleccionada: ' + opcion);
  document.querySelectorAll('.opcion-boton').forEach(item => {
    item.classList.remove('seleccionado');
  });
  etiqueta.classList.add('seleccionado');

  document.getElementById('seccion-0').style.display = 'none';
  document.getElementById('seccion-1').style.display = 'none';
  document.getElementById('seccion-2').style.display = 'none';

  document.getElementById('seccion-' + opcion).style.display = 'block'
}

const obtenerUsuarios = () => {
  //Hacer la peticion (request)
  //Asincrona
  fetch('http://localhost:3000/users', { //ms
    method: 'GET',
    headers: {
      "Content-Type": "application/json", //MIME Type
    },
  }).then((resultado)=> {
    //Aqui se va a ejecutar cuando el fetch termine
    resultado.json().then((informacion)=>{
      console.log('Lista de usuarios retornada por el backend', informacion);
    }); //Asincrona
  });
}

const obtenerUsuarios2 = async () => {
  let resultado = await fetch('http://localhost:3000/users', { 
    method: 'GET',
    headers: {
      "Content-Type": "application/json", 
    },
  });

  let informacion = await resultado.json();
  console.log('Lista de usuarios retornada por el backend ()', informacion);
  usuarios = informacion;
  renderizarUsuarios(); //sincrona
}

const renderizarUsuarios = () => {
  //lista de los usuarios: NULL
  usuarios.forEach((usuario) => { //7 veces
    document.getElementById('usuarios').innerHTML += 
        `<div class="usuario" onclick="seleccionarUsuario(${usuario.id}, this)">
          <img src="assets/img/${usuario.imagenPerfil}">
          <div class="nombre">${usuario.nombre}</div>
        </div>`;
  });
  
}

const seleccionarUsuario = async (id, etiqueta) => {
  idUsuarioSeleccionado = id;
  console.log('Usuario seleccionado: ' + id);
  
  document.querySelectorAll('.usuario').forEach( e => {
    e.classList.remove('seleccionado');
  });
  etiqueta.classList.add('seleccionado');

  let resultado = await fetch('http://localhost:3000/users/' + id, { 
    method: 'GET',
    headers: {
      "Content-Type": "application/json", 
    },
  });

  usuarioSeleccionado = await resultado.json();
  console.log('Usuario seleccionado (se obtuvo nuevamente desde el servidor)', usuarioSeleccionado);
  
  perfilesDeInteres = usuarios.filter(u => usuarioSeleccionado.generoInteres.includes(u.genero));
  console.log('Perfiles de interes: ', perfilesDeInteres);
  indicePerfilActual = 0;
  renderizarPerfil(indicePerfilActual);
}

const renderizarPerfil = (indice) => {
  let perfil = perfilesDeInteres[indice];

  if (usuarioSeleccionado.likes.includes(perfilesDeInteres[indice].id)) {
    document.getElementById('boton-like').classList.add("like");
  } else {
    document.getElementById('boton-like').classList.remove("like");
  }

  console.log('Perfil a renderizar', perfil);
  console.log('Imagen:', `url(assets/img/${perfil.imagenPortada})`);
  document.getElementById('imagen-perfil').style.backgroundImage = `url(assets/img/${perfil.imagenPortada})`;
  document.querySelector('#informacion-basica h1').innerHTML = perfil.nombre;
  document.querySelector('#informacion-basica h4').innerHTML = perfil.edad;
  document.getElementById('ocupacion').innerHTML = perfil.ocupacion;
  document.getElementById('ciudad').innerHTML = perfil.ciudad;
}

obtenerUsuarios2(); //async

const renderizarSiguientePerfil = () => {
  indicePerfilActual++;
  if (perfilesDeInteres.length == indicePerfilActual) {
    indicePerfilActual = 0;
  }
  renderizarPerfil(indicePerfilActual)
}

const renderizarPerfilAnterior = () => {
  indicePerfilActual--;
  if (indicePerfilActual == -1) {
    indicePerfilActual = perfilesDeInteres.length-1;
  }
  renderizarPerfil(indicePerfilActual)
}

const agregarLike = async () => {
  ///??? Usuario autenticado
  console.log('Al usuario '+ usuarioSeleccionado.nombre + ' le dio like al usuario ' + perfilesDeInteres[indicePerfilActual].nombre);
  //Verificar si esta en el arreglo de likes, si está se elimina, sino se agrega.
  if (usuarioSeleccionado.likes.includes(perfilesDeInteres[indicePerfilActual].id)) {
    //Eliminarlo
    let indice = usuarioSeleccionado.likes.indexOf(perfilesDeInteres[indicePerfilActual].id);
    usuarioSeleccionado.likes.splice(indice, 1);
    document.getElementById('boton-like').classList.remove("like");
  } else {
    usuarioSeleccionado.likes.push(perfilesDeInteres[indicePerfilActual].id);
    document.getElementById('boton-like').classList.add("like");
  }
  // usuarioSeleccionado.likes = [...new Set(usuarioSeleccionado.likes)];


  let resultadoActualizacion = await fetch('http://localhost:3000/users/' + usuarioSeleccionado.id, { 
    method: 'PUT',
    headers: {
      "Content-Type": "application/json", 
    },
    body: JSON.stringify(usuarioSeleccionado)
  });

  let informacionActualizacion = await resultadoActualizacion.json();
  
  console.log('Respuesta del servidor luego de actualizar', informacionActualizacion);
}


//Para gestionar funciones asincronas JS utilizar un objeto especial 
// que se llaman promesas (promises)
// *Podemos saber cuando finaliza una funcion asincrona usando then
// * La otra forma es utilizanndo las instrucciones await y async