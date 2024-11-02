const pokemonsName = [];

const pokemonsList = fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151')
    .then(response => response.json())
    .then(data => {
        data.results.forEach(pokemon => {
            pokemonsName.push(pokemon.name);
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
                <td><button type="button" class="btn btn-success" id="entrenador${entrenador.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">Generar Batalla</button></td>
            `;
            tbody.appendChild(row);
            
            document.getElementById(`entrenador${entrenador.id}`).addEventListener('click', () => {

                selectOnePokemon(entrenador.pokemon).then(pokemonCoach => {
                    const randomIndex = Math.floor(Math.random() * 150) + 1;
                    
                    selectOnePokemon(randomIndex).then(pokemonRival => {
                        let powerPokemon = Math.floor(Math.random() * 100);
                        let powerRival = Math.floor(Math.random() * 100);
    
                        if (powerPokemon > powerRival ? winBattle(entrenador.entrenador) : loseBattle(entrenador.entrenador));
    
                        document.getElementById('exampleModalLabel').innerHTML = `Batalla generada contra ${pokemonRival.name}`;
                        document.getElementById('modalBody').innerHTML = `
                            <div class="row">
                                <div class="col-5 containerVs">
                                    <img class="imgPokemonVs" src=${pokemonCoach.sprites.other["official-artwork"].front_default}>
                                    <p>${pokemonCoach.name} usó <strong>${pokemonCoach.moves[Math.floor(Math.random()*pokemonRival.moves.length)].move.name}</strong> con poder ${powerPokemon}</p>
                                </div>
                            <div class="col-2">
                                <img src="../img/vs.png" class="imgVs">
                            </div>
                                <div class="col-5 containerVs">
                                    <img class="imgPokemonVs" src=${pokemonRival.sprites.other["official-artwork"].front_default}>
                                    <p>${pokemonRival.name} usó <strong>${pokemonRival.moves[Math.floor(Math.random()*pokemonRival.moves.length)].move.name}</strong> con poder ${powerRival}</p>
                                </div>
                            </div>
                        `;
                        setTimeout(() => {
                            Swal.fire({
                                title: `${powerPokemon > powerRival ? 'Sumaste 1 punto en este duelo' : 'Restaste 1 punto en este duelo'}`,
                                icon: `${powerPokemon > powerRival ?  'success' : 'error'}`,
                                confirmButtonText: `${powerPokemon > powerRival ? 'Ganaste' : 'Perdiste'}`
                            });
                        }, 1500);
                        listCoachs();
                    });
                });
            });
        });
    }
}

function winBattle(entrenadorName) {
    const entrenador = entrenadores.find(entrenador => entrenador.entrenador === entrenadorName);
    entrenador.hijos++;
    localStorage.setItem('entrenadores', JSON.stringify(entrenadores));
}
function loseBattle(entrenadorName) {
    const entrenador = entrenadores.find(entrenador => entrenador.entrenador === entrenadorName);
    entrenador.hijos--;
    localStorage.setItem('entrenadores', JSON.stringify(entrenadores));
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
                    <th scope="col">Duelos ganados</th>
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
    const resultAddCoach = document.getElementById('resultAddCoach');

    // Validar si ya existe el id o el nombre
    
    const searchCoach = entrenadores.find(Coach => Coach.id === id);
    const searchCoachName = entrenadores.find(Coach => Coach.entrenador === entrenador);

    if (searchCoach) {
        resultAddCoach.innerHTML = `<h6 class="marginElement mensergerDanger">Ya existe un entrenador con id ${id}</h6>`;
        return;
    } if (searchCoachName) {
        resultAddCoach.innerHTML = `<h6 class="marginElement mensergerDanger">Ya existe un entrenador con el nombre ${entrenador}</h6>`;
        return;
    } else {
        const newCoach = {
            id: entrenadores.length, // Asignar un ID basado en la longitud del array
            id: id,
            entrenador: entrenador,
            pokemon: pokemon,
            hijos: 0
        };
    
        entrenadores.push(newCoach);
        localStorage.setItem('entrenadores', JSON.stringify(entrenadores));
    
        document.getElementById('id').value = '';
        document.getElementById('entrenador').value = '';
        document.getElementById('selectPokemon').value = '';
    
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

