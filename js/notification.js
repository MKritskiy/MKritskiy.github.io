var currentData;
function renderNotification(data) {
  let notifyText = [];
  for (
    let i = new Date().getHours() + 1;
    i < new Date().getHours()+1+ data.hourly.weathercode.length - 6 * 24 - 9;
    i++
  ) {
    let tmp = data.hourly.weathercode[i];
    if (tmp == "45" || tmp == "48") {
      notifyText.push("Осторожно, ожидается туман!");
    } //Fog
    else if (parseInt(tmp) >= 51 && parseInt(tmp) < 61 ) {
      notifyText.push("Осторожно, ожидается мелкий дождь!");
      break;
    } //Drizzle
    else if (parseInt(tmp) >= 61 && parseInt(tmp)<71 ) {
      notifyText.push("Осторожно, ожидается дождь!");
      break;
    } //Rain
    else if (parseInt(tmp) >= 71 && parseInt(tmp) <80 ) {
      notifyText.push("Осторожно! Ожидается снег!");
      break;
    } //Snow
    else if (parseInt(tmp) >= 80 && parseInt(tmp) < 85) {
      notifyText.push("Осторожно, ожидается дождь!");
      break;
    } //Rain
    else if (parseInt(tmp) >= 85 && parseInt(tmp) < 95) {
      notifyText.push("Осторожно! Ожидается снег!");
      break;
    } //Snow
    else if (parseInt(tmp) >= 95) {
      notifyText.push("Осторожно! Ожидается гроза!");
      break;
    } //Thunder
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
