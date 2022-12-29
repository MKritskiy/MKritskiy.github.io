//const url = 'https://api.openweathermap.org/data/2.5/forecast?lat=55.7522&lon=37.6156&lang=ru&units=metric&appid=805dae8271a22bf9bda5f622b44944a0';
const temperatureUnit = "°";
const humidityUnit = " %";
const pressureUnit = " мм. рт. ст.";
const windUnit = " м/с";
let startingCity = "Москва";
const url =
  "https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,surface_pressure,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max&windspeed_unit=ms&timezone=Europe%2FMoscow";
var currentData;
let date = new Date();
async function getData() {
  let response = await fetch(url);

  if (response.ok) {
    let jsonData = response.json();
    return jsonData;
  } else {
    alert("Error: " + response.status);
  }
}

function convertPressure(value) {
  return (value / 1.33).toFixed();
}
Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

function getHoursString(dateTime) {
  let date = new Date(dateTime);
  let hours = date.getHours().pad();

  return hours;
}

function getValueWithUnit(value, unit) {
  return `${value}${unit}`;
}
function getTemperature(value) {
  var roundedValue = value.toFixed();
  return getValueWithUnit(roundedValue, temperatureUnit);
}
function getWeekDay(weekDay) {
  if (weekDay % 7 == 1) return "Пн";
  if (weekDay % 7 == 2) return "Вт";
  if (weekDay % 7 == 3) return "Ср";
  if (weekDay % 7 == 4) return "Чт";
  if (weekDay % 7 == 5) return "Пт";
  if (weekDay % 7 == 6) return "Сб";
  if (weekDay % 7 == 0) return "Вс";
}
function getMounthName(mounthNum) {
  if (mounthNum == 0) return "Янв";
  if (mounthNum == 1) return "Фев";
  if (mounthNum == 2) return "Март";
  if (mounthNum == 3) return "Апр";
  if (mounthNum == 4) return "Май";
  if (mounthNum == 5) return "Июнь";
  if (mounthNum == 6) return "Июль";
  if (mounthNum == 7) return "Авг";
  if (mounthNum == 8) return "Сент";
  if (mounthNum == 9) return "Окт";
  if (mounthNum == 10) return "Нояб";
  if (mounthNum == 11) return "Дек";
}

function getAverageHtmlAmplitude(data) {
  let avgAmplitude;
  let sum = 0;
  let first;
  let second;
  for (let i = 0; i < data.length - 1; i++) {
    if (i == 0) {
      first = parseInt(data[i].innerHTML.slice(4, -1));
    } else {
      first = parseInt(data[i].innerHTML.slice(0, -1));
    }
    second = parseInt(data[i + 1].innerHTML.slice(0, -1));
    sum += Math.abs(first - second);
  }
  avgAmplitude = sum / data.length;
  return Math.floor(avgAmplitude);
}
function getAverageAmplitude(data) {
  let avgAmplitude;
  let sum = 0;
  for (let i = 0; i < data.length - 1; i++) {
    sum += parseInt(data[i]) - parseInt(data[i + 1]);
  }
  avgAmplitude = sum / data.length;
  return Math.round(avgAmplitude);
}

function render(data) {
  renderCity(data);
  renderRealForecast(data);
  renderRandForecast(data);
  renderSunriseCanvas(data);
  renderPrecipationsCanvas(data);
  renderSunriseAxis(data);
  renderPrecipationAxis(data);
}

function renderCity(data) {
  let cityName = document.querySelector(".current__city");
  cityName.innerHTML = "Москва";
}

