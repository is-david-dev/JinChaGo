// JavaScript
document.getElementById('mainButton').addEventListener('click', function() {
    const container = document.querySelector('.hidden-container');
    container.classList.add('visible');
  });

//Leemos las tablas
const productosCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQy2oNq6cXOmJucaSQxPcdGzTZMaebMVvuhNCHo47-em1AJvTR7LByS0XQbiXICFC4WwXUmk_zIx9Fk/pub?gid=0&single=true&output=csv';
const tablasCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQy2oNq6cXOmJucaSQxPcdGzTZMaebMVvuhNCHo47-em1AJvTR7LByS0XQbiXICFC4WwXUmk_zIx9Fk/pub?gid=1476200703&single=true&output=csv';


// Función para leer el CSV desde una URL
async function leerCSV(url) {
  const res = await fetch(url);
  const texto = await res.text();
  return texto.trim().split('\n').map(linea => linea.split(','));
}

// Función para mostrar los productos
async function mostrarProductos() {
  const data = await leerCSV(productosCSV);
  const contenedor = document.getElementById('productos-section');

  data.slice(1).forEach(([nombre, descripcion, precio, link]) => {
    const div = document.createElement('div');
    div.className = 'producto-card';
    div.innerHTML = `
      <img src="${link}" alt="${nombre}">
      <div class="info">
        <h3>${nombre}</h3>
        <p>${descripcion}</p>
        <span class="precio">Precio: $${precio}</span>
      </div>
    `;
    contenedor.appendChild(div);
  });
}



// Función para cargar las opciones del selector de tablas
async function cargarSelectorTablas() {
  const data = await leerCSV(tablasCSV);
  const selector = document.getElementById('tablaSelector');
  data.slice(1).forEach(([nombre, link]) => {
    const option = document.createElement('option');
    option.value = link;
    option.textContent = nombre;
    selector.appendChild(option);
  });

  selector.addEventListener('change', async (e) => {
    const url = e.target.value;
    if (!url) return;
    const data = await leerCSV(url);
    mostrarTabla(data);
  });
}

// Función para mostrar las tablas seleccionadas
function mostrarTabla(data) {
  const contenedor = document.getElementById('tablaContenido');
  contenedor.innerHTML = '';
  const table = document.createElement('table');
  table.innerHTML = ` 
    <thead><tr>${data[0].map(c => `<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${data.slice(1).map(fila => `<tr>${fila.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  `;
  contenedor.appendChild(table);
}

// Llamada para mostrar los productos y cargar las tablas
mostrarProductos();
cargarSelectorTablas();