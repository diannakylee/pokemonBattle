(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var app = {}; // Variables

app.URL = "https://pokeapi.co/api/v2/pokemon/";
app.pokemonOne = "";
app.pokemonTwo = "";
app.pokemonOneIndex = "";
app.pokemonTwoIndex = "";
app.pokemonOneStats = [];
app.pokemonTwoStats = [];
app.pokemonOneTypes = [];
app.damageInfo = "";
app.pokemonOneStrengths = [];
app.pokemonOneWeaknesses = [];
app.pokemonTwoTypes = [];
app.json = [];
$.getJSON("../public/pokemon.json", function (data) {
  app.json = data;
  console.log(app.json.length); //json output 
});

app.displayPokemon = function () {
  $(".firstPokemon").change(function () {
    app.pokemonOne = $(this).val();
    app.pokemonTypes(app.pokemonOne);
    $(".pokemonOneName").append("<h3 class=\"pokemonName\">".concat(app.pokemonOne, "</h3>"));
  });
  $(".secondPokemon").on("change", function () {
    app.pokemonTwo = $(this).val();
    $(".pokemonTwoName").append("<h3 class=\"pokemonName\">".concat(app.pokemonTwo, "</h3>"));
    app.pokemon2Types(app.pokemonTwo);
  });
};

app.update1Image = function () {
  $(".oneImage").attr("src", "https://pokeres.bastionbot.org/images/pokemon/".concat(app.pokemonOneIndex, ".png"));
};

app.update2Image = function () {
  $(".twoImage").attr("src", "https://pokeres.bastionbot.org/images/pokemon/".concat(app.pokemonTwoIndex, ".png"));
};

app.pokemonTypes = function (pokemon) {
  return $.ajax({
    url: app.URL + pokemon + "/",
    method: "Get",
    dataType: "JSON"
  }).then(function (res) {
    var results = res;
    app.pokemonOneIndex = results.game_indices[0].game_index;
    app.update1Image();
    results.types.map(function (type) {
      var newType = type.type.name;
      app.pokemonOneTypes.push(newType);
      $(".type1").append("<li class=\"typeName\">".concat(newType, " </li>"));
    });
    results.stats.map(function (stat) {
      var statNumber = parseInt(stat.base_stat);
      app.pokemonOneStats.push(statNumber);
      $(".stats1").append("<li class=\"stat\">".concat(stat.stat.name, " : ").concat(stat.base_stat, "</li>"));
    });
    app.pokemonTypesInfo();
  });
};

app.pokemon2Types = function (pokemon) {
  return $.ajax({
    url: app.URL + pokemon + "/",
    method: "Get",
    dataType: "JSON"
  }).then(function (res) {
    var results = res;
    app.pokemonTwoIndex = results.game_indices[0].game_index;
    app.update2Image();
    results.types.map(function (type) {
      var newType = type.type.name;
      app.pokemonTwoTypes.push(newType);
      $(".type2").append("<li class=\"typeName\">".concat(newType, " </li>"));
    });
    results.stats.map(function (stat) {
      var statNumber = parseInt(stat.base_stat);
      app.pokemonTwoStats.push(statNumber);
      $(".stats2").append("<li class=\"stat\">".concat(stat.stat.name, ": ").concat(stat.base_stat, "</li>"));
    });
    app.pokemonCompare();
  });
};

app.pokemonTypesInfo = function () {
  if (app.pokemonOneTypes.length > 0) {
    app.pokemonOneTypes.map(function (item) {
      return $.ajax({
        url: "https://pokeapi.co/api/v2/type/" + item + "/",
        dataType: 'JSON',
        method: "GET"
      }).then(function (res) {
        res.damage_relations.double_damage_from.map(function (item) {
          app.pokemonOneWeaknesses.push(item.name);
        });
        res.damage_relations.double_damage_to.map(function (item) {
          app.pokemonOneStrengths.push(item.name);
        });
      });
    });
  }

  ;
};

app.compare = function (a, b) {
  var matches = [];

  for (var i = 0; i < a.length; i++) {
    for (var e = 0; e < b.length; e++) {
      if (a[i] === b[e]) matches.push(a[i]);
    }
  }

  return matches;
};

app.pokemonCompare = function () {
  if (app.compare(app.pokemonOneStrengths, app.pokemonTwoTypes).length > 0 && app.compare(app.pokemonOneWeaknesses, app.pokemonTwoTypes).length === 0) {
    $(".submit").on("click", function (e) {
      e.preventDefault();
      $(".winnerAnnouncement").append("<h1>".concat(app.pokemonOne, " Wins against ").concat(app.compare(app.pokemonOneStrengths, app.pokemonTwoTypes), "</h1>"));
    });
  } else if (app.compare(app.pokemonOneStrengths, app.pokemonTwoTypes).length == 0 && app.compare(app.pokemonOneWeaknesses, app.pokemonTwoTypes).length > 0) {
    $(".submit").on("click", function (e) {
      e.preventDefault();
      $(".winnerAnnouncement").append("<h1>".concat(app.pokemonTwo, " Wins against ").concat(app.compare(app.pokemonOneWeaknesses, app.pokemonTwoTypes), "</h1>"));
    });
  } else if (app.compare(app.pokemonOneStrengths, app.pokemonTwoTypes).length === 0 && app.compare(app.pokemonOneWeaknesses, app.pokemonTwoTypes).length === 0) {
    $(".submit").on("click", function (e) {
      e.preventDefault();
      app.baseStatsCompare();
    });
  }
};

app.baseStatsCompare = function () {
  var pokemonOne = 0;
  var pokemonTwo = 0;

  if (app.pokemonOneStats[0] > app.pokemonTwoStats[0] === true) {
    pokemonOne = pokemonOne + 1;
  } else if (app.pokemonOneStats[0] < app.pokemonTwoStats[0] === true) {
    pokemonTwo = pokemonTwo + 1;
  } else {
    null;
  }

  if (app.pokemonOneStats[1] > app.pokemonTwoStats[1] === true) {
    pokemonOne = pokemonOne + 1;
  } else if (app.pokemonOneStats[1] < app.pokemonTwoStats[1] === true) {
    pokemonTwo = pokemonTwo + 1;
  } else {
    null;
  }

  if (app.pokemonOneStats[2] > app.pokemonTwoStats[2] === true) {
    pokemonOne = pokemonOne + 1;
  } else if (app.pokemonOneStats[2] < app.pokemonTwoStats[2] === true) {
    pokemonTwo = pokemonTwo + 1;
  } else {
    null;
  }

  if (app.pokemonOneStats[3] > app.pokemonTwoStats[3]) {
    pokemonOne = pokemonOne + 1;
  } else if (app.pokemonOneStats[3] < app.pokemonTwoStats[3]) {
    pokemonTwo = pokemonTwo + 1;
  } else {
    null;
  }

  if (app.pokemonOneStats[4] > app.pokemonTwoStats[4]) {
    pokemonOne = pokemonOne + 1;
  } else if (app.pokemonOneStats[4] < app.pokemonTwoStats[4]) {
    pokemonTwo = pokemonTwo + 1;
  } else {
    null;
  }

  if (app.pokemonOneStats[5] > app.pokemonTwoStats[5]) {
    pokemonOne = pokemonOne + 1;
  } else if (app.pokemonOneStats[5] < app.pokemonTwoStats[5]) {
    pokemonTwo = pokemonTwo + 1;
  } else {
    null;
  }

  if (pokemonOne > pokemonTwo) {
    $(".winnerAnnouncement").append("<h1>".concat(app.pokemonOne, " Wins by Base Stats</h1>"));
  } else if (pokemonOne < pokemonTwo) {
    $(".winnerAnnouncement").append("<h1>".concat(app.pokemonTwo, " Wins by Base Stats</h1>"));
  } else {
    $(".winnerAnnouncement").append("<h1>".concat(app.pokemonOne, " Wins by default</h1>"));
  }
};

app.resetPage = function () {
  $(".reset").on('click', function () {
    location.reload();
  });
}; // autocomplete 


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
};

