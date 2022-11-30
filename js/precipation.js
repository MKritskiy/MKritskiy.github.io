function getPrecipations(data, length) {
  let precipations = [];
  let avgPrecipationAmplitude;
  Math.seedrandom(new Date().getDate());
  for (let i = 0; i < length; i++) {
    if (i < 7) {
      precipations.push(data.daily.precipitation_sum[i]);
    } else {
      avgPrecipationAmplitude = precipations.reduce(
        (sum, current, index) => (sum * (index + 1) + current) / (index + 2),
        0
      );
      precipations.push(
        Math.floor(
          (precipations[i - 1] +
            Math.random() * avgPrecipationAmplitude * 2 -
            avgPrecipationAmplitude) *
            100
        ) / 100
      );
    }
  }
  return precipations;
}

function renderPrecipationsCanvas(data) {
  const labels = [...document.querySelectorAll(".forecast__time")].map(
    (item, index) =>
      item.innerHTML +
      "\n" +
      [...document.querySelectorAll(".forecast__day")][index].innerHTML
  );
  let precipations = getPrecipations(data, labels.length);
  // labels.map((item, index) => {
  //   return [sunrisesDate[index].toISOString().slice(0,-5), sunsetsDate[index].toISOString().slice(0,-5)];
  // }),
  //
  const datas = {
    datasets: [
      {
        label: "Восход и заход",
        data: precipations.map((item, index) => {
          return {
            y: item,
            x: new Date(90000000 * index).toISOString().slice(0, 11) + "00:00",
          };
        }),
        backgroundColor: "rgba(0,100,255,0.5)",
        borderColor: "rgba(0,140,255,1)",
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };
  let i = 0;
  const config = {
    type: "bar",
    data: datas,
    options: {
      layout: {
        autoPadding: true,
      },
      maintainAspectRatio: false,
      scales: {
        y: {
          parsing: false,
          beginAtZero: true,
          display: false,
        },
        x: {
          grid: {
            offset: true,
          },
          parsing: false,
          type: "time",
          time: {
            unit: "day",
          },
          display: false,
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: "transparent",
          displayColors: false,
          bodyFontSize: 14,
          callbacks: {
            label: function (item, data) {
              return "Осадки: " + precipations[item.dataIndex] + " мм";
            },
            title: function (item, data) {
              return labels[item[0].dataIndex];
            },
          },
        },
        title: {
          display: false,
          text: "Осадки",
          align: "start",
          color: "rgba(255,255,255,1)",
          font: {
            size: 24,
          },
        },

        legend: {
          display: false,
        },
      },
    },
  };

  window.chart = new Chart(
    document.getElementById("canvas_precipation"),
    config
  );
}

function renderPrecipationAxis(data) {
  const $forecast__time = [...document.querySelectorAll(".forecast__time")];
  const $forecast__day = [...document.querySelectorAll(".forecast__day")];
  let precipations = getPrecipations(data, $forecast__time.length);
  let $axis = document.getElementById("axis__precipation");
  $axis.innerHTML = "";
  for (let i = 0; i < $forecast__time.length; i++) {
    $axis.innerHTML += `
    <div class="tick">
      <span class="day-number">${$forecast__time[i].innerHTML}</span>
      <span class="day-name">${$forecast__day[i].innerHTML}</span>
      <span class="valueup value--this">${precipations[i]}</span>
    </div>`;
  }
}
