//const url = 'https://api.openweathermap.org/data/2.5/forecast?lat=55.7522&lon=37.6156&lang=ru&units=metric&appid=805dae8271a22bf9bda5f622b44944a0';
const temperatureUnit = '°';
const humidityUnit = ' %';
const pressureUnit = ' мм. рт. ст.';
const windUnit = ' м/с';
let startingCity = "Москва";
const url = 'https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,surface_pressure,windspeed_10m,winddirection_10m&windspeed_unit=ms';
let hour = new Date().getHours();
async function getData() {

    let response = await fetch(url);
  
    if (response.ok) {
      let jsonData = response.json();
      return jsonData;
    } else {
      alert('Error: ' + response.status);
    }
  }

function convertPressure(value)
{
    return (value/1.33).toFixed();
}

Number.prototype.pad = function(size) 
{
    var s = String(this);
    while (s.length<(size||2)) {s = "0" + s;}
    return s;
}

function getHoursString(dateTime)
{
    let date = new Date(dateTime);
    let hours = date.getHours().pad();

    return hours;
}

function getValueWithUnit(value, unit)
{
    return `${value}${unit}`;
}
function getTemperature(value)
{
    var roundedValue = value.toFixed();
    return getValueWithUnit(roundedValue, temperatureUnit);
}

function render(data)
{
    renderCity(data);
    renderCurrentTemperature(data);
    renderCurrentDescription(data);
    renderForecast(data);
    renderDetails(data);
    // renderDayOrNight(data)
}

function renderCity(data)
{
    let cityName = document.querySelector('.current__city');
    cityName.innerHTML = "Москва";
}

function renderCurrentTemperature(data)
{
    let tmp = data.hourly.temperature_2m[hour];
    let currentTmp = document.querySelector('.current__temperature');
    currentTmp.innerHTML = getTemperature(tmp);
}

function renderCurrentDescription(data) 
{
    let tmp = data.hourly.weathercode[hour];
    if (tmp == "0") tmp="Ясно";
    if (tmp == "1" || tmp=="2") tmp="Переменная облачность";
    if (tmp == "3") tmp="Пасмурно";
    if (tmp == "45" || tmp == "48") tmp="Туман";
    if (tmp == "51" || tmp=="53" || tmp=="55" || tmp=="56" || tmp=="57") tmp="Моросит";
    if (tmp == "61" || tmp=="63" || tmp=="65" || tmp=="66" || tmp=="67") tmp="Дождь"; //Rain
    if (tmp == "71" || tmp=="73" || tmp=="75" || tmp=="77") tmp="Снег";
    let description = document.querySelector('.current__description');
    description.innerHTML = tmp;
}

function renderForecast(data)
{
    let forecastDataContainer = document.querySelector('.forecast');
    let forecasts = '';

    for(let i = hour; i<hour+data.hourly.time.length-6*24-10; i++)
    {
        let tmp = data.hourly.weathercode[i];
        let icon;
        if (tmp == "0") icon="01d"; //sun
        else if (tmp == "1" || tmp=="2") icon="02d"; //sun with clouds
        else if (tmp == "3") icon="03d"; //clouds
        else if (tmp == "45" || tmp == "48") icon="50d"; //Fog
        else if (tmp == "51" || tmp=="53" || tmp=="55" || tmp=="56" || tmp=="57") icon="10d"; //Drizzle
        else if (tmp == "61" || tmp=="63" || tmp=="65" || tmp=="66" || tmp=="67") icon="09d"; //Rain
        else if (tmp == "71" || tmp=="73" || tmp=="75" || tmp=="77") icon="13d"; //Snow
        let temp = getTemperature(data.hourly.temperature_2m[i]);
        let hours = (i==hour ? 'Сейчас' : data.hourly.time[i].slice(11));

        let template = `<div class="forecast__item">
        <div class="forecast__time">${hours}</div>
        <div class="forecast__icon icon__${icon}"></div>
        <div class="forecast__temperature">${temp}</div>
      </div>`;
        forecasts += template;
    }
    forecastDataContainer.innerHTML = forecasts;
}

