const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "b5ad68d0d2cd6df47986076581942850"; // API key for OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        // Filter the forecasts to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clearing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

         // Extract temperature data for the chart
         const temperatureData = fiveDaysForecast.map(forecast => (forecast.main.temp - 273.15).toFixed(2));
         const dates = fiveDaysForecast.map(forecast => forecast.dt_txt.split(" ")[0]);
 
         // Create the line chart
         const ctx = document.getElementById('temperatureChart').getContext('2d');
         const temperatureChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: `Temperature (°C) in ${cityName}`,
                    data: temperatureData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue background color
                    borderColor: 'rgba(54, 162, 235, 1)', // Solid blue line color
                    borderWidth: 2 // Increase line width
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(255,255,255,0.5)' // Red color for y-axis ticks
                        },
                        grid: {
                            color: 'rgba(255,255,255,0.2)' // Light red color for y-axis grid lines
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255,255,255,0.5)' // Blue color for x-axis ticks
                        },
                        grid: {
                            color: 'rgba(255,255,255,0.3)' // Light blue color for x-axis grid lines
                        }
                    }
                }
            }
        });


const ctxHumidity = document.getElementById('histogramChart').getContext('2d');
const humidityData = fiveDaysForecast.map(forecast => forecast.main.humidity);
const histogramChart = new Chart(ctxHumidity, {
    type: 'bar',
    data: {
        labels: dates,
        datasets: [{
            label: `Humidity Level (%) in ${cityName}`,
            data: humidityData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red color for bars
            borderColor: 'rgba(255, 99, 132, 1)', // Solid red border color
            borderWidth: 1 // Border width of bars
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'rgba(255,255,255,0.5)' // Red color for y-axis ticks
                },
                grid: {
                    color: 'rgba(255,255,255,0.2)' // Light red color for y-axis grid lines
                }
            },
            x: {
                ticks: {
                    color: 'rgba(255,255,255,0.5)' // Blue color for x-axis ticks
                },
                grid: {
                    color: 'rgba(255,255,255,0.3)' // Light blue color for x-axis grid lines
                }
            }
        }
    }
});

const ctxWind = document.getElementById('windChart').getContext('2d');
const windData = fiveDaysForecast.map(forecast => forecast.wind.speed);
const windChart = new Chart(ctxWind, {
    type: 'bar',
    data: {
        labels: dates,
        datasets: [{
            label: `Wind Speed Level (M/S) in ${cityName}`,
            data: windData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Green color for bars
            borderColor: 'rgba(75, 192, 192, 1)', // Solid green border color
            borderWidth: 1 // Border width of bars
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'rgba(255,255,255,0.5)' // Red color for y-axis ticks
                },
                grid: {
                    color: 'rgba(255,255,255,0.2)' // Light red color for y-axis grid lines
                }
            },
            x: {
                ticks: {
                    color: 'rgba(255,255,255,0.5)' // Blue color for x-axis ticks
                },
                grid: {
                    color: 'rgba(255,255,255,0.3)' // Light blue color for x-axis grid lines
                }
            }
        }
    }
});

        // Creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; // Get coordinates of user location
            // Get city name from coordinates using reverse geocoding API
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => { // Show alert if user denied the location permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());










