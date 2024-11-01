const pokemonsList = fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151')
    .then(response => response.json())
    .then(data => data.results)

function selectOnePokemon(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => data);
}

// CONTROL DE VISIÓN DE BOTONES
function viewFuntionPokemon(divId) {
    // Ocultar todos los contenedores
    document.getElementById('containerListPokemons').style.display = 'none';
    document.getElementById('containerSearchPokemons').style.display = 'none';

    // Limpiar mensajes de resultados anteriores
    document.getElementById('resultSearchPokemon').innerHTML = '';

    // Si divId no es null o undefined, mostrar el contenedor correspondiente
    if (divId) {
        document.getElementById(divId).style.display = 'block';
    }
}

document.getElementById('btnListPokemons').addEventListener('click', function() {
    viewFuntionPokemon('containerListPokemons');
    listPokemons();
});

document.getElementById('btnSearchPokemons').addEventListener('click', function() {
    viewFuntionPokemon('containerSearchPokemons');
    document.getElementById('resultSearchPokemon').innerHTML = '';
});

document.getElementById('btnSearchPokemon').addEventListener('click', function() {
    SearchPokemons();
});

viewFuntionPokemon();

// LISTAR POKEMONS
function listPokemons() {
    const container = document.getElementById('pokemonCardContainer');
    container.innerHTML = '';
    
    pokemonsList.then(data => {
        data.forEach(pokemon => {
            const col = document.createElement('div');
            col.classList.add('col-md-2');
            
            selectOnePokemon(pokemon.url).then(select => {                
                col.innerHTML = `
                    <div class="card ${select.types[0].type.name}">
                        <img src="${select.sprites.other["official-artwork"].front_default}" class="card-img-top" alt="${pokemon.name}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${select.id} - ${pokemon.name}</h5>
                            <h6>Peso: ${select.weight / 10} Kg</h6>
                            <h6>Altura: ${select.height / 10} Kg</h6>
                        </div>
                    </div>
                `;

                container.appendChild(col);
            });
        });
    });
}

function SearchPokemons() {
    const inputSearch = document.getElementById('inputSearchPokemon').value;
    const container = document.getElementById('resultSearchPokemon');
    container.innerHTML = '';
    
    const col = document.createElement('div');
    col.classList.add('col-md-2');
    
    if (inputSearch > 151) {
        container.innerHTML = `<h6 class="marginElement mensergerDanger">No se encontró el pokemon con id ${inputSearch}</h6>`;
    } else {
        selectOnePokemon(`https://pokeapi.co/api/v2/pokemon/${inputSearch}`).then(select => {
            if (select) {
                col.innerHTML = `
                    <div class="card ${select.types[0].type.name}">
                        <img src="${select.sprites.other["official-artwork"].front_default}" class="card-img-top" alt="${select.name}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${select.id} - ${select.name}</h5>
                            <h6>Peso: ${select.weight / 10} Kg</h6>
                            <h6>Altura: ${select.height / 10} Kg</h6>
                        </div>
                    </div>
                `;
                container.appendChild(col);
            }
        }).catch(error => {
            container.innerHTML = `<p class="marginElement mensergerDanger">Error al buscar el Pokémon: ${error.message}</p>`;
        });
    
        document.getElementById('inputSearchPokemon').value = '';    
    }
};
