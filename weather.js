const apiKey = "9eb9d30c6e8264cd58e881e13119072b";
const submit = document.querySelector("#submit");
const cityName = document.querySelector("#cityName");

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
    console.log(data);
    console.log(data.current.weather[0].description);
  } catch (error) {
    console.log(error);
  }
}

submit.addEventListener("click", async () => {
  let city = cityName.value;
  if (city.length < 1) return;
  getWeather(city);
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
