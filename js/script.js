const allCardsMovies = document.querySelector(".grid");
const swiper = document.querySelector(".swiper-wrapper");
const showDetails = document.getElementById("show-details");
const movieDetails = document.getElementById("movie-details");
const uri = "https://api.themoviedb.org/3/";

document.getElementById(
  "footer-year"
).textContent = `© ${new Date().getFullYear()}`;

const API_KEY = "d9dd6ab703d9cdc91ca27c387cd1e5e5";
//By the way, it's free

let id = null;
const globel = {
  cureentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
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
      displaySlider();
      break;
    case "/shows":
      fetchPopulerShows();
      displaySliderShow();

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
      serch();
      break;

    case "/favorites.html":
      break;
  }
};

const fetchData = async (endpoint) => {
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
  showBackdrop("show", result.backdrop_path);

  showTvDetails(showDetails, result);
};
const fetchMovieDetails = async () => {
  const result = await fetchData(`movie/${id}`);
  showBackdrop("movie", result.backdrop_path);
  console.log(result);
  showmovieDetails(movieDetails, result);
};

const showSpinner = () => {
  document.querySelector(".spinner").classList.add("show");
};
const hideSpinner = () => {
  document.querySelector(".spinner").classList.remove("show");
};
const showBackdrop = (type, background) => {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${background})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.15";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
};

document.addEventListener("DOMContentLoaded", initApp);

const createCardMovie = (parentCard, data, pagenation = "") => {
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
  prodComp.textContent = copm || "Unknown";
  detailsbottom.append(showInfo, showStatusInfo, productionCompanies, prodComp);
  parentElment.append(topDetails);
  parentElment.append(detailsbottom);
};
const displaySlider = async () => {
  const { results } = await fetchData("movie/now_playing");
  results.forEach((result) => {
    movieSlides(swiper, result);
  });
  initSwiper();
};

const displaySliderShow = async () => {
  const { results } = await fetchData("tv/airing_today");

  results.forEach((result) => {
    movieSlides(swiper, result);
  });
  initSwiper();
};

const movieSlides = (parentElment, data) => {
  const slide = document.createElement("div");
  slide.classList.add("swiper-slide");
  const movielink = document.createElement("a");
  movielink.href = `tv-details.html?id=${data.id}`;

  const slideImg = document.createElement("img");
  slideImg.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  slideImg.alt = "tv show image";
  movielink.appendChild(slideImg);
  const slideRating = document.createElement("h4");
  slideRating.classList.add("swiper-rating");
  slideRating.innerHTML = `<i class="fas fa-star text-secondary"></i> ${data.vote_average.toFixed(
    2
  )} / 10

`;

  slide.append(movielink, slideRating);
  parentElment.appendChild(slide);
};

const initSwiper = () => {
  const swiper = new Swiper(".swiper", {
    slidesPreView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },

    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
};
const showmovieDetails = (parentElement, data) => {
  const topDetails = document.createElement("div");
  topDetails.classList.add("details-top");

  const posterDiv = document.createElement("div");
  const showImg = document.createElement("img");
  showImg.src = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : "images/no-image.jpg";
  showImg.alt = data.title || "Movie Title";
  showImg.classList.add("card-img-top");
  posterDiv.appendChild(showImg);

  const wrapper = document.createElement("div");

  const title = document.createElement("h2");
  title.textContent = data.title;

  const rating = document.createElement("p");
  rating.innerHTML = `<i class="fas fa-star text-primary"></i> ${Number(
    data.vote_average.toFixed(1)
  )} / 10`;

  const releaseDate = document.createElement("p");
  releaseDate.classList.add("text-muted");
  releaseDate.textContent = `Release Date: ${data.release_date}`;

  const overview = document.createElement("p");
  overview.textContent = data.overview;

  const genresHeader = document.createElement("h5");
  genresHeader.textContent = "Genres";

  const genresList = document.createElement("ul");
  genresList.classList.add("list-group");
  data.genres.forEach((genre) => {
    const li = document.createElement("li");
    li.textContent = genre.name;
    genresList.appendChild(li);
  });

  const homepageBtn = document.createElement("a");
  homepageBtn.href = data.homepage;
  homepageBtn.target = "_blank";
  homepageBtn.classList.add("btn");
  homepageBtn.textContent = "Visit Movie Homepage";

  wrapper.append(
    title,
    rating,
    releaseDate,
    overview,
    genresHeader,
    genresList,
    homepageBtn
  );

  topDetails.append(posterDiv, wrapper);

  const bottomDetails = document.createElement("div");
  bottomDetails.classList.add("details-bottom");

  const infoHeader = document.createElement("h2");
  infoHeader.textContent = "Movie Info";

  const infoList = document.createElement("ul");

  const budget = document.createElement("li");
  budget.innerHTML = `<span class="text-secondary">Budget:</span> $${data.budget.toLocaleString()}`;

  const revenue = document.createElement("li");
  revenue.innerHTML = `<span class="text-secondary">Revenue:</span> $${data.revenue.toLocaleString()}`;

  const runtime = document.createElement("li");
  runtime.innerHTML = `<span class="text-secondary">Runtime:</span> ${data.runtime} minutes`;

  const status = document.createElement("li");
  status.innerHTML = `<span class="text-secondary">Status:</span> ${data.status}`;

  infoList.append(budget, revenue, runtime, status);

  const prodHeader = document.createElement("h4");
  prodHeader.textContent = "Production Companies";

  const prodList = document.createElement("div");
  prodList.classList.add("list-group");
  const companies = data.production_companies.map((c) => c.name).join(", ");
  prodList.textContent = companies;

  bottomDetails.append(infoHeader, infoList, prodHeader, prodList);

  parentElement.append(topDetails, bottomDetails);
};
const showAlert = (msg, className = "err") => {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(msg));
  document.querySelector("#alert").appendChild(alertEl);
  setTimeout(() => {
    alertEl.remove();
  }, 2000);
};

