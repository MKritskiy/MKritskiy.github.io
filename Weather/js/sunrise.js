function getSunrises(data, length){
  let sunrises = [];
    let sunrisesDate = [];
    let avgSunrisesAmplitude;
    for(let i=0; i<length;i++){
      if (i<7){
        sunrises.push(data.daily.sunrise[i].slice(-5))
        date = new Date(data.daily.sunrise[i]);
        sunrisesDate.push(new Date(date));
      }
      else {
        avgSunrisesAmplitude = getAverageAmplitude(sunrisesDate.map((item)=>item.getHours()*60+item.getMinutes() ));
        date = new Date(sunrisesDate[i-1]);
        date.setMinutes(date.getMinutes() - avgSunrisesAmplitude);
        date.setDate(date.getDate() + 1);
        sunrises.push(date.getHours().pad()+':'+date.getMinutes().pad());
        sunrisesDate.push(new Date(date));
      }  
    }
    return sunrises;
}
function getSunsets(data, length){
  let sunsets = [];
  let sunsetsDate = [];
  let avgSunsetsAmplitude;
  for(let i=0; i<length;i++){
    if (i<7){
      sunsets.push(data.daily.sunset[i].slice(-5))
      date = new Date(data.daily.sunset[i]);
      sunsetsDate.push(new Date(date));
    }
    else {
      avgSunsetsAmplitude = getAverageAmplitude(sunsetsDate.map((item)=>item.getHours()*60+item.getMinutes()));
      date = new Date(sunsetsDate[i-1]);
      date.setMinutes(date.getMinutes() - avgSunsetsAmplitude);
      date.setDate(date.getDate() + 1);
      sunsets.push(date.getHours().pad()+':'+date.getMinutes().pad());
      sunsetsDate.push(new Date(date));
    }  
  }
  return sunsets;
}let width, height, gradient;
function getGradient(ctx, chartArea) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(255,207,72,0.8)');
    gradient.addColorStop(0.5, 'rgba(255,140,0,0.8)');
    gradient.addColorStop(1, 'rgba(246,71,71,0.8)');
  }

  return gradient;
}

function renderSunriseCanvas(data) {
    const DATA_COUNT = 14;
    const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};
    const labels = [...document.querySelectorAll(".forecast__time")].map((item, index)=>item.innerHTML+'\n' + [...document.querySelectorAll(".forecast__day")][index].innerHTML);
    let sunrises = [];
    let sunrisesDate = [];
    let sunsets = [];
    let sunsetsDate = [];
    let avgSunrisesAmplitude;
    let avgSunsetsAmplitude;
    for(let i=0; i<labels.length;i++){
      if (i<7){
        sunrises.push(data.daily.sunrise[i].slice(-5))
        date = new Date(data.daily.sunrise[i]);
        sunrisesDate.push(new Date(date));
      }
      else {
        avgSunrisesAmplitude = getAverageAmplitude(sunrisesDate.map((item)=>item.getHours()*60+item.getMinutes() ));
        date = new Date(sunrisesDate[i-1]);
        date.setMinutes(date.getMinutes() - avgSunrisesAmplitude);
        date.setDate(date.getDate() + 1);
        sunrises.push(date.getHours().pad()+':'+date.getMinutes().pad());
        sunrisesDate.push(new Date(date));
      }  
    }
    for(let i=0; i<labels.length;i++){
      if (i<7){
        sunsets.push(data.daily.sunset[i].slice(-5))
        date = new Date(data.daily.sunset[i]);
        sunsetsDate.push(new Date(date));
      }
      else {
        avgSunsetsAmplitude = getAverageAmplitude(sunsetsDate.map((item)=>item.getHours()*60+item.getMinutes()));
        date = new Date(sunsetsDate[i-1]);
        date.setMinutes(date.getMinutes() - avgSunsetsAmplitude);
        date.setDate(date.getDate() + 1);
        sunsets.push(date.getHours().pad()+':'+date.getMinutes().pad());
        sunsetsDate.push(new Date(date));
      }  
    }
    // labels.map((item, index) => {
    //   return [sunrisesDate[index].toISOString().slice(0,-5), sunsetsDate[index].toISOString().slice(0,-5)];
    // }),
    // 
    const datas = {
      datasets: [
        {
          label: 'Восход и заход',
          data: labels.map((item,index)=>{
            let date = new Date();
            let from = date.toISOString().slice(0,10)+sunrisesDate[index].toISOString().slice(10,-5);
            let to = date.toISOString().slice(0,10)+sunsetsDate[index].toISOString().slice(10,-5);
            return {y: [from, to], x:sunrisesDate[index].toISOString().slice(0,11) + '00:00'};
          }),
          // backgroundColor: 'rgba(255,140,0,0.5)',
          backgroundColor: function(context) {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
    
            if (!chartArea) {
              // This case happens on initial chart load
              return;
            }
            return getGradient(ctx, chartArea);
          },
          borderColor: 'rgba(255,100,0,0.8)',
          borderWidth: 1,
          borderRadius: 10,
          borderSkipped: false,
        },
      ]
    };
    let i = 0;
    const config = {
        type: 'bar',
        data: datas,
        options: {
          layout:{
            autoPadding: true
            
          },
          maintainAspectRatio: false,
          scales: {
            y:{
                type: 'time',
                time: {
                unit:'hour'
              },
              parsing: false,
              beginAtZero:true,
              display: false
            },
            x:{
              grid: {
                offset: true
              },
              parsing: false,
              type: 'time',
              time: {
                unit:'day'
              },
              display: false
            },
          },
          plugins: {
            tooltip: {
              backgroundColor: 'transparent',
              displayColors: false,
              bodyFontSize: 14,
              footerFont: {
                weight: 'normal'
              },
              callbacks: {
                label: function(item, data) { 
                  return 'Заход: '+new Intl.DateTimeFormat('ru', {
                    hour:'numeric',
                    minute:'numeric',
                  }).format(sunsetsDate[item.dataIndex]);
                },
                title: function(item, data) { 
                  return labels[item[0].dataIndex];

                },
                footer: function(item, data) { 
                  return 'Восход: '+ new Intl.DateTimeFormat('ru', {
                    hour:'numeric',
                    minute:'numeric',
                  }).format(sunrisesDate[item[0].dataIndex]);
                },
              }
            },
            title: {
              display: false,
              text: 'Восходы и заходы солнца',
              align: 'start',
              color: 'rgba(255,255,255,1)',
              font: {
                size: 24,
              }
          },
          
            legend: {
              display: false,
            },
            
          }
        },
      };


  window.chart = new Chart(document.getElementById("canvas_sunrise"), config,)
}

function renderSunriseAxis(data){
  const $forecast__time = [...document.querySelectorAll(".forecast__time")];
  const $forecast__day = [...document.querySelectorAll(".forecast__day")];
  let sunrises = getSunrises(data, $forecast__time.length);
  let sunsets = getSunsets(data, $forecast__time.length);
  let $axis = document.getElementById("axis__sunrise");
  $axis.innerHTML = '';
  for(let i = 0; i<$forecast__time.length; i++){
    $axis.innerHTML += `
    <div class="tick">
      <span class="day-number">${$forecast__time[i].innerHTML}</span>
      <span class="day-name">${$forecast__day[i].innerHTML}</span>
      <span class="valueup value--this">${sunsets[i]}</span>
      <span class="valuedown value--this">${sunrises[i]}</span>
    </div>`
  }
}