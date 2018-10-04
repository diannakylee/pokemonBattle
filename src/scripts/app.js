const app = {}

// Variables
app.URL = "https://pokeapi.co/api/v2/pokemon/"
app.pokemonOne = ""
app.pokemonTwo = ""
app.pokemonOneIndex = ""
app.pokemonTwoIndex = ""
app.pokemonOneStats = []
app.pokemonTwoStats = []
app.pokemonOneTypes = []
app.damageInfo = ""
app.pokemonOneStrengths = []
app.pokemonOneWeaknesses = []
app.pokemonTwoTypes = []
app.json = []

$.getJSON("../public/pokemon.json", function (data) {
    app.json = data;
    console.log(app.json.length); //json output 
});


app.displayPokemon = function(){
    $(".firstPokemon").change(function(){
        app.pokemonOne = $(this).val();
        app.pokemonTypes(app.pokemonOne);
        $(".pokemonOneName").append(`<h3 class="pokemonName">${app.pokemonOne}</h3>`);
        
        
    })
    $(".secondPokemon").on("change", function () {
        app.pokemonTwo = $(this).val();
        $(".pokemonTwoName").append(`<h3 class="pokemonName">${app.pokemonTwo}</h3>`);
        app.pokemon2Types(app.pokemonTwo);
    });
}

app.update1Image = function(){
    $(".oneImage").attr("src", `https://pokeres.bastionbot.org/images/pokemon/${app.pokemonOneIndex}.png`)

}

app.update2Image = function () {
    $(".twoImage").attr("src", `https://pokeres.bastionbot.org/images/pokemon/${app.pokemonTwoIndex}.png`)
}


app.pokemonTypes = function(pokemon){
    return $.ajax({
        url: app.URL + pokemon + "/",
        method: "Get",
        dataType: "JSON",
    }).then((res)=>{
        let results = res;
        app.pokemonOneIndex = results.game_indices[0].game_index;
        app.update1Image();
        results.types.map((type)=>{
            let newType = type.type.name;
            app.pokemonOneTypes.push(newType);       
            $(".type1").append(`<li class="typeName">${newType} </li>`);     
        });
        results.stats.map((stat)=>{
            let statNumber = parseInt(stat.base_stat);
            app.pokemonOneStats.push(statNumber);
            $(".stats1").append(`<li class="stat">${stat.stat.name} : ${stat.base_stat}</li>`); 
        })
        app.pokemonTypesInfo();
    });
};

app.pokemon2Types = function (pokemon) {
    return $.ajax({
        url: app.URL + pokemon + "/",
        method: "Get",
        dataType: "JSON",
    }).then((res) => {
        let results = res;
        app.pokemonTwoIndex = results.game_indices[0].game_index;
        app.update2Image();
        results.types.map((type) => {
            let newType = type.type.name;
            app.pokemonTwoTypes.push(newType);
            $(".type2").append(`<li class="typeName">${newType} </li>`);
        });
        results.stats.map((stat) => {
            let statNumber = parseInt(stat.base_stat);
            app.pokemonTwoStats.push(statNumber);
            $(".stats2").append(`<li class="stat">${stat.stat.name}: ${stat.base_stat}</li>`);
        })
        app.pokemonCompare();
    });
};


app.pokemonTypesInfo = function() {
    if (app.pokemonOneTypes.length > 0) {
        app.pokemonOneTypes.map(function (item) {           
            return $.ajax({
                url: "https://pokeapi.co/api/v2/type/" + item + "/",
                dataType: 'JSON',
                method: "GET",
            }).then((res) => {
                res.damage_relations.double_damage_from.map((item)=>{
                    app.pokemonOneWeaknesses.push(item.name);
                });
                res.damage_relations.double_damage_to.map((item) => {
                    app.pokemonOneStrengths.push(item.name);
                });
            });
        });
        
    };
}

app.compare = function(a,b) {
    var matches = [];
    for (var i = 0; i < a.length; i++) {
        for (var e = 0; e < b.length; e++) {
            if (a[i] === b[e]) matches.push(a[i]);
        }
    }
    return matches;
}

