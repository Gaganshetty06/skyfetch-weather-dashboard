// ===============================
// WeatherApp Constructor
// ===============================
function WeatherApp() {
  this.API_KEY = "f66f9f2fbb772bdaa2ad42f25b643664";

  // DOM Elements
  this.cityInput = document.getElementById("cityInput");
  this.searchBtn = document.getElementById("searchBtn");
  this.message = document.getElementById("message");

  this.cityEl = document.getElementById("city");
  this.tempEl = document.getElementById("temp");
  this.descEl = document.getElementById("desc");
  this.iconEl = document.getElementById("icon");

  this.forecastContainer = document.getElementById("forecast");
}

// ===============================
// Init Method
// ===============================
WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener(
    "click",
    this.handleSearch.bind(this)
  );

  this.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  });

  this.showWelcome();
};

// ===============================
// Welcome Message
// ===============================
WeatherApp.prototype.showWelcome = function () {
  this.message.innerHTML = "<p>🔍 Search a city to see weather</p>";
};

// ===============================
// Handle Search
// ===============================
WeatherApp.prototype.handleSearch = function () {
  const city = this.cityInput.value.trim();

  if (!city) {
    this.showError("⚠ Please enter a city name");
    return;
  }

  this.getWeather(city);
  this.cityInput.value = "";
};

// ===============================
// Fetch Weather + Forecast
// ===============================
WeatherApp.prototype.getWeather = async function (city) {
  try {
    this.showLoading();
    this.searchBtn.disabled = true;

    const currentURL =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.API_KEY}`;

    const forecastURL =
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.API_KEY}`;

    const [currentRes, forecastRes] = await Promise.all([
      axios.get(currentURL),
      axios.get(forecastURL)
    ]);

    this.displayWeather(currentRes.data);

    const days = this.processForecastData(forecastRes.data.list);
    this.displayForecast(days);

    this.message.innerHTML = "";
  } catch (error) {
    this.showError("❌ City not found. Try again.");
  } finally {
    this.searchBtn.disabled = false;
  }
};

// ===============================
// Display Current Weather
// ===============================
WeatherApp.prototype.displayWeather = function (data) {
  this.cityEl.innerText = data.name;
  this.tempEl.innerText = `🌡 ${data.main.temp} °C`;
  this.descEl.innerText = data.weather[0].description;

  this.iconEl.src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
};

// ===============================
// Process Forecast (40 → 5 days)
// ===============================
WeatherApp.prototype.processForecastData = function (list) {
  return list
    .filter(item => item.dt_txt.includes("12:00:00"))
    .slice(0, 5);
};

// ===============================
// Display Forecast Cards
// ===============================
WeatherApp.prototype.displayForecast = function (days) {
  this.forecastContainer.innerHTML = "";

  days.forEach(day => {
    const date = new Date(day.dt_txt).toDateString();

    this.forecastContainer.innerHTML += `
      <div class="forecast-card">
        <h4>${date}</h4>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
        <p>${day.main.temp} °C</p>
        <p>${day.weather[0].description}</p>
      </div>
    `;
  });
};

// ===============================
// Loading State
// ===============================
WeatherApp.prototype.showLoading = function () {
  this.message.innerHTML = `<div class="loader"></div>`;
};

// ===============================
// Error Message
// ===============================
WeatherApp.prototype.showError = function (msg) {
  this.message.innerHTML = `<p class="error">${msg}</p>`;
};

// ===============================
// App Start
// ===============================
const app = new WeatherApp();
app.init();

// Debug (optional)
console.log(app);
