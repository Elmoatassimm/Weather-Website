// Function to fetch weather data
async function getWeatherData() {
          try {
              // Get IP address
              const ipRes = await fetch("https://api.ipify.org?format=json");
              const ipData = await ipRes.json();
              const adressip = ipData.ip;
      
              // Get location info using IP
              const apiip_key = "9c35b194-d520-4ebd-a41a-d67cbfcb3638";
              const locationRes = await fetch(`https://apiip.net/api/check?ip=${adressip}&accessKey=${apiip_key}`);
              const location_info = await locationRes.json();
      
              // Get weather info using location (lat, lon)
              const lat = location_info.latitude;
              const lon = location_info.longitude;
              const openweathermap_api_key = "ba4936b0097bb44f9d38f2bbee24bc54";
              const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openweathermap_api_key}`);
              const weather_data = await weatherRes.json();
      
              // Return the weather data
              return weather_data;
          } catch (error) {
              console.error('Error:', error);
              return null;
          }
      }
      
      // Function to display weather data
      async function displayWeatherData() {
          try {
              const weather_data = await getWeatherData();
              if (weather_data) {
                  console.log(weather_data);
                  let localisation = document.getElementById("localisation");
                  let date = document.getElementById("date-today");
                  let tempp = document.getElementById("tempurature");
                  let sunrise = document.getElementById("sunrise");
                  let sunset = document.getElementById("sunset");
      
                  localisation.textContent = weather_data.name;
                  date.textContent = formatTimestampToDayAndMonth(weather_data.dt);
                  // Display sunrise and sunset times in HH:MM format
            sunrise.textContent = formatTimestampToTime(weather_data.sys.sunrise);
            sunset.textContent = formatTimestampToTime(weather_data.sys.sunset);
      
                  // Store the temperature in Kelvin
                  tempInKelvin = weather_data.main.temp;
                  updateTemperatureDisplay(tempInKelvin, 'K');
      
                  if (weather_data.weather && weather_data.weather[0]) {
                      changeWeatherIcon(weather_data.weather[0].main.toLowerCase());
                  } else {
                      console.error('Weather data is not in expected format.');
                  }
              }
          } catch (error) {
              console.error('Error:', error);
          }
      }
      
      // Function to change the weather icon based on the weather data
      function changeWeatherIcon(weather = "clear", DayTime = "day") {
          const weatherImage = document.getElementById('weatherimage');
          if (weatherImage) {
              weatherImage.src = `img/${DayTime}/${weather}.png`; // Ensure the file extension is correct
          } else {
              console.error('Image element not found.');
          }
      }
      
      // Function to format Unix timestamp to "Sunday 10 Oct" format
      function formatTimestampToDayAndMonth(timestamp) {
          const date = new Date(timestamp * 1000);
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const dayName = days[date.getDay()];
          const day = date.getDate();
          const monthName = months[date.getMonth()];
          return `${dayName} ${day} ${monthName}`;
      }
      
      // Function to convert Kelvin to Celsius
      function kelvinToCelsius(kelvin) {
          return kelvin - 273.15;
      }
      
      // Update temperature display function
      function updateTemperatureDisplay(temp, unit) {
          const tempElement = document.getElementById('tempurature');
          tempElement.textContent = `${temp.toFixed(1)}°`;
      }
      
      // Toggle event listener for temperature conversion between Kelvin and Celsius
      document.getElementById('toggleTwo').addEventListener('change', function() {
          if (this.checked) {
              // Convert to Celsius
              const tempInCelsius = kelvinToCelsius(tempInKelvin);
              updateTemperatureDisplay(tempInCelsius, 'C');
          } else {
              // Show Kelvin
              updateTemperatureDisplay(tempInKelvin, 'K');
          }
      });


      // Function to format the Unix timestamp into HH:MM format
function formatTimestampToTime(timestamp) {
          const date = new Date(timestamp * 1000); // Convert to milliseconds
          let hours = date.getHours();
          let minutes = date.getMinutes();
      
          // Add leading zero to minutes if necessary
          minutes = minutes < 10 ? '0' + minutes : minutes;
      
          // Return time in HH:MM format
          return `${hours}:${minutes}`;
      }
      let btn_refresh = document.getElementById("btn-refresh");
btn_refresh.addEventListener("click", (e) => {
    window.location.reload(); 
});

      
      // Call the function to display weather data
      displayWeatherData();
      
     
      