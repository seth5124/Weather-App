const submitButton = document.querySelector("#submit");
const cityName = document.querySelector("#cityName");
const weatherCard = document.querySelector(".weatherCard");
const cityNameLabel = document.querySelector(".weatherCard .cityName");
const weatherIconDiv = document.querySelector(".weatherCard .weatherIcon");
const descriptionLabel = document.querySelector("weatherCard .description");
const tempLabel = document.querySelector("weatherCard .temperature");
const searchResults = document.querySelector("#results");

let apiKey;
fetch("./key.json")
  .then((response) => response.json())
  .then((json) => {
    apiKey = json.key;
  });

async function getWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=imperial`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

submitButton.addEventListener("click", async () => {
  updateSearchResultList(await getCities(cityName.value));
});

//API returns list of cities matching search term
async function getCities(searchTerm) {
  let [cityName,stateCode] = searchTerm.split(',');

  let apiURL= `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},US&limit=5&appid=${apiKey}`

  if (stateCode === undefined){
    apiURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},US&limit=5&appid=${apiKey}`
  }

  try{
    const response = await fetch(
      apiURL
    );
    return response.json();
  }
  catch(error){
    console.log(error);
  }

}

async function updateWeatherCard(
  cityName,
  cityState,
  description,
  temperature,
  icon
) {
  document.querySelector(
    ".weatherCard .cityName"
  ).textContent = `${cityName}, ${cityState}`;
  document.querySelector(".weatherCard .description").textContent = description;
  document.querySelector(".weatherCard .temperature").textContent = `${temperature}\u00B0F`;
  document.querySelector(
    ".weatherCard .weatherIcon"
  ).style.backgroundImage = `url('./icons/${icon}@2x.png')`;
}

function addSearchResultListItem(city) {
  let resultListItemElement = document.createElement("li");
  resultListItemElement.classList.add("searchResult");
  resultListItemElement.textContent = `${city.name}, ${city.state}`;
  resultListItemElement.addEventListener("click", async () => {
    let weatherData = await getWeatherData(city);
    console.log(weatherData);
    updateWeatherCard(
      city.name,
      city.state,
      weatherData.current.weather[0].description,
      weatherData.current.temp,
      weatherData.current.weather[0].icon
    );
    // clearSearchResultList(); Will need to be present, but left commented for debug purposes
  });
  return resultListItemElement;
}

function clearSearchResultList() {
  while (searchResults.firstChild) {
    searchResults.removeChild(searchResults.lastChild);
  }
}
function updateSearchResultList(cityList) {
  clearSearchResultList();
  cityList.forEach((city) => {
    searchResults.appendChild(addSearchResultListItem(city));
  });
}