app.init = function () {
  app.autocomplete();
  app.displayPokemon();
  app.pokemonTypesInfo();
};

$(function () {
  app.init();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sR0FBRyxHQUFHLEVBQVosQyxDQUVBOztBQUNBLEdBQUcsQ0FBQyxHQUFKLEdBQVUsb0NBQVY7QUFDQSxHQUFHLENBQUMsVUFBSixHQUFpQixFQUFqQjtBQUNBLEdBQUcsQ0FBQyxVQUFKLEdBQWlCLEVBQWpCO0FBQ0EsR0FBRyxDQUFDLGVBQUosR0FBc0IsRUFBdEI7QUFDQSxHQUFHLENBQUMsZUFBSixHQUFzQixFQUF0QjtBQUNBLEdBQUcsQ0FBQyxlQUFKLEdBQXNCLEVBQXRCO0FBQ0EsR0FBRyxDQUFDLGVBQUosR0FBc0IsRUFBdEI7QUFDQSxHQUFHLENBQUMsZUFBSixHQUFzQixFQUF0QjtBQUNBLEdBQUcsQ0FBQyxVQUFKLEdBQWlCLEVBQWpCO0FBQ0EsR0FBRyxDQUFDLG1CQUFKLEdBQTBCLEVBQTFCO0FBQ0EsR0FBRyxDQUFDLG9CQUFKLEdBQTJCLEVBQTNCO0FBQ0EsR0FBRyxDQUFDLGVBQUosR0FBc0IsRUFBdEI7QUFDQSxHQUFHLENBQUMsSUFBSixHQUFXLEVBQVg7QUFFQSxDQUFDLENBQUMsT0FBRixDQUFVLHdCQUFWLEVBQW9DLFVBQVUsSUFBVixFQUFnQjtBQUNoRCxFQUFBLEdBQUcsQ0FBQyxJQUFKLEdBQVcsSUFBWDtBQUNBLEVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFHLENBQUMsSUFBSixDQUFTLE1BQXJCLEVBRmdELENBRWxCO0FBQ2pDLENBSEQ7O0FBTUEsR0FBRyxDQUFDLGNBQUosR0FBcUIsWUFBVTtBQUMzQixFQUFBLENBQUMsQ0FBQyxlQUFELENBQUQsQ0FBbUIsTUFBbkIsQ0FBMEIsWUFBVTtBQUNoQyxJQUFBLEdBQUcsQ0FBQyxVQUFKLEdBQWlCLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUSxHQUFSLEVBQWpCO0FBQ0EsSUFBQSxHQUFHLENBQUMsWUFBSixDQUFpQixHQUFHLENBQUMsVUFBckI7QUFDQSxJQUFBLENBQUMsQ0FBQyxpQkFBRCxDQUFELENBQXFCLE1BQXJCLHFDQUF1RCxHQUFHLENBQUMsVUFBM0Q7QUFHSCxHQU5EO0FBT0EsRUFBQSxDQUFDLENBQUMsZ0JBQUQsQ0FBRCxDQUFvQixFQUFwQixDQUF1QixRQUF2QixFQUFpQyxZQUFZO0FBQ3pDLElBQUEsR0FBRyxDQUFDLFVBQUosR0FBaUIsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRLEdBQVIsRUFBakI7QUFDQSxJQUFBLENBQUMsQ0FBQyxpQkFBRCxDQUFELENBQXFCLE1BQXJCLHFDQUF1RCxHQUFHLENBQUMsVUFBM0Q7QUFDQSxJQUFBLEdBQUcsQ0FBQyxhQUFKLENBQWtCLEdBQUcsQ0FBQyxVQUF0QjtBQUNILEdBSkQ7QUFLSCxDQWJEOztBQWVBLEdBQUcsQ0FBQyxZQUFKLEdBQW1CLFlBQVU7QUFDekIsRUFBQSxDQUFDLENBQUMsV0FBRCxDQUFELENBQWUsSUFBZixDQUFvQixLQUFwQiwwREFBNEUsR0FBRyxDQUFDLGVBQWhGO0FBRUgsQ0FIRDs7QUFLQSxHQUFHLENBQUMsWUFBSixHQUFtQixZQUFZO0FBQzNCLEVBQUEsQ0FBQyxDQUFDLFdBQUQsQ0FBRCxDQUFlLElBQWYsQ0FBb0IsS0FBcEIsMERBQTRFLEdBQUcsQ0FBQyxlQUFoRjtBQUNILENBRkQ7O0FBS0EsR0FBRyxDQUFDLFlBQUosR0FBbUIsVUFBUyxPQUFULEVBQWlCO0FBQ2hDLFNBQU8sQ0FBQyxDQUFDLElBQUYsQ0FBTztBQUNWLElBQUEsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFKLEdBQVUsT0FBVixHQUFvQixHQURmO0FBRVYsSUFBQSxNQUFNLEVBQUUsS0FGRTtBQUdWLElBQUEsUUFBUSxFQUFFO0FBSEEsR0FBUCxFQUlKLElBSkksQ0FJQyxVQUFDLEdBQUQsRUFBTztBQUNYLFFBQUksT0FBTyxHQUFHLEdBQWQ7QUFDQSxJQUFBLEdBQUcsQ0FBQyxlQUFKLEdBQXNCLE9BQU8sQ0FBQyxZQUFSLENBQXFCLENBQXJCLEVBQXdCLFVBQTlDO0FBQ0EsSUFBQSxHQUFHLENBQUMsWUFBSjtBQUNBLElBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxHQUFkLENBQWtCLFVBQUMsSUFBRCxFQUFRO0FBQ3RCLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBeEI7QUFDQSxNQUFBLEdBQUcsQ0FBQyxlQUFKLENBQW9CLElBQXBCLENBQXlCLE9BQXpCO0FBQ0EsTUFBQSxDQUFDLENBQUMsUUFBRCxDQUFELENBQVksTUFBWixrQ0FBMkMsT0FBM0M7QUFDSCxLQUpEO0FBS0EsSUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLEdBQWQsQ0FBa0IsVUFBQyxJQUFELEVBQVE7QUFDdEIsVUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFOLENBQXpCO0FBQ0EsTUFBQSxHQUFHLENBQUMsZUFBSixDQUFvQixJQUFwQixDQUF5QixVQUF6QjtBQUNBLE1BQUEsQ0FBQyxDQUFDLFNBQUQsQ0FBRCxDQUFhLE1BQWIsOEJBQXdDLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBbEQsZ0JBQTRELElBQUksQ0FBQyxTQUFqRTtBQUNILEtBSkQ7QUFLQSxJQUFBLEdBQUcsQ0FBQyxnQkFBSjtBQUNILEdBbkJNLENBQVA7QUFvQkgsQ0FyQkQ7O0FBdUJBLEdBQUcsQ0FBQyxhQUFKLEdBQW9CLFVBQVUsT0FBVixFQUFtQjtBQUNuQyxTQUFPLENBQUMsQ0FBQyxJQUFGLENBQU87QUFDVixJQUFBLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBSixHQUFVLE9BQVYsR0FBb0IsR0FEZjtBQUVWLElBQUEsTUFBTSxFQUFFLEtBRkU7QUFHVixJQUFBLFFBQVEsRUFBRTtBQUhBLEdBQVAsRUFJSixJQUpJLENBSUMsVUFBQyxHQUFELEVBQVM7QUFDYixRQUFJLE9BQU8sR0FBRyxHQUFkO0FBQ0EsSUFBQSxHQUFHLENBQUMsZUFBSixHQUFzQixPQUFPLENBQUMsWUFBUixDQUFxQixDQUFyQixFQUF3QixVQUE5QztBQUNBLElBQUEsR0FBRyxDQUFDLFlBQUo7QUFDQSxJQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsR0FBZCxDQUFrQixVQUFDLElBQUQsRUFBVTtBQUN4QixVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQXhCO0FBQ0EsTUFBQSxHQUFHLENBQUMsZUFBSixDQUFvQixJQUFwQixDQUF5QixPQUF6QjtBQUNBLE1BQUEsQ0FBQyxDQUFDLFFBQUQsQ0FBRCxDQUFZLE1BQVosa0NBQTJDLE9BQTNDO0FBQ0gsS0FKRDtBQUtBLElBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxHQUFkLENBQWtCLFVBQUMsSUFBRCxFQUFVO0FBQ3hCLFVBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBTixDQUF6QjtBQUNBLE1BQUEsR0FBRyxDQUFDLGVBQUosQ0FBb0IsSUFBcEIsQ0FBeUIsVUFBekI7QUFDQSxNQUFBLENBQUMsQ0FBQyxTQUFELENBQUQsQ0FBYSxNQUFiLDhCQUF3QyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQWxELGVBQTJELElBQUksQ0FBQyxTQUFoRTtBQUNILEtBSkQ7QUFLQSxJQUFBLEdBQUcsQ0FBQyxjQUFKO0FBQ0gsR0FuQk0sQ0FBUDtBQW9CSCxDQXJCRDs7QUF3QkEsR0FBRyxDQUFDLGdCQUFKLEdBQXVCLFlBQVc7QUFDOUIsTUFBSSxHQUFHLENBQUMsZUFBSixDQUFvQixNQUFwQixHQUE2QixDQUFqQyxFQUFvQztBQUNoQyxJQUFBLEdBQUcsQ0FBQyxlQUFKLENBQW9CLEdBQXBCLENBQXdCLFVBQVUsSUFBVixFQUFnQjtBQUNwQyxhQUFPLENBQUMsQ0FBQyxJQUFGLENBQU87QUFDVixRQUFBLEdBQUcsRUFBRSxvQ0FBb0MsSUFBcEMsR0FBMkMsR0FEdEM7QUFFVixRQUFBLFFBQVEsRUFBRSxNQUZBO0FBR1YsUUFBQSxNQUFNLEVBQUU7QUFIRSxPQUFQLEVBSUosSUFKSSxDQUlDLFVBQUMsR0FBRCxFQUFTO0FBQ2IsUUFBQSxHQUFHLENBQUMsZ0JBQUosQ0FBcUIsa0JBQXJCLENBQXdDLEdBQXhDLENBQTRDLFVBQUMsSUFBRCxFQUFRO0FBQ2hELFVBQUEsR0FBRyxDQUFDLG9CQUFKLENBQXlCLElBQXpCLENBQThCLElBQUksQ0FBQyxJQUFuQztBQUNILFNBRkQ7QUFHQSxRQUFBLEdBQUcsQ0FBQyxnQkFBSixDQUFxQixnQkFBckIsQ0FBc0MsR0FBdEMsQ0FBMEMsVUFBQyxJQUFELEVBQVU7QUFDaEQsVUFBQSxHQUFHLENBQUMsbUJBQUosQ0FBd0IsSUFBeEIsQ0FBNkIsSUFBSSxDQUFDLElBQWxDO0FBQ0gsU0FGRDtBQUdILE9BWE0sQ0FBUDtBQVlILEtBYkQ7QUFlSDs7QUFBQTtBQUNKLENBbEJEOztBQW9CQSxHQUFHLENBQUMsT0FBSixHQUFjLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYztBQUN4QixNQUFJLE9BQU8sR0FBRyxFQUFkOztBQUNBLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQXRCLEVBQThCLENBQUMsRUFBL0IsRUFBbUM7QUFDL0IsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBdEIsRUFBOEIsQ0FBQyxFQUEvQixFQUFtQztBQUMvQixVQUFJLENBQUMsQ0FBQyxDQUFELENBQUQsS0FBUyxDQUFDLENBQUMsQ0FBRCxDQUFkLEVBQW1CLE9BQU8sQ0FBQyxJQUFSLENBQWEsQ0FBQyxDQUFDLENBQUQsQ0FBZDtBQUN0QjtBQUNKOztBQUNELFNBQU8sT0FBUDtBQUNILENBUkQ7O0FBVUEsR0FBRyxDQUFDLGNBQUosR0FBcUIsWUFBWTtBQUM3QixNQUFJLEdBQUcsQ0FBQyxPQUFKLENBQVksR0FBRyxDQUFDLG1CQUFoQixFQUFxQyxHQUFHLENBQUMsZUFBekMsRUFBMEQsTUFBMUQsR0FBbUUsQ0FBbkUsSUFBd0UsR0FBRyxDQUFDLE9BQUosQ0FBWSxHQUFHLENBQUMsb0JBQWhCLEVBQXNDLEdBQUcsQ0FBQyxlQUExQyxFQUEyRCxNQUEzRCxLQUFzRSxDQUFsSixFQUFzSjtBQUNsSixJQUFBLENBQUMsQ0FBQyxTQUFELENBQUQsQ0FBYSxFQUFiLENBQWdCLE9BQWhCLEVBQXlCLFVBQVMsQ0FBVCxFQUFXO0FBQ2hDLE1BQUEsQ0FBQyxDQUFDLGNBQUY7QUFDQSxNQUFBLENBQUMsQ0FBQyxxQkFBRCxDQUFELENBQXlCLE1BQXpCLGVBQXVDLEdBQUcsQ0FBQyxVQUEzQywyQkFBc0UsR0FBRyxDQUFDLE9BQUosQ0FBWSxHQUFHLENBQUMsbUJBQWhCLEVBQXFDLEdBQUcsQ0FBQyxlQUF6QyxDQUF0RTtBQUNILEtBSEQ7QUFJSCxHQUxELE1BS08sSUFBSSxHQUFHLENBQUMsT0FBSixDQUFZLEdBQUcsQ0FBQyxtQkFBaEIsRUFBcUMsR0FBRyxDQUFDLGVBQXpDLEVBQTBELE1BQTFELElBQW9FLENBQXBFLElBQXlFLEdBQUcsQ0FBQyxPQUFKLENBQVksR0FBRyxDQUFDLG9CQUFoQixFQUFzQyxHQUFHLENBQUMsZUFBMUMsRUFBMkQsTUFBM0QsR0FBb0UsQ0FBakosRUFBb0o7QUFDdkosSUFBQSxDQUFDLENBQUMsU0FBRCxDQUFELENBQWEsRUFBYixDQUFnQixPQUFoQixFQUF5QixVQUFVLENBQVYsRUFBYTtBQUNsQyxNQUFBLENBQUMsQ0FBQyxjQUFGO0FBQ0EsTUFBQSxDQUFDLENBQUMscUJBQUQsQ0FBRCxDQUF5QixNQUF6QixlQUF1QyxHQUFHLENBQUMsVUFBM0MsMkJBQXNFLEdBQUcsQ0FBQyxPQUFKLENBQVksR0FBRyxDQUFDLG9CQUFoQixFQUFzQyxHQUFHLENBQUMsZUFBMUMsQ0FBdEU7QUFDSCxLQUhEO0FBSUgsR0FMTSxNQUtBLElBQUksR0FBRyxDQUFDLE9BQUosQ0FBWSxHQUFHLENBQUMsbUJBQWhCLEVBQXFDLEdBQUcsQ0FBQyxlQUF6QyxFQUEwRCxNQUExRCxLQUFxRSxDQUFyRSxJQUEwRSxHQUFHLENBQUMsT0FBSixDQUFZLEdBQUcsQ0FBQyxvQkFBaEIsRUFBc0MsR0FBRyxDQUFDLGVBQTFDLEVBQTJELE1BQTNELEtBQXNFLENBQXBKLEVBQXNKO0FBQ3pKLElBQUEsQ0FBQyxDQUFDLFNBQUQsQ0FBRCxDQUFhLEVBQWIsQ0FBZ0IsT0FBaEIsRUFBeUIsVUFBVSxDQUFWLEVBQWE7QUFDbEMsTUFBQSxDQUFDLENBQUMsY0FBRjtBQUNBLE1BQUEsR0FBRyxDQUFDLGdCQUFKO0FBQ0gsS0FIRDtBQUlIO0FBQ0osQ0FqQkQ7O0FBbUJBLEdBQUcsQ0FBQyxnQkFBSixHQUF1QixZQUFXO0FBQzlCLE1BQUksVUFBVSxHQUFHLENBQWpCO0FBQ0EsTUFBSSxVQUFVLEdBQUcsQ0FBakI7O0FBQ0EsTUFBSyxHQUFHLENBQUMsZUFBSixDQUFvQixDQUFwQixJQUF5QixHQUFHLENBQUMsZUFBSixDQUFvQixDQUFwQixDQUExQixLQUFzRCxJQUExRCxFQUFnRTtBQUM1RCxJQUFBLFVBQVUsR0FBRyxVQUFVLEdBQUcsQ0FBMUI7QUFDSCxHQUZELE1BRU8sSUFBSSxHQUFHLENBQUMsZUFBSixDQUFvQixDQUFwQixJQUF5QixHQUFHLENBQUMsZUFBSixDQUFvQixDQUFwQixDQUF6QixLQUFvRCxJQUF4RCxFQUE2RDtBQUNoRSxJQUFBLFVBQVUsR0FBRyxVQUFVLEdBQUcsQ0FBMUI7QUFDSCxHQUZNLE1BRUE7QUFDSDtBQUNIOztBQUVELE1BQUksR0FBRyxDQUFDLGVBQUosQ0FBb0IsQ0FBcEIsSUFBeUIsR0FBRyxDQUFDLGVBQUosQ0FBb0IsQ0FBcEIsQ0FBekIsS0FBb0QsSUFBeEQsRUFBOEQ7QUFDMUQsSUFBQSxVQUFVLEdBQUcsVUFBVSxHQUFHLENBQTFCO0FBQ0gsR0FGRCxNQUVPLElBQUksR0FBRyxDQUFDLGVBQUosQ0FBb0IsQ0FBcEIsSUFBeUIsR0FBRyxDQUFDLGVBQUosQ0FBb0IsQ0FBcEIsQ0FBekIsS0FBb0QsSUFBeEQsRUFBOEQ7QUFDakUsSUFBQSxVQUFVLEdBQUcsVUFBVSxHQUFHLENBQTFCO0FBQ0gsR0FGTSxNQUVBO0FBQ0g7QUFDSDs7QUFFRCxNQUFJLEdBQUcsQ0FBQyxlQUFKLENBQW9CLENBQXBCLElBQXlCLEdBQUcsQ0FBQyxlQUFKLENBQW9CLENBQXBCLENBQXpCLEtBQW9ELElBQXhELEVBQThEO0FBQzFELElBQUEsVUFBVSxHQUFHLFVBQVUsR0FBRyxDQUExQjtBQUNILEdBRkQsTUFFTyxJQUFJLEdBQUcsQ0FBQyxlQUFKLENBQW9CLENBQXBCLElBQXlCLEdBQUcsQ0FBQyxlQUFKLENBQW9CLENBQXBCLENBQXpCLEtBQW9ELElBQXhELEVBQThEO0FBQ2pFLElBQUEsVUFBVSxHQUFHLFVBQVUsR0FBRyxDQUExQjtBQUNILEdBRk0sTUFFQTtBQUNIO0FBQ0g7O0FBRUQsTUFBSSxHQUFHLENBQUMsZUFBSixDQUFvQixDQUFwQixJQUF5QixHQUFHLENBQUMsZUFBSixDQUFvQixDQUFwQixDQUE3QixFQUFxRDtBQUNqRCxJQUFBLFVBQVUsR0FBRyxVQUFVLEdBQUcsQ0FBMUI7QUFDSCxHQUZELE1BRU8sSUFBSSxHQUFHLENBQUMsZUFBSixDQUFvQixDQUFwQixJQUF5QixHQUFHLENBQUMsZUFBSixDQUFvQixDQUFwQixDQUE3QixFQUFxRDtBQUN4RCxJQUFBLFVBQVUsR0FBRyxVQUFVLEdBQUcsQ0FBMUI7QUFDSCxHQUZNLE1BRUE7QUFDSDtBQUNIOztBQUVELE1BQUksR0FBRyxDQUFDLGVBQUosQ0FBb0IsQ0FBcEIsSUFBeUIsR0FBRyxDQUFDLGVBQUosQ0FBb0IsQ0FBcEIsQ0FBN0IsRUFBcUQ7QUFDakQsSUFBQSxVQUFVLEdBQUcsVUFBVSxHQUFHLENBQTFCO0FBQ0gsR0FGRCxNQUVPLElBQUksR0FBRyxDQUFDLGVBQUosQ0FBb0IsQ0FBcEIsSUFBeUIsR0FBRyxDQUFDLGVBQUosQ0FBb0IsQ0FBcEIsQ0FBN0IsRUFBcUQ7QUFDeEQsSUFBQSxVQUFVLEdBQUcsVUFBVSxHQUFHLENBQTFCO0FBQ0gsR0FGTSxNQUVBO0FBQ0g7QUFDSDs7QUFFRCxNQUFJLEdBQUcsQ0FBQyxlQUFKLENBQW9CLENBQXBCLElBQXlCLEdBQUcsQ0FBQyxlQUFKLENBQW9CLENBQXBCLENBQTdCLEVBQXFEO0FBQ2pELElBQUEsVUFBVSxHQUFHLFVBQVUsR0FBRyxDQUExQjtBQUNILEdBRkQsTUFFTyxJQUFJLEdBQUcsQ0FBQyxlQUFKLENBQW9CLENBQXBCLElBQXlCLEdBQUcsQ0FBQyxlQUFKLENBQW9CLENBQXBCLENBQTdCLEVBQXFEO0FBQ3hELElBQUEsVUFBVSxHQUFHLFVBQVUsR0FBRyxDQUExQjtBQUNILEdBRk0sTUFFQTtBQUNIO0FBQ0g7O0FBRUQsTUFBSSxVQUFVLEdBQUcsVUFBakIsRUFBNkI7QUFDekIsSUFBQSxDQUFDLENBQUMscUJBQUQsQ0FBRCxDQUF5QixNQUF6QixlQUF1QyxHQUFHLENBQUMsVUFBM0M7QUFDSCxHQUZELE1BRU8sSUFBSSxVQUFVLEdBQUcsVUFBakIsRUFBNkI7QUFDaEMsSUFBQSxDQUFDLENBQUMscUJBQUQsQ0FBRCxDQUF5QixNQUF6QixlQUF1QyxHQUFHLENBQUMsVUFBM0M7QUFDSCxHQUZNLE1BRUE7QUFDSCxJQUFBLENBQUMsQ0FBQyxxQkFBRCxDQUFELENBQXlCLE1BQXpCLGVBQXVDLEdBQUcsQ0FBQyxVQUEzQztBQUNIO0FBQ0osQ0ExREQ7O0FBNERBLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLFlBQVU7QUFDdEIsRUFBQSxDQUFDLENBQUMsUUFBRCxDQUFELENBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsWUFBVTtBQUM5QixJQUFBLFFBQVEsQ0FBQyxNQUFUO0FBQ0gsR0FGRDtBQUdILENBSkQsQyxDQU1BOzs7QUFFQSxHQUFHLENBQUMsWUFBSixHQUFtQixZQUFZO0FBQzNCLE1BQUksT0FBTyxHQUFHO0FBQ1YsSUFBQSxHQUFHLEVBQUUscUJBREs7QUFFVixJQUFBLFFBQVEsRUFBRSxNQUZBO0FBR1YsSUFBQSxJQUFJLEVBQUU7QUFDRixNQUFBLEtBQUssRUFBRTtBQUNILFFBQUEsT0FBTyxFQUFFO0FBRE47QUFETDtBQUhJLEdBQWQ7QUFTQSxFQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CLGdCQUFwQixDQUFxQyxPQUFyQztBQUNBLEVBQUEsQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQixnQkFBbkIsQ0FBb0MsT0FBcEM7QUFDSCxDQVpEOztBQWNBLEdBQUcsQ0FBQyxJQUFKLEdBQVcsWUFBVztBQUNsQixFQUFBLEdBQUcsQ0FBQyxZQUFKO0FBQ0EsRUFBQSxHQUFHLENBQUMsY0FBSjtBQUNBLEVBQUEsR0FBRyxDQUFDLGdCQUFKO0FBQ0gsQ0FKRDs7QUFNQSxDQUFDLENBQUMsWUFBWTtBQUNWLEVBQUEsR0FBRyxDQUFDLElBQUo7QUFDSCxDQUZBLENBQUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBhcHAgPSB7fVxuXG4vLyBWYXJpYWJsZXNcbmFwcC5VUkwgPSBcImh0dHBzOi8vcG9rZWFwaS5jby9hcGkvdjIvcG9rZW1vbi9cIlxuYXBwLnBva2Vtb25PbmUgPSBcIlwiXG5hcHAucG9rZW1vblR3byA9IFwiXCJcbmFwcC5wb2tlbW9uT25lSW5kZXggPSBcIlwiXG5hcHAucG9rZW1vblR3b0luZGV4ID0gXCJcIlxuYXBwLnBva2Vtb25PbmVTdGF0cyA9IFtdXG5hcHAucG9rZW1vblR3b1N0YXRzID0gW11cbmFwcC5wb2tlbW9uT25lVHlwZXMgPSBbXVxuYXBwLmRhbWFnZUluZm8gPSBcIlwiXG5hcHAucG9rZW1vbk9uZVN0cmVuZ3RocyA9IFtdXG5hcHAucG9rZW1vbk9uZVdlYWtuZXNzZXMgPSBbXVxuYXBwLnBva2Vtb25Ud29UeXBlcyA9IFtdXG5hcHAuanNvbiA9IFtdXG5cbiQuZ2V0SlNPTihcIi4uL3B1YmxpYy9wb2tlbW9uLmpzb25cIiwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBhcHAuanNvbiA9IGRhdGE7XG4gICAgY29uc29sZS5sb2coYXBwLmpzb24ubGVuZ3RoKTsgLy9qc29uIG91dHB1dCBcbn0pO1xuXG5cbmFwcC5kaXNwbGF5UG9rZW1vbiA9IGZ1bmN0aW9uKCl7XG4gICAgJChcIi5maXJzdFBva2Vtb25cIikuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgIGFwcC5wb2tlbW9uT25lID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgYXBwLnBva2Vtb25UeXBlcyhhcHAucG9rZW1vbk9uZSk7XG4gICAgICAgICQoXCIucG9rZW1vbk9uZU5hbWVcIikuYXBwZW5kKGA8aDMgY2xhc3M9XCJwb2tlbW9uTmFtZVwiPiR7YXBwLnBva2Vtb25PbmV9PC9oMz5gKTtcbiAgICAgICAgXG4gICAgICAgIFxuICAgIH0pXG4gICAgJChcIi5zZWNvbmRQb2tlbW9uXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYXBwLnBva2Vtb25Ud28gPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAkKFwiLnBva2Vtb25Ud29OYW1lXCIpLmFwcGVuZChgPGgzIGNsYXNzPVwicG9rZW1vbk5hbWVcIj4ke2FwcC5wb2tlbW9uVHdvfTwvaDM+YCk7XG4gICAgICAgIGFwcC5wb2tlbW9uMlR5cGVzKGFwcC5wb2tlbW9uVHdvKTtcbiAgICB9KTtcbn1cblxuYXBwLnVwZGF0ZTFJbWFnZSA9IGZ1bmN0aW9uKCl7XG4gICAgJChcIi5vbmVJbWFnZVwiKS5hdHRyKFwic3JjXCIsIGBodHRwczovL3Bva2VyZXMuYmFzdGlvbmJvdC5vcmcvaW1hZ2VzL3Bva2Vtb24vJHthcHAucG9rZW1vbk9uZUluZGV4fS5wbmdgKVxuXG59XG5cbmFwcC51cGRhdGUySW1hZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgJChcIi50d29JbWFnZVwiKS5hdHRyKFwic3JjXCIsIGBodHRwczovL3Bva2VyZXMuYmFzdGlvbmJvdC5vcmcvaW1hZ2VzL3Bva2Vtb24vJHthcHAucG9rZW1vblR3b0luZGV4fS5wbmdgKVxufVxuXG5cbmFwcC5wb2tlbW9uVHlwZXMgPSBmdW5jdGlvbihwb2tlbW9uKXtcbiAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgdXJsOiBhcHAuVVJMICsgcG9rZW1vbiArIFwiL1wiLFxuICAgICAgICBtZXRob2Q6IFwiR2V0XCIsXG4gICAgICAgIGRhdGFUeXBlOiBcIkpTT05cIixcbiAgICB9KS50aGVuKChyZXMpPT57XG4gICAgICAgIGxldCByZXN1bHRzID0gcmVzO1xuICAgICAgICBhcHAucG9rZW1vbk9uZUluZGV4ID0gcmVzdWx0cy5nYW1lX2luZGljZXNbMF0uZ2FtZV9pbmRleDtcbiAgICAgICAgYXBwLnVwZGF0ZTFJbWFnZSgpO1xuICAgICAgICByZXN1bHRzLnR5cGVzLm1hcCgodHlwZSk9PntcbiAgICAgICAgICAgIGxldCBuZXdUeXBlID0gdHlwZS50eXBlLm5hbWU7XG4gICAgICAgICAgICBhcHAucG9rZW1vbk9uZVR5cGVzLnB1c2gobmV3VHlwZSk7ICAgICAgIFxuICAgICAgICAgICAgJChcIi50eXBlMVwiKS5hcHBlbmQoYDxsaSBjbGFzcz1cInR5cGVOYW1lXCI+JHtuZXdUeXBlfSA8L2xpPmApOyAgICAgXG4gICAgICAgIH0pO1xuICAgICAgICByZXN1bHRzLnN0YXRzLm1hcCgoc3RhdCk9PntcbiAgICAgICAgICAgIGxldCBzdGF0TnVtYmVyID0gcGFyc2VJbnQoc3RhdC5iYXNlX3N0YXQpO1xuICAgICAgICAgICAgYXBwLnBva2Vtb25PbmVTdGF0cy5wdXNoKHN0YXROdW1iZXIpO1xuICAgICAgICAgICAgJChcIi5zdGF0czFcIikuYXBwZW5kKGA8bGkgY2xhc3M9XCJzdGF0XCI+JHtzdGF0LnN0YXQubmFtZX0gOiAke3N0YXQuYmFzZV9zdGF0fTwvbGk+YCk7IFxuICAgICAgICB9KVxuICAgICAgICBhcHAucG9rZW1vblR5cGVzSW5mbygpO1xuICAgIH0pO1xufTtcblxuYXBwLnBva2Vtb24yVHlwZXMgPSBmdW5jdGlvbiAocG9rZW1vbikge1xuICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICB1cmw6IGFwcC5VUkwgKyBwb2tlbW9uICsgXCIvXCIsXG4gICAgICAgIG1ldGhvZDogXCJHZXRcIixcbiAgICAgICAgZGF0YVR5cGU6IFwiSlNPTlwiLFxuICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0cyA9IHJlcztcbiAgICAgICAgYXBwLnBva2Vtb25Ud29JbmRleCA9IHJlc3VsdHMuZ2FtZV9pbmRpY2VzWzBdLmdhbWVfaW5kZXg7XG4gICAgICAgIGFwcC51cGRhdGUySW1hZ2UoKTtcbiAgICAgICAgcmVzdWx0cy50eXBlcy5tYXAoKHR5cGUpID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdUeXBlID0gdHlwZS50eXBlLm5hbWU7XG4gICAgICAgICAgICBhcHAucG9rZW1vblR3b1R5cGVzLnB1c2gobmV3VHlwZSk7XG4gICAgICAgICAgICAkKFwiLnR5cGUyXCIpLmFwcGVuZChgPGxpIGNsYXNzPVwidHlwZU5hbWVcIj4ke25ld1R5cGV9IDwvbGk+YCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXN1bHRzLnN0YXRzLm1hcCgoc3RhdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0YXROdW1iZXIgPSBwYXJzZUludChzdGF0LmJhc2Vfc3RhdCk7XG4gICAgICAgICAgICBhcHAucG9rZW1vblR3b1N0YXRzLnB1c2goc3RhdE51bWJlcik7XG4gICAgICAgICAgICAkKFwiLnN0YXRzMlwiKS5hcHBlbmQoYDxsaSBjbGFzcz1cInN0YXRcIj4ke3N0YXQuc3RhdC5uYW1lfTogJHtzdGF0LmJhc2Vfc3RhdH08L2xpPmApO1xuICAgICAgICB9KVxuICAgICAgICBhcHAucG9rZW1vbkNvbXBhcmUoKTtcbiAgICB9KTtcbn07XG5cblxuYXBwLnBva2Vtb25UeXBlc0luZm8gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoYXBwLnBva2Vtb25PbmVUeXBlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFwcC5wb2tlbW9uT25lVHlwZXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7ICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogXCJodHRwczovL3Bva2VhcGkuY28vYXBpL3YyL3R5cGUvXCIgKyBpdGVtICsgXCIvXCIsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdKU09OJyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICByZXMuZGFtYWdlX3JlbGF0aW9ucy5kb3VibGVfZGFtYWdlX2Zyb20ubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICBhcHAucG9rZW1vbk9uZVdlYWtuZXNzZXMucHVzaChpdGVtLm5hbWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlcy5kYW1hZ2VfcmVsYXRpb25zLmRvdWJsZV9kYW1hZ2VfdG8ubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFwcC5wb2tlbW9uT25lU3RyZW5ndGhzLnB1c2goaXRlbS5uYW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfTtcbn1cblxuYXBwLmNvbXBhcmUgPSBmdW5jdGlvbihhLGIpIHtcbiAgICB2YXIgbWF0Y2hlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKHZhciBlID0gMDsgZSA8IGIubGVuZ3RoOyBlKyspIHtcbiAgICAgICAgICAgIGlmIChhW2ldID09PSBiW2VdKSBtYXRjaGVzLnB1c2goYVtpXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoZXM7XG59XG5cbmFwcC5wb2tlbW9uQ29tcGFyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoYXBwLmNvbXBhcmUoYXBwLnBva2Vtb25PbmVTdHJlbmd0aHMsIGFwcC5wb2tlbW9uVHdvVHlwZXMpLmxlbmd0aCA+IDAgJiYgYXBwLmNvbXBhcmUoYXBwLnBva2Vtb25PbmVXZWFrbmVzc2VzLCBhcHAucG9rZW1vblR3b1R5cGVzKS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICQoXCIuc3VibWl0XCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKFwiLndpbm5lckFubm91bmNlbWVudFwiKS5hcHBlbmQoYDxoMT4ke2FwcC5wb2tlbW9uT25lfSBXaW5zIGFnYWluc3QgJHthcHAuY29tcGFyZShhcHAucG9rZW1vbk9uZVN0cmVuZ3RocywgYXBwLnBva2Vtb25Ud29UeXBlcyl9PC9oMT5gKTtcbiAgICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGFwcC5jb21wYXJlKGFwcC5wb2tlbW9uT25lU3RyZW5ndGhzLCBhcHAucG9rZW1vblR3b1R5cGVzKS5sZW5ndGggPT0gMCAmJiBhcHAuY29tcGFyZShhcHAucG9rZW1vbk9uZVdlYWtuZXNzZXMsIGFwcC5wb2tlbW9uVHdvVHlwZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJChcIi5zdWJtaXRcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJChcIi53aW5uZXJBbm5vdW5jZW1lbnRcIikuYXBwZW5kKGA8aDE+JHthcHAucG9rZW1vblR3b30gV2lucyBhZ2FpbnN0ICR7YXBwLmNvbXBhcmUoYXBwLnBva2Vtb25PbmVXZWFrbmVzc2VzLCBhcHAucG9rZW1vblR3b1R5cGVzKX08L2gxPmApO1xuICAgICAgICB9KVxuICAgIH0gZWxzZSBpZiAoYXBwLmNvbXBhcmUoYXBwLnBva2Vtb25PbmVTdHJlbmd0aHMsIGFwcC5wb2tlbW9uVHdvVHlwZXMpLmxlbmd0aCA9PT0gMCAmJiBhcHAuY29tcGFyZShhcHAucG9rZW1vbk9uZVdlYWtuZXNzZXMsIGFwcC5wb2tlbW9uVHdvVHlwZXMpLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICQoXCIuc3VibWl0XCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGFwcC5iYXNlU3RhdHNDb21wYXJlKCk7XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5hcHAuYmFzZVN0YXRzQ29tcGFyZSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBwb2tlbW9uT25lID0gMFxuICAgIGxldCBwb2tlbW9uVHdvID0gMFxuICAgIGlmICgoYXBwLnBva2Vtb25PbmVTdGF0c1swXSA+IGFwcC5wb2tlbW9uVHdvU3RhdHNbMF0pID09PSB0cnVlKSB7XG4gICAgICAgIHBva2Vtb25PbmUgPSBwb2tlbW9uT25lICsgMSBcbiAgICB9IGVsc2UgaWYgKGFwcC5wb2tlbW9uT25lU3RhdHNbMF0gPCBhcHAucG9rZW1vblR3b1N0YXRzWzBdID09PSB0cnVlKXtcbiAgICAgICAgcG9rZW1vblR3byA9IHBva2Vtb25Ud28gKyAxXG4gICAgfSBlbHNlIHtcbiAgICAgICAgbnVsbFxuICAgIH1cblxuICAgIGlmIChhcHAucG9rZW1vbk9uZVN0YXRzWzFdID4gYXBwLnBva2Vtb25Ud29TdGF0c1sxXSA9PT0gdHJ1ZSkge1xuICAgICAgICBwb2tlbW9uT25lID0gcG9rZW1vbk9uZSArIDFcbiAgICB9IGVsc2UgaWYgKGFwcC5wb2tlbW9uT25lU3RhdHNbMV0gPCBhcHAucG9rZW1vblR3b1N0YXRzWzFdID09PSB0cnVlKSB7XG4gICAgICAgIHBva2Vtb25Ud28gPSBwb2tlbW9uVHdvICsgMVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG51bGxcbiAgICB9XG5cbiAgICBpZiAoYXBwLnBva2Vtb25PbmVTdGF0c1syXSA+IGFwcC5wb2tlbW9uVHdvU3RhdHNbMl0gPT09IHRydWUpIHtcbiAgICAgICAgcG9rZW1vbk9uZSA9IHBva2Vtb25PbmUgKyAxXG4gICAgfSBlbHNlIGlmIChhcHAucG9rZW1vbk9uZVN0YXRzWzJdIDwgYXBwLnBva2Vtb25Ud29TdGF0c1syXSA9PT0gdHJ1ZSkge1xuICAgICAgICBwb2tlbW9uVHdvID0gcG9rZW1vblR3byArIDFcbiAgICB9IGVsc2Uge1xuICAgICAgICBudWxsXG4gICAgfVxuXG4gICAgaWYgKGFwcC5wb2tlbW9uT25lU3RhdHNbM10gPiBhcHAucG9rZW1vblR3b1N0YXRzWzNdKSB7XG4gICAgICAgIHBva2Vtb25PbmUgPSBwb2tlbW9uT25lICsgMVxuICAgIH0gZWxzZSBpZiAoYXBwLnBva2Vtb25PbmVTdGF0c1szXSA8IGFwcC5wb2tlbW9uVHdvU3RhdHNbM10pIHtcbiAgICAgICAgcG9rZW1vblR3byA9IHBva2Vtb25Ud28gKyAxXG4gICAgfSBlbHNlIHtcbiAgICAgICAgbnVsbFxuICAgIH1cblxuICAgIGlmIChhcHAucG9rZW1vbk9uZVN0YXRzWzRdID4gYXBwLnBva2Vtb25Ud29TdGF0c1s0XSkge1xuICAgICAgICBwb2tlbW9uT25lID0gcG9rZW1vbk9uZSArIDFcbiAgICB9IGVsc2UgaWYgKGFwcC5wb2tlbW9uT25lU3RhdHNbNF0gPCBhcHAucG9rZW1vblR3b1N0YXRzWzRdKSB7XG4gICAgICAgIHBva2Vtb25Ud28gPSBwb2tlbW9uVHdvICsgMVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG51bGxcbiAgICB9XG5cbiAgICBpZiAoYXBwLnBva2Vtb25PbmVTdGF0c1s1XSA+IGFwcC5wb2tlbW9uVHdvU3RhdHNbNV0pIHtcbiAgICAgICAgcG9rZW1vbk9uZSA9IHBva2Vtb25PbmUgKyAxXG4gICAgfSBlbHNlIGlmIChhcHAucG9rZW1vbk9uZVN0YXRzWzVdIDwgYXBwLnBva2Vtb25Ud29TdGF0c1s1XSkge1xuICAgICAgICBwb2tlbW9uVHdvID0gcG9rZW1vblR3byArIDFcbiAgICB9IGVsc2Uge1xuICAgICAgICBudWxsXG4gICAgfVxuICAgIFxuICAgIGlmIChwb2tlbW9uT25lID4gcG9rZW1vblR3bykge1xuICAgICAgICAkKFwiLndpbm5lckFubm91bmNlbWVudFwiKS5hcHBlbmQoYDxoMT4ke2FwcC5wb2tlbW9uT25lfSBXaW5zIGJ5IEJhc2UgU3RhdHM8L2gxPmApO1xuICAgIH0gZWxzZSBpZiAocG9rZW1vbk9uZSA8IHBva2Vtb25Ud28pIHtcbiAgICAgICAgJChcIi53aW5uZXJBbm5vdW5jZW1lbnRcIikuYXBwZW5kKGA8aDE+JHthcHAucG9rZW1vblR3b30gV2lucyBieSBCYXNlIFN0YXRzPC9oMT5gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKFwiLndpbm5lckFubm91bmNlbWVudFwiKS5hcHBlbmQoYDxoMT4ke2FwcC5wb2tlbW9uT25lfSBXaW5zIGJ5IGRlZmF1bHQ8L2gxPmApO1xuICAgIH1cbn1cblxuYXBwLnJlc2V0UGFnZSA9IGZ1bmN0aW9uKCl7XG4gICAgJChcIi5yZXNldFwiKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KVxufVxuXG4vLyBhdXRvY29tcGxldGUgXG5cbmFwcC5hdXRvY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHVybDogXCJwdWJsaWMvcG9rZW1vbi5qc29uXCIsXG4gICAgICAgIGdldFZhbHVlOiBcIm5hbWVcIixcbiAgICAgICAgbGlzdDoge1xuICAgICAgICAgICAgbWF0Y2g6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgICQoXCIuc2Vjb25kUG9rZW1vblwiKS5lYXN5QXV0b2NvbXBsZXRlKG9wdGlvbnMpO1xuICAgICQoXCIuZmlyc3RQb2tlbW9uXCIpLmVhc3lBdXRvY29tcGxldGUob3B0aW9ucyk7XG59XG5cbmFwcC5pbml0ID0gZnVuY3Rpb24gKCl7XG4gICAgYXBwLmF1dG9jb21wbGV0ZSgpO1xuICAgIGFwcC5kaXNwbGF5UG9rZW1vbigpO1xuICAgIGFwcC5wb2tlbW9uVHlwZXNJbmZvKCk7XG59O1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICBhcHAuaW5pdCgpO1xufSk7XG5cbiJdfQ==
