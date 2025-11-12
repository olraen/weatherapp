const API_KEY = "1o02ad6aa40e7b19fa37f8t5928ba37d";
const BASE_URL = "https://api.shecodes.io/weather/v1";

function formatTime(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function formatDate(date) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let weekday = days[date.getDay()];
  let month = months[date.getMonth()];
  let monthday = date.getDate();

  return `${weekday}, ${month} ${monthday}`;
}

function formatDay(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function refreshWeather(response) {
  // Update city
  let city = document.querySelector("#city");
  city.innerHTML = response.data.city;

  // temperature and weather element
  let tempElement = document.querySelector("#temp");
  let currentDescriptionElement = document.querySelector(
    "#current-description"
  );

  let temp = Math.round(response.data.temperature.current);
  let currentDescription = response.data.condition.description;
  tempElement.innerHTML = temp;
  currentDescriptionElement.innerHTML = currentDescription;

  // icon
  let iconElement = document.querySelector("#temp-icon");
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  //   humidity, wind, feels like temperature elements
  let humidityElement = document.querySelector("#humidity-percent");
  let windElement = document.querySelector("#wind-speed");
  let feelsLikeTempElement = document.querySelector("#feels-like-temp");
  let humiditiy = Math.round(response.data.temperature.humidity);
  let wind = Number.parseFloat(response.data.wind.speed).toFixed(1);
  let tempFeelsLike = Math.round(response.data.temperature.feels_like);
  humidityElement.innerHTML = humiditiy;
  windElement.innerHTML = wind;
  feelsLikeTempElement.innerHTML = tempFeelsLike;

  //  date and time
  // let date = new Date(response.data.time * 1000);
  let date = new Date();
  let currentTimeElement = document.querySelector("#current-time");
  let currentDateElement = document.querySelector("#current-date");
  currentTimeElement.innerHTML = formatTime(date);
  currentDateElement.innerHTML = formatDate(date);

  // forecast
  getForecast(response.data.city);
}

function handleSearchForm(event) {
  event.preventDefault();

  let searchInput = document.querySelector("#search-input");
  searchCity(searchInput.value);
}

function displayForecast(response) {
  let forecastHtml = "";
  response.data.daily.forEach(function (day, index) {
    if (index > 0 && index < 6) {
      forecastHtml = `${forecastHtml}
  <div class="forecast-day">
    <div class="forecast-date">${formatDay(day.time)}</div>
    <div><img src = "${day.condition.icon_url}" class = "forecast-icon"/> </div>
    <div class="forecast-temperatures">
      <div class="forecast-temperature">
        <strong>${Math.round(day.temperature.maximum)}º</strong>
      </div>
      <div class="forecast-temperature">${Math.round(
        day.temperature.minimum
      )}º</div>
    </div>
  </div>`;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

function searchCity(city) {
  axios
    .get(`${BASE_URL}/current?query=${city}&key=${API_KEY}`)
    .then(refreshWeather);
}

function getForecast(city) {
  axios
    .get(`${BASE_URL}/forecast?query=${city}&key=${API_KEY}`)
    .then(displayForecast);
}

// Handle search form
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchForm);

searchCity("Stockholm");
