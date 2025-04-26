// JavaScript optimizado

document.getElementById('mainButton').addEventListener('click', function() {
  const container = document.querySelector('.hidden-container');
  container.classList.add('visible');
});

// URLs de los CSV
const productosCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQy2oNq6cXOmJucaSQxPcdGzTZMaebMVvuhNCHo47-em1AJvTR7LByS0XQbiXICFC4WwXUmk_zIx9Fk/pub?gid=0&single=true&output=csv';
const tablasCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQy2oNq6cXOmJucaSQxPcdGzTZMaebMVvuhNCHo47-em1AJvTR7LByS0XQbiXICFC4WwXUmk_zIx9Fk/pub?gid=1476200703&single=true&output=csv';

// Función para leer el CSV desde una URL
async function leerCSV(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error al cargar el CSV desde ${url}`);
    const texto = await res.text();
    return texto.trim().split('\n').map(linea => linea.split(','));
  } catch (error) {
    console.error('Error al leer el CSV:', error);
    return [];
  }
}

// Función para mostrar los productos
async function mostrarProductos() {
  const data = await leerCSV(productosCSV);
  if (!data.length) return; // Si no hay datos, salir

  const contenedor = document.getElementById('productos-section');
  const fragment = document.createDocumentFragment(); // Usar un fragmento para mejorar la eficiencia

  data.slice(1).forEach(([nombre, descripcion, precio, link]) => {
    const div = document.createElement('div');
    div.className = 'producto-card';

    const img = document.createElement('img');
    img.src = link;
    img.alt = nombre;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'info';

    const h3 = document.createElement('h3');
    h3.textContent = nombre;

    const p = document.createElement('p');
    p.textContent = descripcion;

    const precioSpan = document.createElement('span');
    precioSpan.className = 'precio';
    precioSpan.textContent = `Precio: $${precio}`;

    infoDiv.append(h3, p, precioSpan);
    div.append(img, infoDiv);
    fragment.appendChild(div);
  });

  contenedor.appendChild(fragment); // Agregar todos los elementos a la vez
}

// Función para cargar las opciones del selector de tablas
async function cargarSelectorTablas() {
  const data = await leerCSV(tablasCSV);
  if (!data.length) return; // Si no hay datos, salir

  const selector = document.getElementById('tablaSelector');
  const fragment = document.createDocumentFragment(); // Usar un fragmento para mejorar la eficiencia

  data.slice(1).forEach(([nombre, link]) => {
    const option = document.createElement('option');
    option.value = link;
    option.textContent = nombre;
    fragment.appendChild(option);
  });

  selector.appendChild(fragment);

  // Evento change para cargar la tabla
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
  contenedor.innerHTML = ''; // Limpiar el contenido previo

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Crear la fila del encabezado
  const encabezado = document.createElement('tr');
  data[0].forEach(c => {
    const th = document.createElement('th');
    th.textContent = c;
    encabezado.appendChild(th);
  });
  thead.appendChild(encabezado);

  // Crear las filas del cuerpo
  data.slice(1).forEach(fila => {
    const tr = document.createElement('tr');
    fila.forEach(c => {
      const td = document.createElement('td');
      td.textContent = c;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  contenedor.appendChild(table);
}

// Llamada para mostrar los productos y cargar las tablas
Promise.all([mostrarProductos(), cargarSelectorTablas()]); // Ejecutar ambas funciones en paralelo
