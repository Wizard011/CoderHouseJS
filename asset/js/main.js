const pokemonsName = [];

const pokemonsList = fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151')
    .then(response => response.json())
    .then(data => {
        data.results.forEach(name => {
            pokemonsName.push(name.name);
        })
    });

function selectOnePokemon(idPokemon) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
        .then(response => response.json())
        .then(data => data);
}

let entrenadores = JSON.parse(localStorage.getItem('entrenadores')) || [];

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
    listPokemons(pokemonsName);
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
                <td>${entrenador.pokemon}</th>
                <td>${entrenador.hijos}</td>
                <td><button class="btn btn-success" id="entrenador${entrenador.id}">Generar Batalla</button></td>
            `;
            tbody.appendChild(row);

            const randomIndex = Math.floor(Math.random() * 150) + 1;
            const randomPokemon = selectOnePokemon(randomIndex).then(response => response.data);
            console.log(randomPokemon);
            
            document.getElementById(`entrenador${entrenador.id}`).addEventListener('click', () => {
                Swal.fire({
                    title: `¡Batalla Generada contra ${pokemonsName[randomIndex]}!`,
                    imageUrl: "https://unsplash.it/400/200",
                    imageWidth: 200,
                    imageHeight: 200,
                    text: `La batalla para el entrenador ${entrenador.nombre} ha sido generada.`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            });
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
                    <th scope="col">Pokemon</th>
                    <th scope="col">Cantidad de Hijos/as</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">${searchCoach.id}</th>
                        <td>${searchCoach.entrenador}</td>
                        <td>${searchCoach.pokemon}</td>
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

// LISTAR pokemonsName
function listPokemons(pokemonsName) {
    const selectPokemon = document.getElementById('selectPokemon');
    if (selectPokemon) {
        // Limpiar cualquier opción existente
        selectPokemon.innerHTML = '';

        // Agregar nuevas opciones
        for (const pokemon of pokemonsName) {
            const option = document.createElement('option');
            option.value = pokemon;
            option.textContent = pokemon;
            selectPokemon.appendChild(option);
        }
    }
}

// AGREGAR ENTRENADOR
function addCoachs() {
    const id = document.getElementById('id').value;
    const entrenador = document.getElementById('entrenador').value;
    const pokemon = document.getElementById('selectPokemon').value;
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
            pokemon: pokemon,
            hijos: hijos
        };
    
        entrenadores.push(newCoach);
        localStorage.setItem('entrenadores', JSON.stringify(entrenadores));
    
        document.getElementById('id').value = '';
        document.getElementById('entrenador').value = '';
        document.getElementById('selectPokemon').value = '';
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

function battlePokemon (){
    
}