app.pokemonCompare = function () {
    if (app.compare(app.pokemonOneStrengths, app.pokemonTwoTypes).length > 0 && app.compare(app.pokemonOneWeaknesses, app.pokemonTwoTypes).length === 0 ) {
        $(".submit").on("click", function(e){
            e.preventDefault();
            $(".winnerAnnouncement").append(`<h1>${app.pokemonOne} wins against ${app.compare(app.pokemonOneStrengths, app.pokemonTwoTypes)}</h1>`);
        })
    } else if (app.compare(app.pokemonOneStrengths, app.pokemonTwoTypes).length == 0 && app.compare(app.pokemonOneWeaknesses, app.pokemonTwoTypes).length > 0) {
        $(".submit").on("click", function (e) {
            e.preventDefault();
            $(".winnerAnnouncement").append(`<h1>${app.pokemonTwo} wins with ${app.compare(app.pokemonOneWeaknesses, app.pokemonTwoTypes)}</h1>`);
        })
    } else if (app.compare(app.pokemonOneStrengths, app.pokemonTwoTypes).length === 0 && app.compare(app.pokemonOneWeaknesses, app.pokemonTwoTypes).length === 0){
        $(".submit").on("click", function (e) {
            e.preventDefault();
            app.baseStatsCompare();
        })
    }
}

app.baseStatsCompare = function() {
    let pokemonOne = 0
    let pokemonTwo = 0
    if ((app.pokemonOneStats[0] > app.pokemonTwoStats[0]) === true) {
        pokemonOne = pokemonOne + 1 
    } else if (app.pokemonOneStats[0] < app.pokemonTwoStats[0] === true){
        pokemonTwo = pokemonTwo + 1
    } else {
        null
    }

    if (app.pokemonOneStats[1] > app.pokemonTwoStats[1] === true) {
        pokemonOne = pokemonOne + 1
    } else if (app.pokemonOneStats[1] < app.pokemonTwoStats[1] === true) {
        pokemonTwo = pokemonTwo + 1
    } else {
        null
    }

    if (app.pokemonOneStats[2] > app.pokemonTwoStats[2] === true) {
        pokemonOne = pokemonOne + 1
    } else if (app.pokemonOneStats[2] < app.pokemonTwoStats[2] === true) {
        pokemonTwo = pokemonTwo + 1
    } else {
        null
    }

    if (app.pokemonOneStats[3] > app.pokemonTwoStats[3]) {
        pokemonOne = pokemonOne + 1
    } else if (app.pokemonOneStats[3] < app.pokemonTwoStats[3]) {
        pokemonTwo = pokemonTwo + 1
    } else {
        null
    }

    if (app.pokemonOneStats[4] > app.pokemonTwoStats[4]) {
        pokemonOne = pokemonOne + 1
    } else if (app.pokemonOneStats[4] < app.pokemonTwoStats[4]) {
        pokemonTwo = pokemonTwo + 1
    } else {
        null
    }

    if (app.pokemonOneStats[5] > app.pokemonTwoStats[5]) {
        pokemonOne = pokemonOne + 1
    } else if (app.pokemonOneStats[5] < app.pokemonTwoStats[5]) {
        pokemonTwo = pokemonTwo + 1
    } else {
        null
    }
    
    if (pokemonOne > pokemonTwo) {
        $(".winnerAnnouncement").append(`<h1>${app.pokemonOne} Wins by Base Stats</h1>`);
    } else if (pokemonOne < pokemonTwo) {
        $(".winnerAnnouncement").append(`<h1>${app.pokemonTwo} Wins by Base Stats</h1>`);
    } else {
        $(".winnerAnnouncement").append(`<h1>${app.pokemonOne} Wins by default</h1>`);
    }
}

app.resetPage = function(){
    $(".reset").on('click', function(){
        location.reload();
    })
}

// autocomplete 

app.autocomplete = function () {
    var options = {
        url: "public/pokemon.json",
        getValue: "name",
        list: {
            match: {
                enabled: true
            }
        }
    };
    $(".secondPokemon").easyAutocomplete(options);
    $(".firstPokemon").easyAutocomplete(options);
}

app.init = function (){
    app.autocomplete();
    app.displayPokemon();
    app.pokemonTypesInfo();
};

$(function () {
    app.init();
});

