 // Financial Summary - Bar Chart (Chart.js)
 document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('financialBarChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Registration', 'Sponsorship', 'Accommodation'],
        datasets: [{
          label: 'Revenue ($)',
          data: [58900, 51700, 12400],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',    // blue
            'rgba(251, 191, 36, 0.7)',    // yellow
            'rgba(139, 92, 246, 0.7)'     // purple
          ],
          borderRadius: 8,
          barThickness: 38,
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: { font: { size: 13, weight: 'bold' } }
          },
          y: {
            beginAtZero: true,
            grid: { color: '#e5e7eb' },
            ticks: { font: { size: 12 } }
          }
        }
      }
    });

    // Venue Utilization - Heatmap (ECharts)
    const heatmapData = [
      // [day, venue, value]
      [0, 0, 8], [0, 1, 10], [0, 2, 7],
      [1, 0, 6], [1, 1, 11], [1, 2, 8],
      [2, 0, 9], [2, 1, 7], [2, 2, 6],
      [3, 0, 13], [3, 1, 12], [3, 2, 11],
      [4, 0, 7], [4, 1, 3, 1], [4, 2, 9], // [day,venue,value,conflictFlag]
      [5, 0, 12], [5, 1, 5], [5, 2, 8],
      [6, 0, 7, 1], [6, 1, 9], [6, 2, 5, 1]
    ];
    const venues = ['Hall A', 'Hall B', 'Auditorium'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const chart = echarts.init(document.getElementById('venueHeatmap'));
    chart.setOption({
      tooltip: {
        formatter: function(params) {
          let text = `${days[params.value[0]]}, ${venues[params.value[1]]}: ${params.value[2]} bookings`;
          if (params.value[3]) text += ' <br><span style="color:#e53e3e;"><b>Conflict Detected!</b></span>';
          return text;
        }
      },
      xAxis: {
        type: 'category',
        data: venues,
        axisLine: { show: false },
        axisTick: { show: false },
        splitArea: { show: false }
      },
      yAxis: {
        type: 'category',
        data: days,
        axisLine: { show: false },
        axisTick: { show: false },
        inverse: true,
        splitArea: { show: false }
      },
      visualMap: {
        min: 0,
        max: 15,
        show: false,
        inRange: {
          color: ['#e0f2fe', '#7dd3fc', '#2563eb', '#b91c1c']
        }
      },
      series: [{
        name: 'Venue Utilization',
        type: 'heatmap',
        data: heatmapData.map(item => [item[1], item[0], item[2], item[3]]),
        label: {
          show: true, color: '#222', formatter: function(params){ return params.value[2] }
        },
        emphasis: {
          itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.2)' }
        },
        itemStyle: {
          borderColor: '#fff'
        }
      }],
      grid: { left: 0, right: 0, bottom: 0, top: 18, containLabel: true }
    });

    window.addEventListener("resize", function () {
      chart.resize();
    });
  });