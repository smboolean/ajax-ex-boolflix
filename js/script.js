// Milestone 5 (Opzionale):
// Partendo da un film o da una serie, richiedere all'API quali sono gli attori che fanno parte del cast aggiungendo alla nostra scheda Film / Serie SOLO i primi 5 restituiti dall’API con Nome e Cognome, e i generi associati al film con questo schema: “Genere 1, Genere 2, …”.

$(document).ready(function() {

  // click sul bottone di ricerca
  $("#send-search").click(function(){
    search();
  });

  // avvio la ricerca tramite il tasto invio
  $("#search").keyup(function(event) {
    if(event.which == 13) {
      search();
    }
  });

});

// funzione di rcerca generica
function search() {
  // prendere il valore della input
  var searchMovie = $("#search").val();
  resetSearch();
  // recupero i film
  getData("movie", searchMovie);
  // recupero le serie tv
  getData("tv", searchMovie);
}

// funzione generica getData
function getData(type, searchString) {
  // eseguire una chiamata al server per recuperare le serie tv
  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/search/"+type,
      "data": {
        "api_key": "51a580ca8c75a33ea40810a340044302",
        "query": searchString,
        "language": "it-IT"
      },
      "method": "GET",
      "success": function(data) {
        if(data.total_results > 0) {
          renderResults(type,data.results);
        } else {
          notFound(type);
        }
      },
      "error": function(err) {
        alert("Errore!");
      }
    }
  );
}

// funzione per recuperare i dettagli di film e serie tv
function getDetails(type, id) {
  // eseguire una chiamata al server per recuperare il cast
  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/"+type+"/"+id+"/credits",
      "data": {
        "api_key": "51a580ca8c75a33ea40810a340044302",
      },
      "method": "GET",
      "success": function(data) {
        if(data.cast.length > 0) {
          printDetails(data.cast, id, "cast");
        }
      },
      "error": function(err) {
        alert("Errore!");
      }
    }
  );
  // eseguire una chiamata al server per recuperare i genres
  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/"+type+"/"+id,
      "data": {
        "api_key": "51a580ca8c75a33ea40810a340044302",
      },
      "method": "GET",
      "success": function(data) {
        if(data.genres.length > 0) {
          printDetails(data.genres, id, "genres");
        }
      },
      "error": function(err) {
        alert("Errore!");
      }
    }
  );
}

// funzione che stampa il risultato
function renderResults(type, results) {

  var source = $("#movie-template").html();
  var template = Handlebars.compile(source);
  // stampare ogni film ricevuto dalla chiamata api
  for (var i = 0; i < results.length; i++) {

    var title, original_title, container;

    if(type == "movie") {
      title = results[i].title;
      original_title = results[i].original_title;
      container = $("#list-movies");
    } else if(type == "tv") {
      title = results[i].name;
      original_title = results[i].original_name;
      container = $("#list-series");
    }

    if(results[i].poster_path == null) {
      var poster = "img/no_poster.png";
    } else {
      var poster = "https://image.tmdb.org/t/p/w342"+results[i].poster_path;
    }

    // prepariamo il nostro context
    var context = {
      "poster": poster,
      "title": title,
      "title_orginal": original_title,
      "lang": printFlags(results[i].original_language),
      "vote": printStars(results[i].vote_average),
      "type": type,
      "id": results[i].id
    };

    // prepariamo il nostro html
    var html = template(context);
    // iniettiamo il nostro html nel tag ul
    container.append(html);

    // andiamo a prendere i dettagli
    getDetails(type, results[i].id);
  }

}

// funzione che stampa i dettagli di film / serie tv
function printDetails(data, id, list) {

  var source = $("#cast-template").html();
  var template = Handlebars.compile(source);

  var limit;
  if(data.length > 4) {
    limit = 5;
  } else {
    limit = data.length;
  }

  for (var i = 0; i < limit; i++) {

    var context = {
      "name": data[i].name
    };

    var html = template(context);

    var container;
    if(list == "cast") {
      container = $("li[data-id='"+id+"'] .cast");
    } else if(list == "genres") {
      container = $("li[data-id='"+id+"'] .genres");
    }

    container.append(html);
  }
}

// funzione che stampa "la ricerca non ha prodotto risultati"
function notFound(type) {
  var container;
  if(type == "movie") {
    container = $("#list-movies");
  } else if(type == "tv") {
    container = $("#list-series");
  }

  var source = $("#not-found-template").html();
  var template = Handlebars.compile(source);
  // prepariamo il nostro html
  var html = template();
  // iniettiamo il nostro html nel tag ul
  container.append(html);
}

// funzione che svuota il campo input per la ricerca e la nostra lista
function resetSearch() {
  $("#list-series").html("");
  $("#list-movies").html("");
  $("#search").val("");
}

// funzione che trasforma il numero in un numero intero fra 1 e 5 e restituisce le stelle
function printStars(num) {
  // trasformiamo il numero in un numero intero fra 1 e 5
  var num = Math.ceil(num / 2);
  var string = "";

  for (var i = 1; i <= 5; i++) {
    if(i <= num) {
      string += "<i class='fas fa-star'></i>";
    } else {
      string += "<i class='far fa-star'></i>";
    }
  }

  return string;
}

// funzione che restituisce la bandiera della lingua
function printFlags(lang) {
  var flags = [
    "it",
    "en"
  ];

  if(flags.includes(lang)) {
    return "<img class='flag' src='img/"+lang+".svg'>";
  }

  return lang;
}
