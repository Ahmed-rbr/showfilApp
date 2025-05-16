const uri = "https://api.themoviedb.org/3/movie/popular";

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
      console.log("home");
      break;
    case "/shows.html":
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

document.addEventListener("DOMContentLoaded", initApp);
