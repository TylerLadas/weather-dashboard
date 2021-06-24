// variable
const search = document.querySelector("#search");
const searchForm = document.querySelector("#search-form")
const submitBtn = document.querySelector("#submit");
const savedContainer = document.querySelector("#saved");
const currentContainer = document.querySelector("#current");
const fiveDayContainer = document.querySelector("#five-day");
const day1 = document.querySelector("#d1");
const day2 = document.querySelector("#d2");
const day3 = document.querySelector("#d3");
const day4 = document.querySelector("#d4");
const day5 = document.querySelector("#d5");
const cityName = document.querySelector("#current-city-name");
const date = document.querySelector("#current-date");
const temp = document.querySelector("#current-temp");
const wind = document.querySelector("#current-wind");
const humidity = document.querySelector("#current-humidity");
const uv = document.querySelector("#current-uv");


const apiKey = "7a0e3b7a2332de049abc9ae5197bfda0"

let cities = [];

// fetch current temp info
function fetchCurrent(city){

const cityValue = search.value;

fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityValue + '&appid=' + apiKey)

.then (function(response) {
    return response.json();
})
.then (function(response) {
    cityName.textContent = response.name + " " + moment().format('(DD/MM/YYYY)');
    temp.textContent = 'Temp: ' + response.main.temp;
    wind.textContent = 'Wind: ' + response.wind.speed;
    humidity.textContent = 'Humidity: ' + response.main.humidity;

});

}

// event listener
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    fetchCurrent();
    currentContainer.style.display = "block";
    
});