console.log('este es el archivo del controlador');

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

  document.getElementById('seccion-' + opcion).style.display = 'block';


}