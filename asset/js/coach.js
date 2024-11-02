const pokemonsName = [];

const pokemonsList = fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151')
    .then(response => response.json())
    .then(data => {
        data.results.forEach(pokemon => {
            pokemonsName.push(pokemon.name);
        })
    });

async function selectOnePokemon(idPokemon) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`);
        const data = await response.json();
        return data;

    } catch (err) {
        console.error('Error al obtener un Pokemon:', err);
    }
}

async function selectOneMove(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;

    } catch (err) {
        console.error('Error al obtener ataque de Pokemon:', err);
    }
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
async function listCoachs() {
    const tbody = document.getElementById('dataListCoachs');
    tbody.innerHTML = '';
    
    if (entrenadores) {
        for (const entrenador of entrenadores) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${entrenador.id}</th>
                <td>${entrenador.entrenador}</td>
                <td>${entrenador.pokemon}</td>
                <td>${entrenador.batallas}</td>
                <td><button type="button" class="btn btn-success" id="entrenador${entrenador.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">Generar Batalla</button></td>
            `;
            tbody.appendChild(row);
            
            document.getElementById(`entrenador${entrenador.id}`).addEventListener('click', async () => {
                const randomIndex = Math.floor(Math.random() * 151);
                let lifePokemon = 500;
                let lifeRival = 500;

                const pokemonCoach = await selectOnePokemon(entrenador.pokemon);
                const pokemonRival = await selectOnePokemon(randomIndex);

                while (lifePokemon > 0 && lifeRival > 0) {
                    const attackRandom = Math.floor(Math.random() * pokemonCoach.moves.length);
                    const attackUrlPokemon = pokemonCoach.moves[attackRandom].move.url;
                    const attackNamePokemon = pokemonCoach.moves[attackRandom].move.name;

                    const movePokemon = await selectOneMove(attackUrlPokemon);
                    const powerAttackPokemon = movePokemon.power || 0;

                    const attackRandomRival = Math.floor(Math.random() * pokemonRival.moves.length);
                    const attackUrlRival = pokemonRival.moves[attackRandomRival].move.url;
                    const attackNameRival = pokemonRival.moves[attackRandomRival].move.name;

                    const moveRival = await selectOneMove(attackUrlRival);
                    const powerAttackRival = moveRival.power || 0;

                    // Aplica la lógica de batalla
                    if (powerAttackPokemon >= powerAttackRival) {
                        winBattle(entrenador.entrenador);
                    } else {
                        loseBattle(entrenador.entrenador);
                    }

                    lifePokemon -= powerAttackRival;
                    lifeRival -= powerAttackPokemon;

                    document.getElementById('exampleModalLabel').innerHTML = `Batalla generada contra ${pokemonRival.name}`;
                    document.getElementById('modalBody').innerHTML = `
                        <div class="row">
                            <div class="col-5 containerVs">
                                <img class="imgPokemonVs" src="${pokemonCoach.sprites.other["official-artwork"].front_default}">
                                <h5>Energia: ${lifePokemon}</h5>
                                <p>${pokemonCoach.name} usó <strong>${attackNamePokemon}</strong> con poder ${powerAttackPokemon}</p>
                            </div>
                            <div class="col-2">
                                <img src="../img/vs.png" class="imgVs">
                            </div>
                            <div class="col-5 containerVs">
                                <img class="imgPokemonVs" src="${pokemonRival.sprites.other["official-artwork"].front_default}">
                                <h5>Energia: ${lifeRival}</h5>
                                <p>${pokemonRival.name} usó <strong>${attackNameRival}</strong> con poder ${powerAttackRival}</p>
                            </div>
                        </div>
                    `;

                    await new Promise(resolve => setTimeout(resolve, 1500)); // Simula un retraso en cada ronda de batalla
                }

                Swal.fire({
                    title: `${lifePokemon > 0 ? 'Ganaste' : 'Perdiste'} esta batalla`,
                    icon: `${lifePokemon > 0 ? 'success' : 'error'}`,
                    confirmButtonText: 'Aceptar'
                });
                
                listCoachs(); // Refresca el listado al finalizar la batalla
            });
        }
    }
}


function winBattle(entrenadorName) {
    const entrenador = entrenadores.find(entrenador => entrenador.entrenador === entrenadorName);
    entrenador.batallas++;
    localStorage.setItem('entrenadores', JSON.stringify(entrenadores));
}
function loseBattle(entrenadorName) {
    const entrenador = entrenadores.find(entrenador => entrenador.entrenador === entrenadorName);
    entrenador.batallas--;
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
                        <td>${searchCoach.batallas}</td>
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
            batallas: 0
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

