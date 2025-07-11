// JavaScript optimizado

document.getElementById('mainButton').addEventListener('click', function() {
  const container = document.querySelector('.hidden-container');
  container.classList.add('visible');
});

// URLs de los CSV
const productosCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQy2oNq6cXOmJucaSQxPcdGzTZMaebMVvuhNCHo47-em1AJvTR7LByS0XQbiXICFC4WwXUmk_zIx9Fk/pub?gid=0&single=true&output=csv';
const tablasCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQy2oNq6cXOmJucaSQxPcdGzTZMaebMVvuhNCHo47-em1AJvTR7LByS0XQbiXICFC4WwXUmk_zIx9Fk/pub?gid=1476200703&single=true&output=csv';
const tablaPuntos = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQy2oNq6cXOmJucaSQxPcdGzTZMaebMVvuhNCHo47-em1AJvTR7LByS0XQbiXICFC4WwXUmk_zIx9Fk/pub?gid=1051246969&single=true&output=csv"

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
    const contenedor = document.getElementById('tablaContenido');
    contenedor.innerHTML = ''; // Limpiar el contenido previo
    
    const url = e.target.value;
    if (!url) return;
  
    const loader = document.getElementById('loader-tabla');
    loader.classList.remove('d-none');  // Mostrar loader
  
    try {
      const data = await leerCSV(url);
      mostrarTabla(data);
    } catch (error) {
      console.error("Error cargando la tabla:", error);
    } finally {
      loader.classList.add('d-none');  // Ocultar loader
    }
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


