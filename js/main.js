const venta = JSON.parse(localStorage.getItem("venta")) || [];

let pinturas = [];

const contenedorPinturas = document.querySelector("#pinturas");
const sinVentas = document.querySelector("#sin-ventas");
const ventaPinturas = document.querySelector("#venta-pinturas");
const totalVendido = document.querySelector("#total-vendido");
const botonFinalizar = document.querySelector("#venta-pinturas-finalizar")

fetch("./js/pinturas.json")
    .then(response => response.json())
    .then(data => {
        pinturas = data;
        cargarPinturas(pinturas)
    })
    .catch(error => {
        console.error("Error al cargar las pinturas:", error);
    });

function cargarPinturas(pinturasMostrar) {
    contenedorPinturas.innerHTML = "";

pinturasMostrar.forEach((pintura) => {
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
    Toastify({
        text: "Vendiste una lata de pintura",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
        background: "linear-gradient(to right, #00b09b, #2ccb96)",
        borderRadius: "1rem"
        },
        onClick: function(){} 
        }).showToast();
    });

    div.append(button);
    contenedorPinturas.append(div);
})
}

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
                
                Swal.fire({
                    title: "Quitar todo lo cargado sobre este produto",
                    text: "Estas seguro? Se va a borrar todo lo que cargaste",
                    icon: "question"
                });

                Toastify({
                    text: "🥺",
                    duration: 3000,
                    close: true,
                    gravity: "bottom",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                    background: "linear-gradient(to right, #00b09b, #2ccb96)",
                    borderRadius: "1rem",
                    fontSize: "2rem"
                    },
                    onClick: function(){} 
                    }).showToast();
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
        Swal.fire({
            title: "Opss",
            text: "No quedan mas en stock",
            imageUrl: "./img/outOfStock.jpg",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image"
        });
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

const buttonFinalizar = document.querySelector("#venta-pinturas-finalizar");
    buttonFinalizar.classList.add("btn-Finalizar-Carga");
    buttonFinalizar.innerText = "Finalizar Carga";
    buttonFinalizar.addEventListener("click", finalizarCarga)
        
    function finalizarCarga () {
        venta.length = 0;
        localStorage.setItem("venta", JSON.stringify(venta));
        
        Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Todo ha sido cargado correctamente",
        showConfirmButton: false,
        timer: 1500
        });

        ventaPinturas.classList.add("d-none");
        totalVendido.classList.add("d-none");
    }

    

actualizarVentas();

const consulta = document.querySelector("#busqueda");

consulta.addEventListener("input", () => {
    const textoConsulta = consulta.value.toLowerCase();
    const productosFiltrados = pinturas.filter((pintura) => pintura.titulo.toLowerCase().includes(textoConsulta));
    cargarPinturas(productosFiltrados);
});


