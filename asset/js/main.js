let entrenadores = JSON.parse(localStorage.getItem('entrenadores')) || [];

const pokemonList = fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151')
    .then(response => response.json())
    .then(data => data.results.map(pokemon => pokemon.name))
    .then(names => new Promise((resolve) => {
        resolve(names);
    }));

    console.log(pokemonList);
    

// let pokemonList = ['Administración', 'Ventas', 'Marketing', 'Sistemas', 'RRHH', 'Legal', 'Compras', 'Producción'];

// CONTROL DE VISIÓN DE BOTONES
function viewFuntionCoach(divId) {
    // Ocultar todos los contenedores
    document.getElementById('containerListCoachs').style.display = 'none';
    document.getElementById('containerSearchCoachs').style.display = 'none';
    document.getElementById('containerAddCoachs').style.display = 'none';
    document.getElementById('containerDeleteCoachs').style.display = 'none';

    // Limpiar mensajes de resultados anteriores
    document.getElementById('resultAddCoach').innerHTML = '';
    document.getElementById('resultDeleteCoach').innerHTML = '';
    document.getElementById('resultSearchCoach').innerHTML = '';

    // Si divId no es null o undefined, mostrar el contenedor correspondiente
    if (divId) {
        document.getElementById(divId).style.display = 'block';
    }
}

document.getElementById('btnListCoachs').addEventListener('click', function() {
    viewFuntionCoach('containerListCoachs');
    listCoachs();
});

document.getElementById('btnSearchCoachs').addEventListener('click', function() {
    viewFuntionCoach('containerSearchCoachs');
    document.getElementById('resultSearchCoach').innerHTML = '';
});

document.getElementById('btnAddCoachs').addEventListener('click', function() {
    viewFuntionCoach('containerAddCoachs');
    listSectors(pokemonList);
    controlChildren();
});

document.getElementById('btnDeleteCoachs').addEventListener('click', function() {
    viewFuntionCoach('containerDeleteCoachs');
});

document.getElementById('btnSearchCoach').addEventListener('click', function() {
    SearchCoachs();
});

document.getElementById('btnDeleteCoach').addEventListener('click', function() {
    deleteCoach();
});

document.getElementById('saveCoach').addEventListener('click', function() {
    addCoachs();
});

viewFuntionCoach();

// LISTAR ENTRENADORES
function listCoachs() {
    const tbody = document.getElementById('dataListCoachs');
    tbody.innerHTML = '';
    
    if (entrenadores) {
        entrenadores.forEach(entrenador => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${entrenador.id}</th>
                <td>${entrenador.entrenador}</td>
                <td>${entrenador.sector}</th>
                <td>${entrenador.hijos}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// BUSCAR ENTRENADOR
function SearchCoachs() {
    const inputId = document.getElementById('inputSearchCoach').value;
    const searchCoach = entrenadores.find(Coach => Coach.id === inputId);
    const resultSearchCoach = document.getElementById('resultSearchCoach');
    
    if (searchCoach) {
        resultSearchCoach.innerHTML = `
            <table class="table">
                <thead class="table-primary">
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Entrenador</th>
                    <th scope="col">Sector</th>
                    <th scope="col">Cantidad de Hijos/as</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">${searchCoach.id}</th>
                        <td>${searchCoach.entrenador}</td>
                        <td>${searchCoach.sector}</td>
                        <td>${searchCoach.hijos}</td>
                    </tr>
                </tbody>
            </table>
        `;
    } else {
        resultSearchCoach.innerHTML = `<h6 class="marginElement mensergerDanger">No se encontró el entrenador con id ${inputId}</h6>`;
    }

    document.getElementById('inputSearchCoach').value = '';
}

function controlChildren() {
    let count = document.getElementById('countChildren');
    let subtract = document.getElementById('subtractChildren');
    let add = document.getElementById('addChildren');
    let counter = 0;

    subtract.onclick = () => {
        if (counter > 0) {
            counter--;
            count.innerHTML = counter;
        }
    }
    add.onclick = () => {
        counter++;
        count.innerHTML = counter;
    }
}

// LISTAR pokemonList
function listSectors(pokemonList) {
    const selectSector = document.getElementById('selectSector');
    if (selectSector) {
        // Limpiar cualquier opción existente
        selectSector.innerHTML = '';

        // Agregar nuevas opciones
        for (const sector of pokemonList) {
            const option = document.createElement('option');
            option.value = sector;
            option.textContent = sector;
            selectSector.appendChild(option);
        }
    }
}

// AGREGAR ENTRENADOR
function addCoachs() {
    const id = document.getElementById('id').value;
    const entrenador = document.getElementById('entrenador').value;
    const sector = document.getElementById('selectSector').value;
    const hijos = document.getElementById('countChildren').textContent;
    const resultAddCoach = document.getElementById('resultAddCoach');

    // Validar si ya existe el id
    const searchCoach = entrenadores.find(Coach => Coach.id === id);

    if (searchCoach) {
        resultAddCoach.innerHTML = `<h6 class="marginElement mensergerDanger">Ya existe un entrenador con id ${id}</h6>`;
        return;
    } else {
        const newCoach = {
            id: entrenadores.length, // Asignar un ID basado en la longitud del array
            id: id,
            entrenador: entrenador,
            sector: sector,
            hijos: hijos
        };
    
        entrenadores.push(newCoach);
        localStorage.setItem('entrenadores', JSON.stringify(entrenadores));
    
        document.getElementById('id').value = '';
        document.getElementById('entrenador').value = '';
        document.getElementById('selectSector').value = '';
        document.getElementById('countChildren').textContent = 0;
    
        resultAddCoach.innerHTML = `<h6 class="marginElement mensergerSuccess">Entrenador con id ${id} agregado correctamente</h6>`;
    }
}

// ELIMINAR ENTRENADOR
function deleteCoach() {
    const inputId = document.getElementById('inputDeleteCoach').value;
    const resultDeleteCoach = document.getElementById('resultDeleteCoach');

    const searchCoach = entrenadores.find(Coach => Coach.id === inputId);

    if (searchCoach) {
        const index = entrenadores.indexOf(searchCoach);
        entrenadores.splice(index, 1);
        localStorage.setItem('entrenadores', JSON.stringify(entrenadores));
        resultDeleteCoach.innerHTML = `<h6 class="marginElement mensergerSuccess">Entrenador con id ${inputId} eliminado correctamente</h6>`;
    } else {
        resultDeleteCoach.innerHTML = `<h6 class="marginElement mensergerDanger">No se encontró el entrenador con id ${inputId}</h6>`;
    }

    document.getElementById('inputDeleteCoach').value = '';
}