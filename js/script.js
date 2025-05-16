const allCardsMovies = document.querySelector(".grid");

const uri = "https://api.themoviedb.org/3/";
import { API_KEY } from "../config.js";

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
      console.log("movie details");
      break;
    case "/tv-details.html":
      console.log("tv details");
      break;
    case "/search.html":
      console.log("search");
      break;
  }
};

const fetchData = async (endpoint) => {
  const uri = "https://api.themoviedb.org/3/";

  try {
    const response = await fetch(
      `${uri}${endpoint}?api_key=${API_KEY}&language=en-US`
    );
    if (!response.ok) {
      throw new Error("could not fetch movies data");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const fetchPopulerMovies = async () => {
  const { results } = await fetchData("movie/popular");
  results.forEach((result) => {
    console.log(result);
    createCardMovie(allCardsMovies, result);
  });
};

const fetchPopulerShows = async () => {
  const { results } = await fetchData("tv/popular");
  results.forEach((result) => {
    console.log(result);
    createCardMovie(allCardsMovies, result);
  });
};

document.addEventListener("DOMContentLoaded", initApp);

const createCardMovie = (parentCard, data) => {
  const linkDetails = document.createElement("a");

  linkDetails.href = `movie-details.html?id=${data.id}`;
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
  cardtitle.textContent = data.title;
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
