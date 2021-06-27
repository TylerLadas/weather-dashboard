// container variable
const search = document.querySelector("#search");
const searchForm = document.querySelector("#search-form")
const submitBtn = document.querySelector("#submit");
const savedContainer = document.querySelector("#saved");
const currentContainer = document.querySelector("#current");
const fiveDayContainer = document.querySelector("#five-day");
let cityValue;

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
let citiesArray;

if (localStorage.getItem('cities')) {
    citiesArray = JSON.parse(localStorage.getItem('cities'))
 } else {
    citiesArray = []
 }

 localStorage.setItem("cities", JSON.stringify(citiesArray))
 const savedCities = JSON.parse(localStorage.getItem("cities"))

// fetch current city info
function fetchCurrent(city) {

// let cityValue = search.value;

fetch('https://api.openweathermap.org/data/2.5/weather?units=metric&q=' + city + '&appid=' + apiKey)

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
            let convertWind = response.daily[i].wind_speed * 3.6;
            let adjustedForecastWind = convertWind.toFixed(2)
            forecastWind.textContent = "Wind: " + adjustedForecastWind + "km/hr";
            let forecastHumidity = document.querySelector("#humidity" + [i]);
            forecastHumidity.textContent = "Humidity: " + response.daily[i].humidity + "%";
        }
    })
})
};

// local storage set
function setStorage() {
    citiesArray.push(search.value); 
    localStorage.setItem("cities", JSON.stringify(citiesArray))
;}

const handler = function(event) {
    event.preventDefault;
    currentContainer.style.display = "block";
    fiveDayContainer.style.display = "flex";
    cityValue = $(this).val();
    fetchCurrent(cityValue); 
}

// create saved buttons
function createButton(text) {
let savedBtn = document.createElement("button");
savedBtn.textContent = text
savedBtn.className = "savedBtn";
savedBtn.setAttribute("type", "submit")
savedBtn.setAttribute("value", text);
savedBtn.addEventListener("click", handler)
savedContainer.appendChild(savedBtn);
};    

// loop through array on page load and render saved buttons
savedCities.forEach(function(item) {
    createButton(item)
}); 

// event listener
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    cityValue = search.value;
    if (search.value === "") {
        alert("Please enter a city name!")
        return
    }
    fetchCurrent(cityValue);
    currentContainer.style.display = "block";
    fiveDayContainer.style.display = "flex";
    setStorage();
    JSON.parse(localStorage.getItem("cities"))
    createButton(search.value);
    search.value = "";
});

$(".savedBtn").click(handler);

