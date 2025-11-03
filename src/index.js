function handleSearchForm(event) {
  event.preventDefault();

  let query = document.querySelector("#search-input");
  let city = document.querySelector("#city");
  city.innerHTML = query.value;
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSearchForm);

let query = "London";
let apiKey = "1o02ad6aa40e7b19fa37f8t5928ba37d";
let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}`;

// axios.get(apiUrl);

axios
  .get(apiUrl)
  .then((response) => {
    console.log(response.data); // 👈 This shows what was fetched
  })
  .catch((error) => {
    console.error(error);
  });
