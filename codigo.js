/*
	Fabio Ernesto Flores Mendoza
	FM19038
*/
const urlAPI = 'https://retoolapi.dev/aqqBWB/productos';
var fila = `<tr>
    <td class='id'></td>
    <td class='foto'></td>
    <td class='price'></td>
    <td class='title'></td>
    <td class='description'></td>
    <td class='category'></td>
    <td class='delete'></td>
  </tr>`;
var productos = null;
function codigoCat(catstr) {
  var code = 'null';
  switch (catstr) {
    case 'electronicos':
      code = 'c1';
      break;
    case 'joyeria':
      code = 'c2';
      break;
    case 'caballeros':
      code = 'c3';
      break;
    case 'damas':
      code = 'c4';
      break;
  }
  return code;
}
var orden = 0;

function listarProductos(productos) {
  var precio = document.getElementById('price');
  precio.setAttribute('onclick', 'orden*=-1;listarProductos(productos);');
  var num = productos.length;
  var listado = document.getElementById('listado');
  var ids, titles, prices, descriptions, categories, fotos, eliminar;
  var tbody = document.getElementById('tbody'),
    nfila = 0;
  tbody.innerHTML = '';
  var catcode;
  for (i = 0; i < num; i++) tbody.innerHTML += fila;
  var tr;
  ids = document.getElementsByClassName('id');
  titles = document.getElementsByClassName('title');
  descriptions = document.getElementsByClassName('description');
  categories = document.getElementsByClassName('category');
  fotos = document.getElementsByClassName('foto');
  prices = document.getElementsByClassName('price');
  eliminar = document.getElementsByClassName('delete');
  if (orden === 0) {
    orden = -1;
    precio.innerHTML = 'Precio';
  } else if (orden == 1) {
    ordenarAsc(productos, 'price');
    precio.innerHTML = 'Precio A';
    precio.style.color = 'darkgreen';
  } else if (orden == -1) {
    ordenarDesc(productos, 'price');
    precio.innerHTML = 'Precio D';
    precio.style.color = 'blue';
  }

  listado.style.display = 'block';
  for (nfila = 0; nfila < num; nfila++) {
    ids[nfila].innerHTML = productos[nfila].id;
    titles[nfila].innerHTML = productos[nfila].title;
    descriptions[nfila].innerHTML = productos[nfila].description;
    categories[nfila].innerHTML = productos[nfila].category;
    catcode = codigoCat(productos[nfila].category);
    tr = categories[nfila].parentElement;
    tr.setAttribute('class', catcode);
    prices[nfila].innerHTML = '$' + productos[nfila].price;
    fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
    fotos[nfila].firstChild.setAttribute(
      'onclick',
      "window.open('" + productos[nfila].image + "');"
    );
    eliminar[nfila].innerHTML =
      '<button type="button" class="noselect"><span class="text">Delete</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>';
    eliminar[nfila].firstChild.setAttribute(
      'onclick',
      "eliminarProductos('" + productos[nfila].id + "');"
    );
  }
}

function crearProducto() {
  priceExReg = /^[0-9]+(\.[0-9]{1,2})?$/;
  imgExReg = /^[a-z]+:[^:]+$/;
  try {
    const title = document.getElementById('title-create').value;
    if (!title) throw new Error('Debe ingresar un titulo para la imagen');
    const image = document.getElementById('img-create').value;
    if (!image) throw new Error('Debe ingresar una url para la imagen');
    const price = document.getElementById('price-create').value;
    if (!price) throw new Error('Debe ingresar una precio para el producto');
    const category = document.getElementById('category-create').value;
    const description = document.getElementById('description-create').value;
    if (!description)
      throw new Error('Debe ingresar una descrpción para la imagen');
    if (!priceExReg.test(price)) throw new Error('Ingresar un precio válido');
    if (!imgExReg.test(image))
      throw new Error('Ingrese una url válida para la inmagen');
    const producto = {
      image,
      price,
      title,
      category,
      description,
    };
    fetch(urlAPI, {
      method: 'POST',
      body: JSON.stringify(producto),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        productos = data;
        productos.map((product) => {
          product.price = parseFloat(product.price);
        });
      });
    alert('Producto agregado exitosamente');
    document.getElementById('title-create').value = '';
    document.getElementById('img-create').value = '';
    document.getElementById('price-create').value = '';
    document.getElementById('description-create').value = '';
    orden = 0;
    obtenerProductos();
  } catch (e) {
    alert(e);
  }
}

function eliminarProductos(id) {
  fetch(`${urlAPI}/${id}`, { method: 'DELETE' })
    .then((res) => res.json())
    .then(alert(`Se ha eliminado el producto ${id}`))
    .then((data) => {
      productos = data;
      productos.map((product) => {
        product.price = parseFloat(product.price);
      });
    });
  orden = 0;
  obtenerProductos();
}

function obtenerProductos() {
  fetch(urlAPI)
    .then((res) => res.json())
    .then((data) => {
      productos = data;
      productos.map((product) => {
        product.price = parseFloat(product.price);
      });
      listarProductos(data);
    });
}

function ordenarDesc(p_array_json, p_key) {
  p_array_json.sort(function (a, b) {
    if (a[p_key] > b[p_key]) return -1;
    if (a[p_key] < b[p_key]) return 1;
    return 0;
  });
}

function ordenarAsc(p_array_json, p_key) {
  p_array_json.sort(function (a, b) {
    if (a[p_key] > b[p_key]) return 1;
    if (a[p_key] < b[p_key]) return -1;
    return 0;
  });
}
