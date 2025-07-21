const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key.

const input = document.getElementById("search-input");
const button = document.getElementById("search-button");
const suggestions = document.getElementById("suggestions");
const weatherResult = document.getElementById("weather-result");

const cities = [
  "New York", "London", "Paris", "Tokyo", "Delhi", "Mumbai", "Dubai",
  "Sydney", "Moscow", "Toronto", "Berlin", "Beijing", "Los Angeles"
];


input.addEventListener("input", () => {
  const value = input.value.trim().toLowerCase();
  if (!value) {
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
    return;
  }

  const filtered = cities.filter(city => city.toLowerCase().startsWith(value));
  if (filtered.length === 0) {
    suggestions.innerHTML = "<li class='suggestion-item'>No matches found</li>";
  } else {
    suggestions.innerHTML = filtered
      .map(city => `<li class="suggestion-item">${city}</li>`)
      .join("");
  }
  suggestions.style.display = "block";
});


suggestions.addEventListener("click", (e) => {
  if (e.target.classList.contains("suggestion-item")) {
    input.value = e.target.textContent;
    suggestions.style.display = "none";
    fetchWeather(input.value.trim());
  }
});


document.addEventListener("click", (e) => {
  if (!input.contains(e.target) && !suggestions.contains(e.target)) {
    suggestions.style.display = "none";
  }
});


button.addEventListener("click", () => {
  suggestions.style.display = "none";
  fetchWeather(input.value.trim());
});


input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    suggestions.style.display = "none";
    fetchWeather(input.value.trim());
  }
});

input.addEventListener("input", () => {
  if (input.value.trim() === "") {
    weatherResult.style.display = "none";
    document.getElementById("loader").style.display = "none";
  }
});

function fetchWeather(city) {
  if (!city) return;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;


  document.getElementById("loader").style.display = "block";
  weatherResult.style.display = "none";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod !== 200) throw new Error(data.message);

      const { name, main, weather, wind, sys } = data;
      const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
      const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
      const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();

      weatherResult.innerHTML = `
        <h2>📍 ${name}</h2>
        <img src="${iconUrl}" alt="${weather[0].main}" />
        <p><strong>🌡️ Temperature:</strong> ${main.temp}°C</p>
        <p><strong>🤗 Feels like:</strong> ${main.feels_like}°C</p>
        <p><strong>🌥️ Weather:</strong> ${weather[0].main} (${weather[0].description})</p>
        <p><strong>💧 Humidity:</strong> ${main.humidity}%</p>
        <p><strong>💨 Wind:</strong> ${wind.speed} m/s</p>
        <p><strong>🌅 Sunrise:</strong> ${sunrise}</p>
        <p><strong>🌇 Sunset:</strong> ${sunset}</p>
      `;

      document.getElementById("loader").style.display = "none";
      weatherResult.style.display = "block";
    })
    .catch((err) => {
      weatherResult.innerHTML = `<p style="color: red;">⚠️ ${err.message}</p>`;
      document.getElementById("loader").style.display = "none";
      weatherResult.style.display = "block";
    });
}