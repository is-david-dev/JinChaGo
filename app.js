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

// Funcion que realiza la busqueda en sheets para obtener la cantidad de puntos durante los ultimos n meses
const mainButton = document.getElementById("mainButton");
const inputId = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const resultadoDiv = document.getElementById("resultado");

// Mostrar los campos al hacer clic
mainButton.addEventListener("click", () => {
  inputId.classList.add("show");
  submitBtn.classList.add("show");
});

// Buscar el ID al enviar
submitBtn.addEventListener("click", async () => {
  const url = "https://docs.google.com/spreadsheets/d/1agJO_QRV-TpSq_x-CRybpidkIEK0YE_FbJ0a_5DhmkA/export?format=csv&gid=1276338020";

  // Obtenemos la hora de red o local, esperando a que termine
  let fecha = await obtenerHoraDeRedFormateada();
  console.log("hora obtenida:", fecha);

  // Obtenemos el contenido del input
  const ID = document.getElementById("userId").value;
  
  // Obtenemos el divResultado
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = ""; // Limpia antes

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al obtener el CSV");

    const csvText = await response.text();

    // Dividimos filas usando expresión regular para varios tipos de saltos de línea
    const rows = csvText.split('\r\n').map(row => row.split(','));

    // Headers
    const headers = rows[0];

    // Creamos el arreglo de objetos
    const data = rows.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = row[index]?.trim();
      });
      return obj;
    });

    console.log(headers)

    // Recorrer de último a primero
    for (let i = data.length - 1; i >= 0; i--) {
      //obtenemos la fecha del csv y la convertimos en objeto Date
      let fechaCSV = stringADate(data[i]["Marca temporal"]);
      // console.log("1. Fecha csv: " + data[i]["Marca temporal"]);
      // console.log("2. Fecha csv formato: " + fechaCSV);
      // console.log("3. Fecha actual: " + fecha);
      // console.log(validarFechaCompra(fechaCSV, fecha));

      let resultado = validarFechaCompra(fechaCSV, fecha);
      if (resultado.valido) {
        // console.log(resultado.motivo)
        // Si la fecha esta dentro de los rangos validos verificamos si el ID es el mismo
        if (compararStringsCodigo(ID, data[i]["Codigo"])) {
          console.log("Codigo: " + ID + " Monto: " + data[i]["Monto depositado"])
          resultadoDiv.innerHTML += `<p>Código: ${ID} Monto: ${data[i]["Monto depositado"]}</p>`;
        }
        // console.log(data[i]["Codigo"])
        // console.log(ID)
      } else {
        // console.log(resultado.motivo)
        break
      }
    }
  } catch (error) {
    console.error("Error procesando el CSV:", error);
  }
});

// Obtener hora de red o local
async function obtenerHoraDeRedFormateada() {
  try {
    const respuesta = await fetch("https://worldtimeapi.org/api/timezone/America/Mexico_City");
    const datos = await respuesta.json();
    const fecha = new Date(datos.datetime);
    return fecha;
  } catch (error) {
    console.error("Error al obtener la hora de red:", error);
    return new Date();
  }
}

// Convierte string a Date
function stringADate(fechaStr) {
  try {
    // fechaStr ejemplo: "10/12/2022 13:23:12"
    const [fecha, hora] = fechaStr.split(' ');
    const [dia, mes, año] = fecha.split('/').map(Number);
    const [horas, minutos, segundos] = hora.split(':').map(Number);
    return new Date(año, mes - 1, dia, horas, minutos, segundos);
  } catch (error) {
    console.error("Error al convertir la fecha:", error);
    return new Date(2025, 3, 28);
    // return new Date(2022, 0, 1);
  }
}

// Valida la fecha de compra con respecto a la fecha actual
function validarFechaCompra(fechaCompra, fechaActual) {
  try {
    const hace2Meses = new Date(fechaActual);
    hace2Meses.setMonth(fechaActual.getMonth() - 2);

    const fechaMinima = new Date(2025, 3, 28);

    if (fechaCompra < hace2Meses) {
      return { valido: false, motivo: "La fecha de compra tiene más de 2 meses." };
    }

    if (fechaCompra < fechaMinima) {
      return { valido: false, motivo: "La fecha de compra es anterior al 28 de abril de 2025." };
    }

    return { valido: true, motivo: "Fecha dentro de los rangos establecidos" };
  } catch (error) {
    return { valido: false, motivo: "Error en validación de fechas." };
  }
}

// Recibe 2 strings y compara eliminando espacios y haciendolas mayusculas
function compararStringsCodigo(str1, str2) {
  const normalizar = str => str.replace(/\s+/g, '').toUpperCase();
  return normalizar(str1) === normalizar(str2);
}

// Llamada para mostrar los productos y cargar las tablas
Promise.all([mostrarProductos(), cargarSelectorTablas()]); // Ejecutar ambas funciones en paralelo
