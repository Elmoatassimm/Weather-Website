fetch("https://api.ipify.org?format=json")
    .then((res) => res.json())
    .then((data) => {
        let adressip = data.ip;
        const apiip_key = "9c35b194-d520-4ebd-a41a-d67cbfcb3638";
        
        // Fetch details using the IP and API key
        return fetch(`https://apiip.net/api/check?ip=${adressip}&accessKey=${apiip_key}`);
    })
    .then((res) => res.json())
    .then((location_info) => {
        const openweathermap_api_key = "ba4936b0097bb44f9d38f2bbee24bc54";
        
        // Use the latitude and longitude from location_info
        const lat = location_info.latitude;
        const lon = location_info.longitude;

        console.log(lat);
        console.log(lon);

        // Fetch weather data using latitude and longitude
        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openweathermap_api_key}`);
    })
    .then((res) => res.json())
    .then((weather_data) => console.log(weather_data))
    .catch((error) => console.error('Error:', error));

    