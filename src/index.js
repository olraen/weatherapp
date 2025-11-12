// Comments
// - used String for formatting time and arrow functions
// - simplified some code using destructuring
// - think first day forest is current day, not next day, so indexing from 1 to 6 in displayForecast function
// - used map and join for building forecast HTML
// - Github repo has also index-course-like-js prior cleaning

const API_KEY = "1o02ad6aa40e7b19fa37f8t5928ba37d";
const BASE_URL = "https://api.shecodes.io/weather/v1";

// Format time as "HH:MM"
// use arrow function
const formatTime = (date) =>
  `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

// Format date as "Wednesday, November 12"
const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

// Get week day abbreviation from timestamp
const formatDay = (timestamp) =>
  new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "short",
  });

// Update weather data on the page
function refreshWeather(response) {
  const { city, condition, temperature, wind } = response.data;
  document.querySelector("#city").textContent = city;
  document.querySelector("#temp").textContent = Math.round(temperature.current);
  document.querySelector("#current-description").textContent =
    condition.description;
  document.querySelector(
    "#temp-icon"
  ).innerHTML = `<img src="${condition.icon_url}" alt="${condition.description}" class="weather-app-icon"/>`;

  document.querySelector("#humidity-percent").textContent = Math.round(
    temperature.humidity
  );
  document.querySelector("#wind-speed").textContent = wind.speed.toFixed(1);
  document.querySelector("#feels-like-temp").textContent = Math.round(
    temperature.feels_like
  );

  const now = new Date();
  document.querySelector("#current-time").textContent = formatTime(now);
  document.querySelector("#current-date").textContent = formatDate(now);

  getForecast(city);
}

// Display forecast data on the page
function displayForecast({ data }) {
  const forecastHtml = data.daily
    .slice(1, 6)
    .map(
      (day) => `
      <div class="forecast-day">
        <div class="forecast-date">${formatDay(day.time)}</div>
        <img src="${day.condition.icon_url}" alt="${
        day.condition.description
      }" class="forecast-icon" />
        <div class="forecast-temperatures">
          <strong>${Math.round(day.temperature.maximum)}º</strong>
          <span>${Math.round(day.temperature.minimum)}º</span>
        </div>
      </div>
    `
    )
    .join("");

  document.querySelector("#forecast").innerHTML = forecastHtml;
}

// Search for city weather data
function searchCity(city) {
  axios
    .get(`${BASE_URL}/current?query=${city}&key=${API_KEY}`)
    .then(refreshWeather);
}

// Get forecast data for a city
function getForecast(city) {
  axios
    .get(`${BASE_URL}/forecast?query=${city}&key=${API_KEY}`)
    .then(displayForecast);
}

// Handle search form
document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const city = document.querySelector("#search-input").value.trim();
  if (city) searchCity(city);
});

// Initial search
searchCity("Stockholm");