// ---------------------------------- PUNTOS ----------------------------------
// Buscar el ID al enviar
submitBtn.addEventListener("click", async () => {
  // Verificamos primero si el codigo ingresado es correcto
  const submitBtn = document.getElementById("submitBtn");
  const input = document.getElementById("userId");

  const regex = /^[Jj][Cc][Gg]\d{4}$/;

    if (!regex.test(input.value)) {
      alert('Tu código es incorrecto. Debe ser JCG seguido de 4 números.');
      input.focus();
      return;
    }

  // Formulario de pagos (respuestas)
  const url = "https://docs.google.com/spreadsheets/d/1agJO_QRV-TpSq_x-CRybpidkIEK0YE_FbJ0a_5DhmkA/export?format=csv&gid=1276338020";
  // Formulario de pagos mercari (respuestas)
  const urlMercari = "https://docs.google.com/spreadsheets/d/1mZAT63WxkNWEYbW9uftj_n7Tph1Yt4kYw2bRXpSxmBs/export?format=csv&gid=425040839"
  // Formulario de puntos usados:
  const urlAduana = "https://docs.google.com/spreadsheets/d/1YvIs9cORLcXVC_Lx5Aw7ZrcF1mr96pJS1Ddhxpv87q0/export?format=csv&gid=453768687"

  //variable para almacenar los puntos
  let puntos = 0;

  // Obtenemos la hora de red o local, esperando a que termine
  let fecha = await obtenerHoraDeRedFormateada();
  console.log("hora obtenida:", fecha);

  // Obtenemos el contenido del input
  const ID = document.getElementById("userId").value;

  // Loader
  const loader = document.getElementById('loader');
  loader.classList.remove('d-none');

  // Obtenemos el divResultado
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = ""; // Limpia antes

  try {
    const response = await fetch(url);
    const responseMercari = await fetch(urlMercari)
    const responseAduana = await fetch(urlAduana)
    const responseTablaPuntos = await fetch(tablaPuntos)

    if (!response.ok) throw new Error("Error al obtener el CSV");
    if (!responseMercari.ok) throw new Error("Error al obtener el CSV Mercari");
    if (!responseAduana.ok) throw new Error("Error al obtener el CSV aduana");
    if (!responseTablaPuntos.ok) throw new Error("Error al obtener los puntos");

    const csvTablaPuntos = await responseTablaPuntos.text();

    const rowsTablaPuntos = csvTablaPuntos.split('\r\n').map(row => row.split(','));
    console.log("TABLA PUNTOS: " + rowsTablaPuntos)
    console.log("Header: " + rowsTablaPuntos[0])
    console.log("Valor puntos: " + rowsTablaPuntos[1])
    let valorPuntos = parseInt(rowsTablaPuntos[1])

    const csvText = await response.text();
    const csvMercari = await responseMercari.text();
    const csvAduana = await responseAduana.text();

    const parsedData = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const parsedMercari = Papa.parse(csvMercari, {
      header: true,
      skipEmptyLines: true,
    });
    
    const parsedAduana = Papa.parse(csvAduana, {
      header: true,
      skipEmptyLines: true,
    });

    const data = parsedData.data;
    const dataMercari = parsedMercari.data;
    const dataAduana = parsedAduana.data;

    console.log(parsedData.meta.fields)
    console.log(parsedMercari.meta.fields)
    console.log(parsedAduana.meta.fields)

    // Recorrer de último a primero del cvs de Corea
    console.log("Corea: ")
    for (let i = data.length - 1; i >= 0; i--) {
      //obtenemos la fecha del csv y la convertimos en objeto Date
      let fechaCSV = stringADate(data[i]["Marca temporal"]);

      let resultado = validarFechaCompra(fechaCSV, fecha);

      if (!resultado.valido) continue;

      if (compararStringsCodigo(ID, data[i]["Codigo"])) {
        console.log("Codigo: " + ID + " Monto: " + data[i]["Monto depositado"] + " Fecha: " + fechaCSV)
        // resultadoDiv.innerHTML += `<p>Código: ${ID} Monto: ${data[i]["Monto depositado"]}</p>`;
        let monto = parseFloat(data[i]["Monto depositado"].replace(/[^0-9.-]+/g, '')) || 0;
        puntos += monto;
        // console.log("Puntos: " + puntos)
      }
    }

    // Recorrer de último a primero del cvs de Mercari
    console.log("Mercari: ")
    for (let i = dataMercari.length - 1; i >= 0; i--) {
      //obtenemos la fecha del csv y la convertimos en objeto Date
      let fechaCSV = stringADate(dataMercari[i]["Marca temporal"]);
      let resultadoMercari = validarFechaCompra(fechaCSV, fecha);
    
      if (!resultadoMercari.valido) continue;
    
      if (compararStringsCodigo(ID, dataMercari[i]["Codigo"])) {
        console.log("Codigo Mercari: " + ID + " Monto: " + dataMercari[i]["Monto depositado"] + " Fecha: " + fechaCSV)
        // resultadoDiv.innerHTML += `<p>Código: ${ID} Monto: ${dataMercari[i]["Monto depositado"]}</p>`;
        let monto = parseFloat(dataMercari[i]["Monto depositado"].replace(/[^0-9.-]+/g, '')) || 0;
        puntos += monto;
        // console.log("Puntos: " + puntos)
      }
    }

    puntos = Math.floor(puntos / (100))
    console.log("TOTAL DE PUNTOS: " + puntos)

    // Restamos puntos de aduada
    console.log("Puntos a restar: ")
    for (let i = dataAduana.length - 1; i >= 0; i--) {
      //obtenemos la fecha del csv y la convertimos en objeto Date
      let fechaCSV = stringADate(dataAduana[i]["Marca temporal"]);
      let resultadoAduana = validarFechaCompra(fechaCSV, fecha);
    
      if (!resultadoAduana.valido) continue;
  
      // console.log("Puntos descontados: ")
      if (compararStringsCodigo(ID, dataAduana[i]["Codigo"])) {
        console.log("Codigo Mercari: " + ID + " Puntos usados: " + dataAduana[i]["Puntos"] + " Fecha: " + fechaCSV)
        // resultadoDiv.innerHTML += `<p>Código: ${ID} Monto: ${dataMercari[i]["Monto depositado"]}</p>`;
        let puntosUsados = parseFloat(dataAduana[i]["Puntos"].replace(/[^0-9.-]+/g, '')) || 0;
        puntos -= puntosUsados;
        // console.log("Puntos: " + puntos)
      }
    }

    if (puntos > 0) {
      const totalPesos = puntos * valorPuntos;

      resultadoDiv.innerHTML += `
        <div class="alert alert-success" role="alert">
          <h4 class="alert-heading">¡Tienes puntos disponibles!</h4>
          <p><strong>${puntos}</strong> puntos disponibles.</p>
          <p>Cada punto tiene un valor de <strong>$${valorPuntos}</strong> MXN.</p>
          <hr>
          <p class="mb-0">Equivalente total: <strong>$${totalPesos}</strong> MXN.</p>
        </div>
        <div class="alert alert-warning mt-3" role="alert">
          <i class="fas fa-info-circle me-2"></i>
          Recuerda que tus puntos tienen una vigencia de <strong>2 meses</strong> a partir de su fecha de obtención.
        </div>
      `;
    } else {
      resultadoDiv.innerHTML += `
        <div class="alert alert-danger" role="alert">
          <strong>No tienes puntos disponibles.</strong> ¡Sigue participando para acumular más!
        </div>
      `;
    }
  } catch (error) {
    console.error("Error procesando el CSV:", error);
  } finally {
    loader.classList.add('d-none')
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
    // Validar que la fecha tenga un espacio separando fecha y hora
    if (!fechaStr.includes(" ")) {
      console.warn("Formato de fecha inesperado:", fechaStr);
      return new Date(2025, 3, 28); // Fallback: 28 de abril de 2025
    }

    // Ejemplo de fecha esperada: "10/12/2022 13:23:12"
    const [fecha, hora] = fechaStr.split(' ');
    const [dia, mes, año] = fecha.split('/').map(Number);
    const [horas, minutos, segundos] = hora.split(':').map(Number);

    return new Date(año, mes - 1, dia, horas, minutos, segundos);
  } catch (error) {
    console.error("Error al convertir la fecha:", error);
    return new Date(2025, 3, 28); // Fallback por error
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
