const API_KEY = "YOUR_API_KEY_HERE";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");

async function getWeather(city) {
  try {
    showLoading();
    searchBtn.disabled = true;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await axios.get(url);

    displayWeather(response.data);
    message.innerHTML = "";
  } catch (error) {
    showError("❌ City not found. Please try again.");
  } finally {
    searchBtn.disabled = false;
  }
}

function displayWeather(data) {
  document.getElementById("city").innerText = data.name;
  document.getElementById("temp").innerText = `🌡 ${data.main.temp} °C`;
  document.getElementById("desc").innerText = data.weather[0].description;

  const icon = data.weather[0].icon;
  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function showError(msg) {
  message.innerHTML = `<p class="error">${msg}</p>`;
}

function showLoading() {
  message.innerHTML = `<div class="loader"></div>`;
}

// Button click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (!city) {
    showError("⚠ Please enter a city name");
    return;
  }

  getWeather(city);
  cityInput.value = "";
});

// Enter key support
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Initial message
message.innerHTML = "<p>🔍 Search a city to see weather</p>";
