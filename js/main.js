const url =
  "https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,surface_pressure,windspeed_10m,winddirection_10m&windspeed_unit=ms";
var currentData;
let hour = new Date().getHours();
async function getData() {
  let response = await fetch(url);

  if (response.ok) {
    let jsonData = response.json();
    return jsonData;
  } else {
    alert("Error: " + response.status);
  }
}
function start() {
  getData().then((data) => {
    currentData = data;
    notification(data);
    periodicTasks();
  });
}
function periodicTasks() {
  setInterval(start, 6000000);
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
