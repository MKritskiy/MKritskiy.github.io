var currentData;
function renderNotification(data) {
  let notifyText = [];
  for (
    let i = new Date().getHours() + 1;
    i < data.hourly.weathercode.length - 6 * 24 - 9;
    i++
  ) {
    let tmp = data.hourly.weathercode[i];
    if (tmp == "45" || tmp == "48") {
      notifyText.push("Осторожно, ожидается туман!");
    } //Fog
    else if (
      tmp == "51" ||
      tmp == "53" ||
      tmp == "55" ||
      tmp == "56" ||
      tmp == "57"
    ) {
      notifyText.push("Осторожно, ожидается мелкий дождь!");
      break;
    } //Drizzle
    else if (
      tmp == "61" ||
      tmp == "63" ||
      tmp == "65" ||
      tmp == "66" ||
      tmp == "67"
    ) {
      notifyText.push("Осторожно, ожидается дождь!");
      break;
    } //Rain
    else if (tmp == "71" || tmp == "73" || tmp == "75" || tmp == "77") {
      notifyText.push("Осторожно! Ожидается снег!");
      break;
    } //Snow
  }
  notifyElem = document.querySelector(".dropdown__content");
  notifyElem.innerHTML = " ";
  if (notifyText.length == 0) {
    notifyElem.innerHTML = `<a href="today.html">Осадков не ожидается</a>`;
  } else {
    notifyElem.innerHTML += `<a href="today.html">${notifyText[0]}</a>`;
  }
}

function notification(data) {
  renderNotification(data);
  periodicNotificationTasks();
}
function periodicNotificationTasks() {
  setInterval(notification, 5000000);
}
