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
  this.recentContainer = document.getElementById("recent-searches");

  // Storage
  this.recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
}

// ===============================
// Init
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

  this.displayRecentSearches();
  this.loadLastCity();
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

    this.saveRecentSearch(city);
    localStorage.setItem("lastCity", city);

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
// Forecast Processing
// ===============================
WeatherApp.prototype.processForecastData = function (list) {
  return list
    .filter(item => item.dt_txt.includes("12:00:00"))
    .slice(0, 5);
};

// ===============================
// Display Forecast
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
// Recent Searches (localStorage)
// ===============================
WeatherApp.prototype.saveRecentSearch = function (city) {
  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  this.recentSearches = this.recentSearches.filter(c => c !== city);
  this.recentSearches.unshift(city);

  if (this.recentSearches.length > 5) {
    this.recentSearches.pop();
  }

  localStorage.setItem("recentSearches", JSON.stringify(this.recentSearches));
  this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function () {
  this.recentContainer.innerHTML = "";

  this.recentSearches.forEach(city => {
    const btn = document.createElement("button");
    btn.innerText = city;
    btn.addEventListener("click", () => {
      this.getWeather(city);
    });
    this.recentContainer.appendChild(btn);
  });
};

// ===============================
// Auto Load Last City
// ===============================
WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    this.getWeather(lastCity);
  } else {
    this.message.innerHTML = "<p>🔍 Search a city to see weather</p>";
  }
};

// ===============================
// UI Helpers
// ===============================
WeatherApp.prototype.showLoading = function () {
  this.message.innerHTML = `<div class="loader"></div>`;
};

WeatherApp.prototype.showError = function (msg) {
  this.message.innerHTML = `<p class="error">${msg}</p>`;
};

// ===============================
// App Start
// ===============================
const app = new WeatherApp();
app.init();

console.log(app);
