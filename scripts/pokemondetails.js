async function givePokemonDetails(id) {
    var response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    var object = await response.json();

    return object;
}

async function evolutionChain(speciePokemon) {
    var response = await fetch(speciePokemon);
    var object = await response.json();

    response = await fetch(object.evolution_chain.url);
    object = await response.json();

    return object;
}

async function pokemonDetails() {
    var parameters = window.location.search;

    var newUrl = new URLSearchParams(parameters);

    var number = newUrl.get('numero');

    compruebaTema();

    var pokemon = await givePokemonDetails(number);

    var evolution = await evolutionChain(pokemon.species.url);

    chooseFavicon(pokemon);

    crearDatos(pokemon);

    makeChain(pokemon, evolution);

    document.title = `${pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1)} | Pokédex`;
}

async function makeChain(pokemon, evolution) {
    var chain = evolution.chain;
    var numberEvolutions = chain.evolves_to.length;

    await makeChainData(pokemon, chain);

    for (var i = 0; i < numberEvolutions; i++) {
        var chainCopy = chain.evolves_to[i];

        await makeChainData(pokemon, chainCopy);

        for (var j = 0; j < chainCopy.evolves_to.length; j++) {
            var subChain = chainCopy.evolves_to[j];

            await makeChainData(pokemon, subChain);
        }
    }
}

async function makeChainData(thisPokemon, chain) {
    var id = chain.species.url.split("/")[6];

    var pokemon = await givePokemonDetails(id);

    var chainSpace = document.getElementById("evolution-chain");

    var link = document.createElement("a");
    link.href = `pokemon.html?numero=${id}`;

    var element = document.createElement("div");
    element.classList.add("poke");

    var imageContainer = document.createElement("div");
    imageContainer.classList.add("image");

    var image = document.createElement("img");
    image.src = pokemon.sprites.other["official-artwork"].front_default;
    image.alt = "Lo siento, el pokemon no ha sido encontrado :(";

    image.addEventListener("mouseover", () => {
        image.style.filter = `drop-shadow(0 0 15px var(--${pokemon.types[0].type.name}))`;
    })
    image.addEventListener("mouseout", () => {
        image.style.filter = `none`;
    })

    var pokemonName = document.createElement("div");
    pokemonName.classList.add("name");

    if (chain.species.name == thisPokemon.species.name) {
        pokemonName.innerHTML = `*${chain.species.name}*`;
        link.style.color = "black";
    } else {
        pokemonName.innerHTML = chain.species.name;
        link.style.color = `var(--${pokemon.types[0].type.name})`;
    }

    chainSpace.appendChild(link);
    link.appendChild(element);
    element.appendChild(imageContainer);
    element.appendChild(pokemonName);
    imageContainer.appendChild(image);

    if (chain.evolution_details.length != 0) {
        var trigger = document.createElement("div");
        trigger.innerHTML = checkTrigger(chain.evolution_details[chain.evolution_details.length - 1]);

        element.appendChild(trigger);
    }
}

function checkTrigger(details) { //Me niego totalmente a poner todas las formas del Spin, porque no te viene en la pokeapi y como que no pienso hacerlo a mano, sabes tmb hay que quererse un poco... :)
    var TipeTrigger = {
        shed: "Shed",
        other: other(details),
        trade: Trade(details),
        "level-up": levelUp(details),
        spin: "Dar Confite Y Girar Personaje",
        "tower-of-waters": "Ganar Torre De Agua",
        "tower-of-darkness": "Ganar Torre De Oscuridad",
        "three-critical-hits": "Realizar 3 Ataques Críticos",
        "take-damage": "Recibir Mínimo 49 De Daño De Un Golpe",
        "recoil-damage": "Recibir 294 De Daño De El Mismo Sin Ser Debilitado",
        "agile-style-move": `Utilizar ${details.known_move?.name[0].toUpperCase() + details.known_move?.name.slice(1)} 20 Veces En Estilo Rápido`,
        "strong-style-move": `Utilizar ${details.known_move?.name[0].toUpperCase() + details.known_move?.name.slice(1)} 20 Veces En Estilo Fuerte`,
        "use-item": `Usar => ${details.item?.name[0].toUpperCase() + details.item?.name.slice(1)}\n` + (details.gender ? details.gender == 1 ? `Debe Ser Hembra` : `Debe Ser Macho` : ""),
    }

    var trigger = details.trigger.name;

    return TipeTrigger[trigger];
}