function renderRealForecast(data) {
  let forecastDataContainer = document.querySelector(".forecast");
  let forecasts = "";
  for (let i = 0; i < data.daily.time.length; i++) {
    let tmp = data.daily.weathercode[i];
    let icon;
    if (tmp == "0") icon = "01d";
    else if (tmp == "1" || tmp == "2") icon = "02d";
    else if (parseInt(tmp) >= 3 && parseInt(tmp) < 45) icon = "03d";
    else if (parseInt(tmp) >= 45 && parseInt(tmp) < 51) icon = "50d";
    else if (parseInt(tmp) >= 51 && parseInt(tmp) < 61) icon = "10d";
    else if (parseInt(tmp) >= 61 && parseInt(tmp) < 71) icon = "09d";
    else if (parseInt(tmp) >= 71 && parseInt(tmp) < 80) icon = "13d";
    else if (parseInt(tmp) >= 80 && parseInt(tmp) < 85) icon = "09d";
    else if (parseInt(tmp) >= 85 && parseInt(tmp) < 95) icon = "13d";
    else if (parseInt(tmp) >= 95) icon = "11d";
    let max_temp =
      i == 0
        ? "Макс " + getTemperature(data.daily.temperature_2m_max[i])
        : getTemperature(data.daily.temperature_2m_max[i]);
    let min_temp =
      i == 0
        ? "Мин " + getTemperature(data.daily.temperature_2m_min[i])
        : getTemperature(data.daily.temperature_2m_min[i]);
    let weekDay = i == 0 ? "Сегодня" : getWeekDay(new Date().getDay() + i);
    date.setDate(date.getDate() + i);
    let day = date.getDate() + " " + getMounthName(date.getMonth());
    date.setDate(date.getDate() - i);
    let template = `<div class="forecast__item">
        <div class="forecast__time">${weekDay}</div>
        <div class="forecast__day" style="opacity: 0.7;">${day}</div>
        <div class="forecast__icon icon__${icon}"></div>
        <div class="forecast__max__temperature">${max_temp}</div>
        <div class="forecast__min__temperature" style="opacity: 0.7">${min_temp}</div>
      </div>`;
    forecasts += template;
  }
  forecastDataContainer.innerHTML = forecasts;
}
function renderRandForecast(data) {
  let forecastDataContainer = document.querySelector(".forecast");
  let accurateMaxTemp = [
    ...document.querySelectorAll(".forecast__max__temperature"),
  ];
  let avarageMaxTemp = accurateMaxTemp.reduce(
    (sum, current, index) =>
      index == 0
        ? (sum * (index + 1) + parseInt(current.innerHTML.slice(4, -1))) /
          (index + 2)
        : (sum * (index + 1) + parseInt(current.innerHTML.slice(0, -1))) /
          (index + 2),
    0
  );
  let averageMaxTempAmplitude = getAverageHtmlAmplitude(accurateMaxTemp);
  let accurateMinTemp = [
    ...document.querySelectorAll(".forecast__min__temperature"),
  ];
  let avarageMinTemp = accurateMinTemp.reduce(
    (sum, current, index) =>
      index == 0
        ? (sum * (index + 1) + parseInt(current.innerHTML.slice(4, -1))) /
          (index + 2)
        : (sum * (index + 1) + parseInt(current.innerHTML.slice(0, -1))) /
          (index + 2),
    0
  );
  let averageMinTempAmplitude = getAverageHtmlAmplitude(accurateMinTemp);
  let forecasts = forecastDataContainer.innerHTML;
  let avgWeathercode = data.daily.weathercode.reduce(
    (sum, current, index) =>
      (sum * (index + 1) + parseInt(current)) / (index + 2),
    0
  );
  let avgWeathercodeAmplitude = getAverageAmplitude(data.daily.weathercode); //data.daily.weathercode[i];
  Math.seedrandom(new Date().getDate());
  for (let i = 0; i < 8; i++) {
    tmp = (
      Math.floor(avgWeathercode) +
      Math.floor(Math.random() * avgWeathercodeAmplitude)
    ).toFixed();
    //Иконки
    let icon;
    if (tmp == "0") icon = "01d";
    else if (tmp == "1" || tmp == "2") icon = "02d";
    else if (parseInt(tmp) >= 3 && parseInt(tmp) < 45) icon = "03d";
    else if (parseInt(tmp) >= 45 && parseInt(tmp) < 51) icon = "50d";
    else if (parseInt(tmp) >= 51 && parseInt(tmp) < 61) icon = "10d";
    else if (parseInt(tmp) >= 61 && parseInt(tmp) < 71) icon = "09d";
    else if (parseInt(tmp) >= 71 && parseInt(tmp) < 80) icon = "13d";
    else if (parseInt(tmp) >= 80 && parseInt(tmp) < 85) icon = "09d";
    else if (parseInt(tmp) >= 85 && parseInt(tmp) < 95) icon = "13d";
    else if (parseInt(tmp) >= 95) icon = "11d";
    //Макс мин температура
    let max_temp =
      Math.floor(avarageMaxTemp) +
      Math.floor(
        Math.random() * averageMaxTempAmplitude * 2 - averageMaxTempAmplitude
      );
    let min_temp =
      Math.floor(avarageMinTemp) +
      Math.floor(
        Math.random() * averageMinTempAmplitude * 2 - averageMinTempAmplitude
      );

    //Дни недели
    let weekDay = getWeekDay(new Date().getDay() + 7 + i);

    //Дни + название месяца
    date.setDate(date.getDate() + 7 + i);
    let day = date.getDate() + " " + getMounthName(date.getMonth());
    date.setDate(date.getDate() - 7 - i);

    //Добавление в прогноз
    let template = `<div class="forecast__item">
        <div class="forecast__time">${weekDay}</div>
        <div class="forecast__day" style="opacity: 0.7;">${day}</div>
        <div class="forecast__icon icon__${icon}"></div>
        <div class="forecast__max__temperature">${max_temp}</div>
        <div class="forecast__min__temperature" style="opacity: 0.7">${min_temp}</div>
      </div>`;
    forecasts += template;
  }
  forecastDataContainer.innerHTML = forecasts;
}

