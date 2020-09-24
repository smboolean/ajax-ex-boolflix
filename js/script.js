$(document).ready(function() {

  // click sul bottone di ricerca
  $("#send-search").click(function(){
    // prendere il valore della input
    var searchMovie = $("#search").val();
    resetSearch();
    getMovies(searchMovie);
  });

  // avvio la ricerca tramite il tasto invio
  $("#search").keyup(function(event) {
    if(event.which == 13) {
      // prendere il valore della input
      var searchMovie = $("#search").val();
      resetSearch();
      getMovies(searchMovie);
    }
  });

});

// funzione che si occupa di contattare le api e stampa il risultato
function getMovies(searchString) {
  // eseguire una chiamata al server per recupare i film
  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/search/movie",
      "data": {
        "api_key": "51a580ca8c75a33ea40810a340044302",
        "query": searchString,
        "language": "it-IT"
      },
      "method": "GET",
      "success": function(data) {
        renderMovie(data.results);
      },
      "error": function(err) {
        alert("Errore!");
      }
    }
  );

}

function renderMovie(movies) {

  var source = $("#movie-template").html();
  var template = Handlebars.compile(source);

  // stampare ogni film ricevuto dalla chiamata api
  for (var i = 0; i < movies.length; i++) {
    // prepariamo il nostro context
    var context = {
      "title": movies[i].title,
      "title_orginal": movies[i].original_title,
      "lang": movies[i].original_language,
      "vote": movies[i].vote_average
    };

    // prepariamo il nostro html
    var html = template(context);
    // iniettiamo il nostro html nel tag ul
    var appesso = $("#list-movies").append(html);
  }

}

// funzione che svuota il campo input per la ricerca e la nostra lista
function resetSearch() {

  $("#list-movies").html("");
  $("#search").val("");
}
