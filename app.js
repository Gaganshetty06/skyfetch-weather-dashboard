const API_KEY = "f66f9f2fbb772bdaa2ad42f25b643664";

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  axios.get(url)
    .then(response => {
      console.log(response.data);
      displayWeather(response.data);
    })
    .catch(error => {
      console.error("Error fetching weather:", error);
    });
}

function displayWeather(data) {
  document.getElementById("city").innerText = data.name;
  document.getElementById("temp").innerText = `🌡 ${data.main.temp} °C`;
  document.getElementById("desc").innerText = data.weather[0].description;

  const iconCode = data.weather[0].icon;
  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Hardcoded city
fetchWeather("London");