function periodicTasks() {
  setInterval(start, 6000000);
}
function start() {
  getData().then((data) => {
    currentData = data;
    render(data);
    notification(data);
    periodicTasks();
  });
}

function transition() {
  document.documentElement.classList.add("transition");
  setTimeout(function () {
    document.documentElement.classList.remove("transition");
  }, 4000);
}

let isChecked = false;
document.getElementById("back").style.animation = "none";
var checkbox = document.querySelector("input[name=checkbox]");
checkbox.addEventListener("change", function () {
  if (isChecked == false) {
    document.getElementById("back").style.animation =
      "burgerBackground__Ani 0.4s forwards normal";
    isChecked = true;
  } else {
    document.getElementById("back").style.animation =
      "burgerBackgroundClose__Ani 0.4s forwards normal";
    isChecked = false;
  }
});
const mediaInQuery = window.matchMedia("(max-width: 350px)");
const mediaOutQuery = window.matchMedia(
  "(min-width: 351px) and (max-width: 768px)"
);
function handleTabletInChange(e) {
  if (e.matches) {
    let $navbar = document.querySelector(".navbar");
    let $navbar__wrap = document.querySelector(".navbar__wrap");
    $navbar__wrap.innerHTML = " ";
    let $menu__items = document.querySelector(".menu__items");
    $menu__items.innerHTML = `
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
    let $navbar = document.querySelector(".navbar");
    let $navbar__wrap = document.querySelector(".navbar__wrap");
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
    let $menu__items = document.querySelector(".menu__items");
    $menu__items.innerHTML = `
    <li><a href="main.html">Главная</a></li>
    <li><a href="today.html">Сегодня</a></li>
    <li><a href="twoweeks.html">Две недели</a></li>
    <li><a href="month.html">Месяц</a></li>
    <li><a href="contacts.html">Контакты</a></li>  
    `;
  }
}
mediaInQuery.addListener(handleTabletInChange, mediaInQuery);
mediaOutQuery.addListener(handleTabletOutChange, mediaOutQuery);
handleTabletInChange(mediaInQuery);
handleTabletOutChange(mediaOutQuery);
start();
