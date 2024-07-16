document.addEventListener('DOMContentLoaded', () => {
    let prendas = [];
    const formulario = document.getElementById('formulario-prendas');
    const lista = document.getElementById('lista');
    const filtroTipo = document.getElementById('filtro-tipo');
    const totalContador = document.getElementById('total-contador');
    const tipoContador = document.getElementById('tipo-contador');
    const temporadaContador = document.getElementById('temporada-contador');
    const marcaContador = document.getElementById('marca-contador');

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const nuevaPrenda = {
            id: Date.now(),
            nombre: formulario.nombre.value,
            tipo: formulario.tipo.value,
            temporada: formulario.temporada.value,
            marca: formulario.marca.value
        };
        prendas.push(nuevaPrenda);
        actualizarLista();
        actualizarResumen();
        formulario.reset();
    });

    filtroTipo.addEventListener('change', actualizarLista);

    function actualizarLista() {
        const filtro = filtroTipo.value;
        lista.innerHTML = '';
        prendas.filter(prenda => !filtro || prenda.tipo === filtro).forEach(prenda => {
            const item = document.createElement('li');
            item.innerHTML = `
                <span>${prenda.nombre} - ${prenda.tipo} - ${prenda.temporada} - ${prenda.marca}</span>
                <button class="editar" onclick="editarPrenda(${prenda.id})">Editar</button>
                <button class="eliminar" onclick="eliminarPrenda(${prenda.id})">Eliminar</button>
            `;
            lista.appendChild(item);
        });
    }

    function actualizarResumen() {
        totalContador.textContent = prendas.length;
        tipoContador.textContent = contarPorPropiedad('tipo');
        temporadaContador.textContent = contarPorPropiedad('temporada');
        marcaContador.textContent = contarPorPropiedad('marca');
    }

    function contarPorPropiedad(propiedad) {
        const conteos = prendas.reduce((acc, prenda) => {
            acc[prenda[propiedad]] = (acc[prenda[propiedad]] || 0) + 1;
            return acc;
        }, {});
        return JSON.stringify(conteos);
    }

    window.editarPrenda = (id) => {
        const prenda = prendas.find(p => p.id === id);
        if (prenda) {
            formulario.nombre.value = prenda.nombre;
            formulario.tipo.value = prenda.tipo;
            formulario.temporada.value = prenda.temporada;
            formulario.marca.value = prenda.marca;
            formulario.onsubmit = (evento) => {
                evento.preventDefault();
                prenda.nombre = formulario.nombre.value;
                prenda.tipo = formulario.tipo.value;
                prenda.temporada = formulario.temporada.value;
                prenda.marca = formulario.marca.value;
                actualizarLista();
                actualizarResumen();
                formulario.reset();
                formulario.onsubmit = manejadorEnvioFormulario;
            };
        }
    };

    window.eliminarPrenda = (id) => {
        if (confirm('¿Está seguro que quiere eliminar esta prenda?')) {
            prendas = prendas.filter(p => p.id !== id);
            actualizarLista();
            actualizarResumen();
        }
    };

    const manejadorEnvioFormulario = formulario.onsubmit;
});