function Trade(details) {
    var trigger = "Trade";

    if (details.held_item != null) {
        trigger = `Trade Con ${details.held_item.name[0].toUpperCase() + details.held_item.name.slice(1)} Equipado`;
    } else if (details.trade_species != null) {
        trigger = `Trade Con ${details.trade_species.name[0].toUpperCase() + details.trade_species.name.slice(1)}`;
    }

    return trigger;
}

function levelUp(details) {
    var trigger;

    var stats = {
        "-1": "Ataque < Defensa",
        0: "Ataque == Defensa",
        1: "Ataque > Defensa"
    }

    if (details.min_level != null) {
        trigger = `Nivel => ${details.min_level}\n`;

        details.turn_upside_down == true ? trigger += `Girando La Pantalla\n` : trigger;

        details.needs_overworld_rain == true ? trigger += `Necesita Que Llueva\n` : trigger;

        details.gender ? details.gender == 1 ? trigger += `Debe Ser Hembra\n` : trigger += `Debe Ser Macho\n` : trigger;

        details.party_type ? trigger += `Debe Haber Un Pokemon Tipo ${TiposPokemon[details.party_type.name]} En El Equipo` : trigger;
        
        details.time_of_day.length != 0 ? details.time_of_day == `day` ? trigger += `Debe Ser De Día\n` : trigger += `Debe Ser De Noche\n` : trigger;

        details.relative_physical_stats || details.relative_physical_stats == 0 ? trigger += `${stats[details.relative_physical_stats]}\n` : trigger;
    } else {
        trigger = "Subir Nivel\n"

        details.min_beauty ? trigger += `Belleza => ${details.min_beauty}\n` : trigger;

        details.min_happiness ? trigger += `Felicidad => ${details.min_happiness}\n` : trigger;

        details.known_move_type ? trigger += `Conocer Movimiento Tipo ${TiposPokemon[details.known_move_type.name]}` : trigger;

        details.location ? trigger += `En ${details.location.name[0].toUpperCase() + details.location.name.slice(1)}\n` : trigger;

        details.held_item ? trigger += `Con ${details.held_item.name[0].toUpperCase() + details.held_item.name.slice(1)} Equipado\n` : trigger;

        details.known_move ? trigger += `Conocer => ${details.known_move.name[0].toUpperCase() + details.known_move.name.slice(1)}\n` : trigger;

        details.time_of_day.length != 0 ? details.time_of_day == `day` ? trigger += `Debe Ser De Día\n` : trigger += `Debe Ser De Noche\n` : trigger;

        details.party_species ? trigger += `Debe Estar ${details.party_species.name[0].toUpperCase() + details.party_species.name.slice(1)} En El Equipo` : trigger;
    }

    return trigger;
}

function other(details) {

}

function crearDatos(pokemon) {
    var image = document.getElementsByClassName("image")[0];
    var contentImage = document.getElementById("pokemonimage");

    contentImage.src = pokemon.sprites.other["official-artwork"].front_default;

    image.addEventListener("click", () => changeShiny(pokemon));

    document.getElementsByClassName("name")[0].innerHTML = pokemon.species.name;

    console.log(`Peso => ${pokemon.weight / 10}kg`);

    console.log(`Altura => ${pokemon.height / 10}m`);

    comprobarTipos(pokemon);

    pokemonValues(pokemon);

    document.getElementById("pokemon").innerHTML = pokemon.id;
}

function pokemonValues(pokemon) {
    var listStats = document.getElementById("stats");
    listStats.style.backgroundColor = `var(--${pokemon.types[0].type.name})`;

    var statsProgress = document.getElementsByClassName("stats-progress");
    var statsNumber = document.getElementsByClassName("stats-number");

    for (var i = 0; i < pokemon.stats.length; i++) {
        statsProgress[i].value = pokemon.stats[i].base_stat;
        statsNumber[i].innerHTML = pokemon.stats[i].base_stat;
    }
}

var shiny = false;

function changeShiny(pokemon) {
    var contentImage = document.getElementById("pokemonimage");

    if (shiny) {
        contentImage.setAttribute("src", pokemon.sprites.other["official-artwork"].front_default);
        shiny = false;
    } else {
        contentImage.setAttribute("src", pokemon.sprites.other["official-artwork"].front_shiny);
        shiny = true;
    }
}

function chooseFavicon(pokemon) {
    var head = document.head;

    var href = pokemon.types[0].type.name;

    var favicon = document.createElement("link");
    favicon.rel = "shortcut icon";
    favicon.href = `../img/favicons/${href}.ico`;

    head.appendChild(favicon);
}