function renderDetails(data)
{
    let item = data.hourly;
    let pressureValue = convertPressure(item.surface_pressure[hour]);
    let pressure = getValueWithUnit(pressureValue, pressureUnit);
    let humidity = getValueWithUnit(item.relativehumidity_2m[hour], humidityUnit);
    let feels_like = getTemperature(item.apparent_temperature[hour]);
    let wind = getValueWithUnit(item.windspeed_10m[hour], windUnit);

    renderDetailsItem('feelslike', feels_like);
    renderDetailsItem('humidity', humidity);
    renderDetailsItem('pressure', pressure);
    renderDetailsItem('wind', wind);
}

function renderDetailsItem(className, value)
{
    container = document.querySelector(`.${className}`).querySelector('.details__value');
    container.innerHTML = value;
}

function isDay(data) {
    let sunrise = data.city.sunrise*1000;
    let sunset = data.city.sunset*1000;

    let now = Date.now();
    return (now > sunrise && now<sunset);
}

// function renderDayOrNight(data)
// {
//     let attrName = isDay(data) ? 'day' : 'night';
//     transition();
//     document.documentElement.setAttribute('data-theme', attrName);
// }
function periodicTasks()
{
    setInterval(start,6000000);
    // setInterval(function() {
    //     renderDayOrNight(currentData);
    // }, 60000);
}
function start() {
    getData().then(data => {
      currentData = data;
      render(data);
      notification(data);
      periodicTasks();
    })
  }

  function transition() {
    document.documentElement.classList.add('transition');
    setTimeout(function(){
        document.documentElement.classList.remove('transition');
    }, 4000);
  }
let isChecked= false;
document.getElementById('back').style.animation = 'none';
var checkbox = document.querySelector("input[name=checkbox]");
checkbox.addEventListener('change', function() {
    if (isChecked==false)
        {
            document.getElementById('back').style.animation = "burgerBackground__Ani 0.4s forwards normal";
            isChecked=true;
        }
    else 
        {
            document.getElementById('back').style.animation = "burgerBackgroundClose__Ani 0.4s forwards normal";
            isChecked=false;
        }
});
const mediaInQuery = window.matchMedia('(max-width: 350px)');
const mediaOutQuery = window.matchMedia('(min-width: 351px) and (max-width: 768px)');
function handleTabletInChange(e) {
  if (e.matches) {
    let $navbar = document.querySelector('.navbar');
    let $navbar__wrap = document.querySelector('.navbar__wrap');
    $navbar__wrap.innerHTML = ' ';
    let $menu__items = document.querySelector('.menu__items');
    $menu__items.innerHTML=`
    <li class="search__container">
      <input type="search" id="search" maxlength="30" minlength="2" placeholder="Город" name="q" autocomplete="off" required="">
    </li>
    <li><a href="main.html">Главная</a></li>
    <li><a href="today.html">Сегодня</a></li>
    <li><a href="twoweeks.html">Две недели</a></li>
    <li><a href="month.html">Месяц</a></li>
    <li><a href="contacts.html">Контакты</a></li>  
    `;
  }
}
function handleTabletOutChange(e) {
  if (e.matches) {
    let $navbar = document.querySelector('.navbar');
    let $navbar__wrap = document.querySelector('.navbar__wrap');
    $navbar__wrap.innerHTML = `
        <ul class="navbar__menu">
            <li><a href="main.html">Главная</a></li>
            <li><a href="today.html">Сегодня</a></li>
            <li><a href="twoweeks.html">Две недели</a></li>
            <li><a href="month.html">Месяц</a></li>
            <li><a href="contacts.html">Контакты</a></li>
        </ul>
        <form class="search__container">
            <input type="search" id="search" maxlength="30" minlength="2" placeholder="Город" name="q" autocomplete="off" required="">
            <button class="search__button" type="submit"></button>
            <!-- <span class="search__icon"></span> -->
        </form>
    `;
    let $menu__items = document.querySelector('.menu__items');
    $menu__items.innerHTML=`
    <li><a href="main.html">Главная</a></li>
    <li><a href="today.html">Сегодня</a></li>
    <li><a href="twoweeks.html">Две недели</a></li>
    <li><a href="month.html">Месяц</a></li>
    <li><a href="contacts.html">Контакты</a></li>  
    `;
  }
}
mediaInQuery.addListener(handleTabletInChange, mediaInQuery)
mediaOutQuery.addListener(handleTabletOutChange, mediaOutQuery)
handleTabletInChange(mediaInQuery)
handleTabletOutChange(mediaOutQuery)
start();

  