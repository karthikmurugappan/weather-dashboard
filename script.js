var key = '09f33dd5f96b20eadd583ca5cdd43391';
var searchForm = document.querySelector('#city-search');
var cityEl = document.querySelector('#cityName');
var tempEl = document.querySelector('#temp_now');
var windEl = document.querySelector('#wind_now');
var humidityEl = document.querySelector('#humidity_now');
var iconEl = document.querySelector('#current-icon-image');
var a_input = document.querySelector('#q');
var q = '';

var search = JSON.parse(localStorage.getItem('search')) || [];


function display() {
    var searchHistoryHeaderEl = document.querySelector('#search_head');

    searchHistoryHeaderEl.classList.add('x');
}

function query() {
    
    var Api_Url = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${key}`

    fetch(Api_Url)
    .then(response => response.json())
    .then(data => {
        var { lat, lon, state } = data[0];

        var weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;

        fetch(weatherURL)
        .then(response => response.json())
        .then(data => {
            var { name: currentCity, main: { temp: currentTemp, humidity: currentHumidity }, wind: { speed: currentWindSpeed }, weather } = data;
            var code = weather[0].icon;
            var image = `https://openweathermap.org/img/wn/${code}@2x.png`;

            iconEl.setAttribute('src', image);
            cityEl.textContent = `Current Weather for: ${currentCity}, ${state}`;
            tempEl.textContent = `Temp: ${Math.round(currentTemp)} \u00B0F`;
            humidityEl.textContent = `Humidity: ${currentHumidity}%`;
            windEl.textContent = `Wind Speed: ${Math.round(currentWindSpeed)} MPH`;
            

            var five_day_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;

            fetch(five_day_url)
            .then(response => response.json())
            .then(data => {
                document.querySelector('.card-group').innerHTML = '';

                var five_day_head = document.querySelector('#five_day_head');
                five_day_head.classList.add('x');

                for (let i = 0; i < 40; i += 8) {
                var { main: { temp }, wind: { speed: wind }, main: { humidity }, weather } = data.list[i];
                var icon = weather[0].icon;

                var card_title = document.createElement('h3');
                var card_temp = document.createElement('p');
                var card_wind = document.createElement('p');
                var card_humidity = document.createElement('p');
                var card_body = document.createElement('div');
                var card_icon = document.createElement('img');
                var card_el = document.createElement('div');
                
                card_title.className = 'title';
                card_body.className = 'card-body';
                card_el.className = 'card mb-2';
                

                card_title.textContent = dayjs(data.list[i].dt_txt).format('dddd');
                card_icon.setAttribute('src', `https://openweathermap.org/img/wn/${icon}.png`);
                card_temp.textContent = `Temp: ${Math.round(temp)} \u00B0F`;
                card_wind.textContent = `Wind: ${Math.round(wind)} MPH`;
                card_humidity.textContent = `Humidity: ${humidity}%`;

                card_body.appendChild(card_title);
                card_body.appendChild(card_temp);
                card_body.appendChild(card_humidity);
                card_body.appendChild(card_wind);
                card_body.appendChild(card_icon);
                card_el.appendChild(card_body);
                document.querySelector('.card-group').appendChild(card_el);
                }
            });
        });
    });

}

var handleNewSearch = function (event) {
    event.preventDefault();

    q = a_input.value.trim();

    query();
}


display();
searchForm.addEventListener('submit', handleNewSearch);