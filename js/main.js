const venta = JSON.parse(localStorage.getItem("venta")) || [];

let pinturas = [];

fetch("./js/pinturas.json")
    .then(response => response.json())
    .then(data => {
        pinturas = data;
        cargarPinturas(pinturas)
    })



const contenedorPinturas = document.querySelector("#pinturas");
const sinVentas = document.querySelector("#sin-ventas");
const ventaPinturas = document.querySelector("#venta-pinturas");
const totalVendido = document.querySelector("#total-vendido");

function cargarPinturas () {

pinturas.forEach((pintura) => {

    let div = document.createElement("div");
    div.classList.add("pintura");
    div.innerHTML = `
        <img class="pintura-img" src="${pintura.img}">
        <h3>${pintura.titulo}</h3>
        <p>$${pintura.precio}</p>
        <p>Cantidad en stock ${pintura.stock}</p>
        <p>Peso Neto por unidad ${pintura.pesoNeto}Kg</p>
    `;

    let button = document.createElement("button");
    button.classList.add("pintura-btn");
    button.innerText = "Unidad Vendida";
    button.addEventListener("click", () => {
        sumarAVenta(pintura);
    });

    div.append(button);
    contenedorPinturas.append(div);
})
}

cargarPinturas();


const actualizarVentas = () => {
    if (venta.length === 0) {
        sinVentas.classList.remove("d-none");
        ventaPinturas.classList.add("d-none");
    } else {
        sinVentas.classList.add("d-none");
        ventaPinturas.classList.remove("d-none");

        ventaPinturas.innerHTML = "";
        venta.forEach((pintura) => {
            let div = document.createElement("div");
            div.classList.add("venta-pintura");
            div.innerHTML = `
                <h3>${pintura.titulo}</h3>
                <p>$${pintura.precio}</p>
                <p>Cant: ${pintura.cantidad}</p>
                <p>Peso Neto: ${pintura.pesoNeto} Kg</p>
                `;

            let button = document.createElement("button");
            button.classList.add("venta-pintura-btn");
            button.innerText = "Vaciar";
            button.addEventListener("click", () => {
                quitarVenta(pintura);
            })

            div.append(button);
            ventaPinturas.append(div);

        })
    }
    actualizarTotal();
    localStorage.setItem("venta", JSON.stringify(venta));
}

const sumarAVenta = (pintura) => {
    if (pintura.stock > 0) {
        const itemEncontrado = venta.find(item => item.id === pintura.id);
        if (itemEncontrado) {
            itemEncontrado.cantidad++;
            pintura.stock--;
        } else {
            venta.push( {...pintura, cantidad: 1} );
            pintura.stock--;
        }
        actualizarVentas();
    } else {
        alert("No quedan más en stock!")
    }
}

const quitarVenta = (pintura) => {
    const itemEncontrado = pinturas.find(item => item.id === pintura.id);
    itemEncontrado.stock += pintura.cantidad;

    const pintIndex = venta.findIndex(item => item.id === pintura.id);
    venta.splice(pintIndex, 1);
    actualizarVentas();
}

const actualizarTotal = () => {
    const total = venta.reduce((acc, pint) => acc + (pint.precio * pint.cantidad), 0);
    totalVendido.innerText = `$${total}`;
}

actualizarVentas();