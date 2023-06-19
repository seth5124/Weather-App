const submit = document.querySelector("#submit");
const cityName = document.querySelector("#cityName");
const weatherCard = document.querySelector(".weatherCard");
const cityNameLabel = document.querySelector(".weatherCard .cityName");
const descriptionLabel = document.querySelector("weatherCard .description");
const tempLabel = document.querySelector("weatherCard .temperature");

let apiKey;
fetch("./key.json")
  .then((response) => response.json())
  .then((json) => {
    apiKey = json.key;
  });

async function getCoords(city) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
  );
  const data = await response.json();
  const lat = data[0].lat;
  const lon = data[0].lon;

  return [lat, lon];
}

async function getWeather(city) {
  try {
    const [lat, lon] = await getCoords(city);

    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    );
    const data = await response.json();
    return {
      cityName: city,
      description: data.current.weather[0].description,
      temperature: data.current.temp,
    };
  } catch (error) {
    console.log(error);
  }
}

submit.addEventListener("click", async () => {
  let city = cityName.value;
  if (city.length < 1) return;
  let data = await getWeather(city);
  console.log(data);
  updateWeatherData(data);
});

async function getCities(searchTerm) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${apiKey}`
  );
  const data = await response.json();
  data.forEach((city) => {
    console.log(`${city.name}, ${city.state}`);
  });
}

async function updateWeatherData(data) {
  document.querySelector(".weatherCard .cityName").innerHTML = data.cityName;
  document.querySelector(".weatherCard .description").innerHTML =
    data.description;
  document.querySelector(".weatherCard .temperature").innerHTML =
    data.temperature;
}
