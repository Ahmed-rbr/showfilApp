const allCardsMovies = document.querySelector(".grid");
const showDetails = document.getElementById("show-details");
document.getElementById(
  "footer-year"
).textContent = `© ${new Date().getFullYear()}`;

import { API_KEY } from "../config.js";
let id = null;
const globel = {
  cureentPage: window.location.pathname,
};

const highlightActiveLink = () => {
  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    if (link.getAttribute("href") === globel.cureentPage) {
      link.classList.add("active");
    }
  });
};
const getParams = (key) => {
  return new URLSearchParams(window.location.search).get(key);
};

const getId = () => {
  id = null;
  id = getParams("id");
  console.log(id);
};

const initApp = () => {
  highlightActiveLink();

  switch (globel.cureentPage) {
    case "/":
    case "/index.html":
      fetchPopulerMovies();
      break;
    case "/shows.html":
      fetchPopulerShows();
      console.log("shows");
      break;
    case "/movie-details.html":
      getId();
      fetchMovieDetails();
      break;
    case "/tv-details.html":
      getId();
      fetchPopulerShow();

      break;
    case "/search.html":
      break;
  }
};

const fetchData = async (endpoint) => {
  const uri = "https://api.themoviedb.org/3/";
  try {
    showSpinner();

    const response = await fetch(
      `${uri}${endpoint}?api_key=${API_KEY}&language=en-US`
    );
    if (!response.ok) {
      throw new Error("could not fetch movies data");
    }
    const data = await response.json();
    hideSpinner();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const fetchPopulerMovies = async () => {
  const { results } = await fetchData("movie/popular");
  results.forEach((result) => {
    createCardMovie(allCardsMovies, result);
  });
};

const fetchPopulerShows = async () => {
  const { results } = await fetchData("tv/popular");
  results.forEach((result) => {
    createCardMovie(allCardsMovies, result);
  });
};

const fetchPopulerShow = async () => {
  const result = await fetchData(`tv/${id}`);
  console.log(result);

  showTvDetails(showDetails, result);
};
const fetchMovieDetails = async () => {
  const result = await fetchData(`movie/${id}`);
  console.log(result);
};

const showSpinner = () => {
  document.querySelector(".spinner").classList.add("show");
};
const hideSpinner = () => {
  document.querySelector(".spinner").classList.remove("show");
};

document.addEventListener("DOMContentLoaded", initApp);

const createCardMovie = (parentCard, data) => {
  const linkDetails = document.createElement("a");

  linkDetails.href =
    globel.cureentPage === "/shows.html"
      ? `tv-details.html?id=${data.id}`
      : `movie-details.html?id=${data.id}`;
  const movieImg = document.createElement("img");
  data.poster_path
    ? (movieImg.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`)
    : ((movieImg.src = "../images/no-image.jpg"),
      (movieImg.alt = "Movie Title"));
  movieImg.classList.add("card-img-top");
  linkDetails.appendChild(movieImg);
  const card = document.createElement("div");

  const cardTxt = document.createElement("div");
  cardTxt.classList.add("card-body");
  card.classList.add("card");
  const cardtitle = document.createElement("h5");
  data.title
    ? (cardtitle.textContent = data.title)
    : (cardtitle.textContent = data.name);
  cardtitle.classList.add("card-title");
  const cardDate = document.createElement("p");
  cardtitle.classList.add("card-text");
  const dateRelase = document.createElement("small");
  data.release_date
    ? (dateRelase.textContent = `Release: ${data.release_date}`)
    : (dateRelase.textContent = `Release: ${data.first_air_date}`);
  dateRelase.classList.add("text-muted");
  cardDate.appendChild(dateRelase);
  cardTxt.appendChild(cardtitle);
  cardTxt.appendChild(cardDate);

  card.appendChild(linkDetails);
  card.appendChild(cardTxt);

  parentCard.appendChild(card);
};

const showTvDetails = (parentElment, data) => {
  const topDetails = document.createElement("div");
  topDetails.classList.add("details-top");
  const posterDiv = document.createElement("div");
  const showImg = document.createElement("img");
  data.poster_path
    ? (showImg.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`)
    : ((showImg.src = "../images/no-image.jpg"), (showImg.alt = "Movie Title"));
  showImg.classList.add("card-img-top");
  posterDiv.appendChild(showImg);
  const wrapper = document.createElement("div");
  topDetails.appendChild(posterDiv);
  const showName = document.createElement("h2");
  showName.textContent = data.name;
  const showRating = document.createElement("p");
  showRating.innerHTML = `<i class="fas fa-star text-primary"></i>${Number(
    data.vote_average.toFixed(2)
  )} / 10
`;
  const firstAir = document.createElement("p");
  firstAir.textContent = `Release: ${data.first_air_date}`;
  const overview = document.createElement("p");
  overview.textContent = data.overview;
  const genresList = document.createElement("ul");
  genresList.classList.add("list-group");
  const genres = data.genres;
  genres.forEach((gener) => {
    const genreItem = document.createElement("li");
    genreItem.textContent = gener.name;
    genresList.appendChild(genreItem);
  });
  const tvhomePage = document.createElement("a");
  tvhomePage.href = data.homepage;
  tvhomePage.target = "_blank";
  tvhomePage.classList.add("btn");
  tvhomePage.textContent = "      Visit Show Homepage";
  wrapper.append(
    showName,
    showRating,
    firstAir,
    overview,
    genresList,
    tvhomePage
  );
  topDetails.appendChild(wrapper);
  const detailsbottom = document.createElement("div");
  const showInfo = document.createElement("h2");
  showInfo.textContent = "Show Info";
  const showStatusInfo = document.createElement("ul");
  const numEpisods = document.createElement("li");
  numEpisods.innerHTML = `<span class="text-secondary">Number Of Episodes:</span> ${data.number_of_episodes}`;
  const numSesions = document.createElement("li");
  numSesions.innerHTML = `<span class="text-secondary">Number Of Seasons:</span> ${data.number_of_seasons}`;

  const lastEpisod = document.createElement("li");
  lastEpisod.innerHTML = `<span class="text-secondary">Last Episode To Air:</span> ${data.last_episode_to_air.name}`;

  const Status = document.createElement("li");
  Status.innerHTML = `<span class="text-secondary">Status:</span> ${data.status}`;

  showStatusInfo.append(numEpisods, numSesions, lastEpisod, Status);
  const productionCompanies = document.createElement("h4");
  productionCompanies.textContent = "Production Companies:";
  productionCompanies.classList.add("text-secondary");

  const prodComp = document.createElement("div");
  prodComp.classList.add("list-group");

  const companies = data.production_companies.map((companie) => companie.name);
  const copm = companies.join(",");
  prodComp.textContent = copm;
  detailsbottom.append(showInfo, showStatusInfo, productionCompanies, prodComp);
  parentElment.append(topDetails);
  parentElment.append(detailsbottom);
};
