// Global Variables
const API_KEY = "api_key=0c92bbe9e7706f2ea67850da17c8440f";
const URL_START = "https://api.themoviedb.org/3";
const movieDisplayEl = document.querySelector(".movies-grid");
const loadMoreEl = document.querySelector(".load-more");
const typeDisplayEl = document.querySelector(".type-display");
const POSTER_URL_START = "https://image.tmdb.org/t/p/w440_and_h660_face";
const pageNum = 1;
var pageMore = 0;
var isSearch = false;
var queryMovie = "";


const NOW_PLAYING_URL = `${URL_START}/movie/now_playing?${API_KEY}&language=en-US&page=`;
async function getNowPlaying() {
    url = NOW_PLAYING_URL + (pageNum + pageMore);
    var response = await fetch(url);
    var movieData = await response.json();

    console.log(url);
    console.log(movieData);

    displayMovies(movieData);
}

async function getSearchMovie(evt) {
    if (pageMore < 1) {
        clearQuery();
    }
    setTypeDisplay("");
    // this prevents the page from re-loading
    evt.preventDefault();
    document.querySelector(".hidden").classList.remove("hidden");
  
    // logs for debugging, open the inspector!
    console.log("evt.target.query.value = ", evt.target.query.value);
    searchterm = evt.target.query.value;
    let searchTermDisplay = searchterm[0].toUpperCase() + searchterm.slice(1).toLowerCase();
    typeDisplayEl.innerHTML += `
    <h2>Searching for ${searchTermDisplay}: </h2>
    `;

    let apiUrl = `
    ${URL_START}/search/movie?${API_KEY}&language=en-US&query=${searchterm}&page=${pageNum + pageMore}&include_adult=false
    `;

    console.log(apiUrl);
    
    // try catch to handle unexpected api errors
    try {
        let response = await fetch(apiUrl);

        // now call is made, but data still not arrived
        console.log("response is: ", response);

        let responseData = await response.json();
      
        // now have actual data
        console.log("responseData is: ", responseData);

        displayMovies(responseData);
      
    } catch (e) {
        generateError(evt.target.query.value);
    }
}
function displayMovies(movieData) {

    movieData.results.forEach(movie => {
        let moviePoster = POSTER_URL_START + movie.poster_path;

        if (movie.poster_path == null) {
            moviePoster = POSTER_URL_START + movie.backdrop_path;
        }

        if (movie.poster_path == null && movie.backdrop_path == null) {
            moviePoster = "https://ih1.redbubble.net/image.730401353.4950/flat,750x1000,075,f.jpg";
        }
        
        movieDisplayEl.innerHTML += `
            <div class="movie-card thumbnail">
                <img class="movie-poster" src="${moviePoster}" alt="${movie.title}" height="500" width="300">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-votes">🌟 ${movie.vote_average}</div>
            </div>
        `
    })
}
function addEventListeners() {
    loadMoreEl.addEventListener("click", () => {
        pageMore += 1;
        
        if (isSearch) {
            getSearchMovie(queryMovie);
        } else {
            getNowPlaying();
        }
    })

    document.querySelector("form").addEventListener("submit", (evt => {
        pageMore = 0;
        queryMovie = evt;
        isSearch = true;
        getSearchMovie(queryMovie);
    }));

    document.querySelector(".close").addEventListener("click", () => {
        pageMore = 0;
        isSearch = false;
        clearQuery();
        setTypeDisplay("Now Playing: ");
        document.querySelector(".close").classList.add("hidden");
        getNowPlaying();
    })
}

const generateError = (err) => {
    document.lastChild.innerHTML += `
        <span style="color: red;">${err} not found</span>
    `;
}

function clearQuery() {
    movieDisplayEl.innerHTML = "";
    searchterm = '';
}

function setTypeDisplay(val) {
    typeDisplayEl.innerHTML = "";

    typeDisplayEl.innerHTML += `
    <h2>${val}</h2>
    `;
}

window.onload = function () {
    typeDisplayEl.innerHTML += `
    <h2>Now Playing:</h2>
    `
    getNowPlaying();
    addEventListeners();
}