const searchAPIData = async () => {
  try {
    showSpinner();
    const response = await fetch(
      `${uri}search/${globel.search.type}?api_key=${API_KEY}&language=en-US&query=${globel.search.term}&page=${globel.search.page}`
    );
    if (!response.ok) {
      throw new Error("couldn't fetch respons");
    }

    const data = await response.json();
    hideSpinner();

    return data;
  } catch (err) {
    console.error(err);
  }
};
const serch = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  globel.search.type = urlParams.get("type");
  globel.search.term = urlParams.get("search-term");

  if (
    globel.search.term !== "" &&
    globel.search.type !== "" &&
    globel.search.term !== null
  ) {
    globel.search.page = 1;

    const { results, total_pages, page, total_results } = await searchAPIData();
    globel.search.page = page;
    globel.search.totalPages = total_pages;
    globel.search.totalResults = total_results;

    allCardsMovies.innerHTML = "";

    if (results.length === 0) {
      showAlert("0 Results found");
      return;
    }

    showAlert(`${globel.search.totalPages} Results found`, "success");
    showResults(results);

    results.forEach((result) => {
      createCardMovie(allCardsMovies, result);
    });

    if (total_pages > 1) {
      displayPagination();
    }

    document.querySelector("#search-term").value = "";
  } else {
    showAlert("please enter a search term");
  }
};

const displayPagination = () => {
  document.querySelector("#pagination").innerHTML = "";

  const pagenation = document.createElement("div");

  pagenation.classList.add("pagination");

  pagenation.innerHTML = `
     <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary next" id="next">Next</button>
          <div class="page-counter">Page ${globel.search.page} of ${globel.search.totalPages}</div>
        `;

  document.querySelector("#pagination").appendChild(pagenation);
  updaBtn();
  document.querySelector("#next").addEventListener("click", async () => {
    if (globel.search.page < globel.search.totalPages) {
      globel.search.page++;
      const { results, totalPages } = await searchAPIData();
      allCardsMovies.innerHTML = "";

      results.forEach((result) => {
        createCardMovie(allCardsMovies, result);
        console.log(globel.search.page);
      });
      updatePaginationDisplay();
      updaBtn();
    }
  });

  document.querySelector("#prev").addEventListener("click", async () => {
    if (globel.search.page > 1) {
      globel.search.page--;
      const { results, totalPages } = await searchAPIData();

      allCardsMovies.innerHTML = "";
      showResults(results);
      results.forEach((result) => {
        createCardMovie(allCardsMovies, result);
      });

      updatePaginationDisplay();
      updaBtn();
    }
  });
};
const updatePaginationDisplay = () => {
  const pageCounter = document.querySelector(".page-counter");
  if (pageCounter) {
    pageCounter.textContent = `Page ${globel.search.page} of ${globel.search.totalPages}`;
  }
};
const showResults = (data) => {
  document.querySelector("#search-results-heading").innerHTML = `
  <h2>  ${globel.search.totalResults} Results for ${globel.search.term}</h2>`;
};

const updaBtn = () => {
  const prevBtn = document.querySelector("#prev");
  const nextBtn = document.querySelector("#next");

  if (prevBtn) {
    prevBtn.disabled = globel.search.page === 1;
  }

  if (nextBtn) {
    nextBtn.disabled = globel.search.page === globel.search.totalPages;
  }
};
