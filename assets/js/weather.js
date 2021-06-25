// container variable
const search = document.querySelector("#search");
const searchForm = document.querySelector("#search-form")
const submitBtn = document.querySelector("#submit");
const savedContainer = document.querySelector("#saved");
const currentContainer = document.querySelector("#current");
const fiveDayContainer = document.querySelector("#five-day");

// current variables
const cityName = document.querySelector("#current-city-name");
const image = document.querySelector("#current-img")
const date = document.querySelector("#current-date");
const temp = document.querySelector("#current-temp");
const wind = document.querySelector("#current-wind");
const humidity = document.querySelector("#current-humidity");
const uv = document.querySelector("#current-uv");

// api var
const apiKey = "7a0e3b7a2332de049abc9ae5197bfda0"

// empty array for local storage
let cities = [];

// fetch current city info
function fetchCurrent(city) {

const cityValue = search.value;

fetch('https://api.openweathermap.org/data/2.5/weather?units=metric&q=' + cityValue + '&appid=' + apiKey)

.then (function(response) {
    return response.json();
})

// set current values
.then (function(response) {
    let currentDate = new Date(response.dt * 1000).toLocaleDateString("en-US");
    cityName.textContent = response.name + " " + '(' + (currentDate) + ')';
    let weatherPic = response.weather[0].icon;
    image.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
    temp.textContent = 'Temp: ' + response.main.temp +'℃';
    var windSpeed = response.wind.speed * 3.6;
    var adjustedSpeed = windSpeed.toFixed(2);
    wind.textContent = 'Wind: ' + adjustedSpeed + ' km/hr';
    humidity.textContent = 'Humidity: ' + response.main.humidity + '%';

    // fetch uv and 5day info
    return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + response.coord.lat + '&lon=' + response.coord.lon + '&units=metric&appid=' + apiKey)

    .then (function(response) {
        return response.json();
    })
    
    // uv classification
    .then (function(response) {
        uv.textContent = response.current.uvi;
        if (response.current.uvi > 7) {
            uv.classList = "uv-danger"
        } else if (response.current.uvi > 2 && response.current.uvi < 7) {
            uv.classList = "uv-warning"
        } else {
            uv.classList = "uv-safe"
        }
    
        //for loop to iterate through days start at i=1 as i=0 would reference current day
        for (i = 1; i<6; i++) {
            let forecastDate = document.querySelector("#date" + [i]);
            forecastDate.textContent = new Date(response.daily[i].dt * 1000).toLocaleDateString("en-US"); ;
            let forecastTemp = document.querySelector("#temp" + [i]);
            forecastTemp.textContent =  "Temp: " + response.daily[i].temp.day + "℃";
            let forecastImg = document.querySelector("#img" + [i]);
            let forecastIcon = response.daily[i].weather[0].icon;
            forecastImg.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastIcon + "@2x.png");  
            let forecastWind = document.querySelector("#wind" + [i]);
            forecastWind.textContent = "Wind: " + response.daily[i].wind_speed + "km/hr";
            let forecastHumidity = document.querySelector("#humidity" + [i]);
            forecastHumidity.textContent = "Humidity: " + response.daily[i].humidity + "%";
        }
    })
})
};

// local storage set
function setStorage() {
    cities.push(search.value); 
    localStorage.setItem("cities", JSON.stringify(cities))
;}

// local storage get and render in saved container
function getStorage() {
    let getData = localStorage.getItem("cities");
    let savedCities = JSON.parse(getData);
    for (i = 0; i < savedCities.length; i++) {
        let savedBtn = document.createElement("button");
        savedBtn.textContent = savedCities[i];
        savedBtn.className = "savedBtn";
        savedBtn.setAttribute("type", "submit")
        savedBtn.setAttribute("value", savedCities[i]);
        savedContainer.appendChild(savedBtn);
    }
};

// event listener
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    fetchCurrent();
    currentContainer.style.display = "block";
    fiveDayContainer.style.display = "flex";
    setStorage();
    getStorage();
});

// get storage and render saved buttons on page load
getStorage();