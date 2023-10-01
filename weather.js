// Wait for the DOM content to load before executing the code
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the required elements
  const searchResultContainer = document.querySelector(".searchResults");
  const apiKey = "6b0600c19d3617df15cd796658d22e42";
  const loader = document.getElementById("loader");
  const clear = document.getElementById("clear");
  const searchButton = document.querySelector(".searchBar button");
  const searchInput = document.querySelector(".searchBar input");

  // define the necessary function

  // Function to convert meter to kilometer
  function meterToKilometer(meter) {
    return meter / 1000;
  }

  // Function to convert kelvin to celsius
  function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
  }

  // Function to convert the time to UK time
  function convertTime(time) {
    const ukTime = new Date(time * 1000);
    ukTime.setUTCHours(ukTime.getUTCHours());
    return ukTime.toLocaleTimeString("en-GB", { timeZone: "Europe/London" });
  }

  // Function to convert the date
  function formatDateTime(timestamp) {
    const ukDate = new Date(timestamp * 1000);
    const year = ukDate.getUTCFullYear();
    const month = (ukDate.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = ukDate.getUTCDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}(UK time)`;
  }

  // Function to fetch weather data for a given city
  async function fetchData(cityName) {
    searchResultContainer.innerHTML = ""; // Clear the previous data
    loader.style.display = "block"; // display the loader

    // check if the user device is online or not
    if (navigator.onLine) {
      // if device is online fetch the data from the api
      const data = await fetchWeatherData(cityName);

      // Check if data is available
      if (data) {
        console.log("weather info saved in the local storage");
        saveDataInLocalStorage(cityName, data);
        sendData(data);
        console.log("weather data displaying from the api");
      } else {
        // Display "City Not Found" if data is not available
        const cityNotFound = document.createElement("h1");
        cityNotFound.innerHTML = "City Not Found";
        searchResultContainer.appendChild(cityNotFound);
      }
    } else {
      // if device is offline display the previous data stored in the localStorage
      let data = false;
      saveDataInLocalStorage(cityName, data);
      console.log("weather data displaying from the local storage");
    }

    loader.style.display = "none"; // hide the loader
  }

  // Function to fetch weather data from the API
  async function fetchWeatherData(cityName) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
      );

      // Check if the API response is successful
      if (response.ok) {
        const data = await response.json();

        // Extract required weather data from the API response
        return {
          cityName: data.name,
          country: data.sys.country,
          timestamp: data.dt,
          weatherDesription: data.weather[0].description,
          weatherIcon: data.weather[0].icon,
          temperature: kelvinToCelsius(data.main.temp),
          pressure: data.main.pressure,
          windSpeed: data.wind.speed,
          humidity: data.main.humidity,
          date: formatDateTime(data.dt),
          time: convertTime(data.dt),
          sunRise: convertTime(data.sys.sunrise),
          sunSet: convertTime(data.sys.sunset),
          feelsLikeTemp:
            kelvinToCelsius(data.main.feels_like) || "No Data found",
          visiblity: meterToKilometer(data.visibility) || "No Data Found",
        };
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error fetching weather data:", error);
      return null;
    }
  }

  function saveDataInLocalStorage(cityName, data) {
    if (data) {
      // if user is online get the latest data and store it in the local storage
      const weatherData = JSON.stringify(data);
      localStorage.setItem(cityName, weatherData);
      console.log("weather info saved in localStorage");

      // retrive the data from the local storge
      const weatherinfo = localStorage.getItem(cityName);
      const parsedData = JSON.parse(weatherinfo);

      // call the create element function to display the result
      createWeatherElement(parsedData);
    } else {
      console.log(data);
      // retrive the previus data from the local storge
      const weatherinfo = localStorage.getItem(cityName);
      const parsedData = JSON.parse(weatherinfo);

      // call the create element function to display the result
      createWeatherElement(parsedData);
      console.log("Weather info is being displyed from the localStorage data");
    }
  }

  // Function to create weather element and display it in the search results container
  function createWeatherElement(data) {
    try {
      const weatherContainer = document.createElement("div");
      weatherContainer.classList.add("weatherContainer");

      // Display city name, temperature, and weather icon in the cityWeather div
      const cityWeatherElement = document.createElement("div");
      cityWeatherElement.classList.add("cityWeather");

      const cityElement = document.createElement("div");
      cityElement.innerHTML = `${data.cityName}, ${data.country}`;
      cityWeatherElement.appendChild(cityElement);

      const weatherIconElement = document.createElement("img");
      weatherIconElement.src = `http://openweathermap.org/img/w/${data.weatherIcon}.png`;
      cityWeatherElement.appendChild(weatherIconElement);

      const temperatureElement = document.createElement("div");
      temperatureElement.innerHTML = `${data.temperature}°C`;
      cityWeatherElement.appendChild(temperatureElement);

      const timeElement = document.createElement("div");
      timeElement.innerHTML = `${data.time}`;
      cityWeatherElement.appendChild(timeElement);

      const dateElement = document.createElement("div");
      dateElement.innerHTML = `${data.date}`;
      cityWeatherElement.appendChild(dateElement);

      // Set the CSS classes for positioning the elements
      cityElement.classList.add("city");
      weatherIconElement.classList.add("weatherIcon");
      temperatureElement.classList.add("temperature");
      timeElement.classList.add("time");
      dateElement.classList.add("date");

      // Display additional weather details in the weatherDetails div
      const weatherDetailsElement = document.createElement("div");
      weatherDetailsElement.classList.add("weatherDetails");

      const pressureElement = document.createElement("div");
      pressureElement.innerHTML = `Pressure:<br>${data.pressure} hPa`;
      weatherDetailsElement.appendChild(pressureElement);

      const windSpeedElement = document.createElement("div");
      windSpeedElement.innerHTML = `Wind Speed:<br>${data.windSpeed} km/h`;
      weatherDetailsElement.appendChild(windSpeedElement);

      const humidityElement = document.createElement("div");
      humidityElement.innerHTML = `Humidity:<br>${data.humidity}%`;
      weatherDetailsElement.appendChild(humidityElement);

      const weatherDesriptionElement = document.createElement("div");
      weatherDesriptionElement.innerHTML = `Weather Description:<br>${data.weatherDesription}`;
      weatherDetailsElement.appendChild(weatherDesriptionElement);

      const sunRiseElement = document.createElement("div");
      sunRiseElement.innerHTML = `Sunrise:<br>${data.sunRise} `;
      weatherDetailsElement.appendChild(sunRiseElement);

      const sunSetElement = document.createElement("div");
      sunSetElement.innerHTML = `Sunset:<br>${data.sunSet}`;
      weatherDetailsElement.appendChild(sunSetElement);

      const feelsLikeTemperauture = document.createElement("div");
      feelsLikeTemperauture.innerHTML = `Feels like Temp:<br>${data.feelsLikeTemp} °C`;
      weatherDetailsElement.appendChild(feelsLikeTemperauture);

      const visibilityElement = document.createElement("div");
      visibilityElement.innerHTML = `Visibility:<br>${data.visiblity} KM`;
      weatherDetailsElement.appendChild(visibilityElement);

      // Append weather elements to the weather container
      weatherContainer.appendChild(cityWeatherElement);
      weatherContainer.appendChild(weatherDetailsElement);

      // Append the weather container to the search results container
      searchResultContainer.appendChild(weatherContainer);
    } catch (error) {
      console.log("Error" + error);
    }
  }

  // Event listener for search input keyup
  if (searchInput) {
    searchInput.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        const cityName = searchInput.value;
        if (cityName.length !== 0) {
          fetchData(cityName);
        }
      }
    });
  }

  // Event listener for search button click
  if (searchButton) {
    searchButton.addEventListener("click", function () {
      const cityName = searchInput.value;
      if (cityName.length !== 0) {
        fetchData(cityName);
      }
    });
  }

  // Event listener for clear button click
  clear.addEventListener("click", function () {
    searchInput.value = "";
    clear.style.display = "none";
  });

  // hide cross while there is no input
  searchInput.addEventListener("input", function () {
    cityName = searchInput.value;
    if (cityName.length != 0) {
      clear.style.display = "block";
    } else {
      clear.style.display = "none";
    }
  });

  // hide cross while loading the page
  window.onload = () => {
    clear.style.display = "none";
  };

  // program to send data in the backend
  // Function to send weather data to the backend with rate limiting
  async function sendData(data) {
    const url = "http://localhost/weatherApp/recorddata.php";

    const weatherData = {
      city: data.cityName,
      country: data.country,
      weatherCondition: data.weatherDesription,
      weatherIcon: data.weatherIcon,
      temperature: data.temperature,
      pressure: data.pressure,
      windSpeed: data.windSpeed,
      humidity: data.humidity,
      timestamp: data.timestamp,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(weatherData),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
    }
  }

  // call the function fetchData to display the weather of the default city
  fetchData("leeds");
});
