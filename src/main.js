// Configuration for APIs
const CONFIG = {
          ipifyUrl: "https://api.ipify.org?format=json",
          ipApiUrl: "https://apiip.net/api/check",
          ipApiKey: "9c35b194-d520-4ebd-a41a-d67cbfcb3638",
          openWeatherMapUrl: "https://api.openweathermap.org/data/2.5/weather",
          openWeatherApiKey: "ba4936b0097bb44f9d38f2bbee24bc54",
      };
      
      // Fetch user's IP address
      async function fetchIpAddress() {
          const response = await fetch(CONFIG.ipifyUrl);
          if (!response.ok) throw new Error('Failed to fetch IP address');
          const data = await response.json();
          return data.ip;
      }
      
      // Fetch location information based on IP
      async function fetchLocationData(ip) {
          const response = await fetch(`${CONFIG.ipApiUrl}?ip=${ip}&accessKey=${CONFIG.ipApiKey}`);
          if (!response.ok) throw new Error('Failed to fetch location data');
          return await response.json();
      }
      
      // Fetch weather data using latitude and longitude
      async function fetchWeatherData(lat, lon) {
          const response = await fetch(`${CONFIG.openWeatherMapUrl}?lat=${lat}&lon=${lon}&appid=${CONFIG.openWeatherApiKey}`);
          if (!response.ok) throw new Error('Failed to fetch weather data');
          return await response.json();
      }
      
      // Utility function to format timestamp to "Sunday 10 Oct"
      function formatDate(timestamp) {
          const date = new Date(timestamp * 1000);
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
      }
      
      // Utility function to format Unix timestamp into "HH:MM"
      function formatTime(timestamp) {
          const date = new Date(timestamp * 1000);
          return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      }
      
      // Convert Kelvin to Celsius
      function kelvinToCelsius(kelvin) {
          return kelvin - 273.15;
      }
      
      // Convert Celsius to Kelvin
      function celsiusToKelvin(celsius) {
          return celsius + 273.15;
      }
      
      // Update UI with weather data
      function updateWeatherUI(weatherData) {
          document.getElementById("localisation").textContent = weatherData.name;
          document.getElementById("date-today").textContent = formatDate(weatherData.dt);
          document.getElementById("sunrise").textContent = formatTime(weatherData.sys.sunrise);
          document.getElementById("sunset").textContent = formatTime(weatherData.sys.sunset);
          document.getElementById("wind_speed").textContent = `${weatherData.wind.speed} Km/h`;
          document.getElementById("humidity").textContent = `${weatherData.main.humidity}%`;
          document.getElementById("pressure").textContent = weatherData.main.pressure;
      
          const tempInKelvin = weatherData.main.temp;
          const tempElement = document.getElementById('tempurature');
          tempElement.dataset.kelvin = tempInKelvin; // Store Kelvin value in data attribute
          updateTemperatureDisplay(tempInKelvin, 'K');
      
          if (weatherData.weather && weatherData.weather[0]) {
              changeWeatherIcon(weatherData.weather[0].main.toLowerCase());
          }
      }
      
      // Update temperature display
      function updateTemperatureDisplay(temp, unit) {
          const tempElement = document.getElementById('tempurature');
          tempElement.textContent = `${temp.toFixed(1)}°`;
      }
      
      // Change weather icon based on weather conditions
      function changeWeatherIcon(weather = "clear", DayTime = "day") {
          const weatherImage = document.getElementById('weatherimage');
          if (weatherImage) {
              weatherImage.src = `img/${DayTime}/${weather}.png`;
          } else {
              console.error('Weather image element not found');
          }
      }
      
      // Handle temperature toggle between Celsius and Kelvin
      document.getElementById('toggleTwo').addEventListener('change', function() {
          const tempInKelvin = parseFloat(document.getElementById('tempurature').dataset.kelvin);
          if (this.checked) {
              const tempInCelsius = kelvinToCelsius(tempInKelvin);
              updateTemperatureDisplay(tempInCelsius, 'C');
          } else {
              updateTemperatureDisplay(tempInKelvin, 'K');
          }
      });
      
      // Fetch and display weather data
      async function displayWeatherData() {
          try {
              const ip = await fetchIpAddress();
              const locationData = await fetchLocationData(ip);
              const weatherData = await fetchWeatherData(locationData.latitude, locationData.longitude);
              updateWeatherUI(weatherData);
          } catch (error) {
              console.error('Error fetching or displaying weather data:', error);
          }
      }
      
      // Refresh button event listener
      document.getElementById("btn-refresh").addEventListener("click", () => {
          window.location.reload();
      });
      
      // Initialize
      displayWeatherData();
      