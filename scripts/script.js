//var pokemons = ["Charmander", "Bulbasaur", "Squirtle", "Pikachu"];
var pokemons = [];


/* function comparar ( a, b ){ return a - b; }
arr.sort( comparar );  // [ 1, 5, 40, 200 ]

NO BORRAR, ES PARA ORDENAR (PARA ACORDARME PARA HACERLO)

*/

async function traerPokemon() { //NEVER TOUCH
    for(var i = 0; i < 151;i++){
        var peticion = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}/`);
        var dato = await peticion.json();
        await pokemons.push(dato);
        crearPokemon(dato);
    }
}




//var listaPokemons = document.createElement("div");

//listaPokemons.classList.add("demo");
console.log(pokemons[0]);

//document.appendChild(listaPokemons);

//var listaPokemons = document.getElementById("demo");

function iniciarPokedex() {
    for(var i = 0; i < 151;i++){
        crearPokemon(pokemons[i + 1]);
    }
}

function buscarPokemons(valor) {

    var divs = "";

    for(var i = 0; i < pokemons.length;i++){
        if(valor == undefined || pokemons[i].name.toUpperCase().includes(valor.toUpperCase())){
            divs += "<div class='poke'><a href='html/pokemon?numero=" + pokemons[i].id + "'><div class='image'><img src='" + pokemons[i].sprites.front_default + "' alt='Lo siento el pokemon: " + pokemons[i].name + " no está cargado'></div><div class='name'>" + pokemons[i].name + "</div> <div class='number'>#" + pokemons[i].id.toString().padStart(3, 0) + "</div> <div class='types'><div class='type'>Tipo</div></div> </a></div>";
        }
    }
/*
    for(var i = 0; i < pokemons.length;i++){
        if(valor == undefined || pokemons[i].name.toUpperCase().includes(valor.toUpperCase())){
           crearPokemon(pokemons[i]);
        }  
    }*/

    /*
    if (divs === "") {
        listaPokemons.innerHTML = "<div class='alert'>¡No se encontraron pokémons!</div>";
    }else{
        listaPokemons.innerHTML = divs;
    }*/

    if (divs === "") {
        document.getElementById("demo").innerHTML = "<div class='alert'>¡No se encontraron pokémons!</div>";
    }else{
        document.getElementById("demo").innerHTML = divs;
    }
}

/*
function datosPokemon(){
    var url = new URLSearchParams(window.location.search);

    var numero = url.get("numero");

    var todo = document.createElement("div");
    todo.innerHTML = `hola ${numero}`;
    document.appendChild(todo);
}*/


function crearPokemon(pokemon){
    var bicho = document.createElement("div");
    bicho.classList.add("poke");

    var enlace = document.createElement("a");
    enlace.href = `html/pokemon?numero=${pokemon.id}`

    var divImagen = document.createElement("div");
    divImagen.classList.add("image");

    var imagen = document.createElement("img");
    imagen.src = pokemon.sprites.front_default;
    imagen.alt = "Lo siento, el pokemon no ha sido encontrado :(";

    var nombre = document.createElement("div");
    nombre.classList.add("name");
    nombre.innerHTML = pokemon.name;

    var numero = document.createElement("div");
    numero.classList.add("number");
    numero.innerHTML = '#' + pokemon.id.toString().padStart(3, 0);

    var tipos = document.createElement("div");

    document.getElementById("demo").appendChild(bicho);
    bicho.appendChild(enlace);
    enlace.appendChild(divImagen);
    enlace.appendChild(nombre);
    enlace.appendChild(numero);
    enlace.appendChild(tipos);
    divImagen.appendChild(imagen);
}