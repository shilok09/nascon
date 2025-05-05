// Dashboard initialization
document.addEventListener("DOMContentLoaded", function () {
  // First try the regular stats endpoint
  fetchDashboardStats().catch(() => {
    fetchSimpleDashboardStats();
  });
  
  // Fetch current sponsorships
  fetchCurrentSponsorships();

  // Initial chart is set up below, but it will be updated when data arrives
  setupInitialChart();

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

// Set up initial empty chart
function setupInitialChart() {
  const ctx = document.getElementById('financialBarChart').getContext('2d');
  window.financialChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Registration', 'Sponsorship', 'Accommodation'],
      datasets: [{
        label: 'Revenue ($)',
        data: [0, 0, 0],
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
}

// Fetch dashboard statistics from API
async function fetchDashboardStats() {
  try {
    const response = await fetch('/dashboard/stats');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Convert string values to numbers if needed
    const processedData = {
      ...data,
      activeEvents: Number(data.activeEvents),
      totalRegistrations: Number(data.totalRegistrations),
      sponsorshipRevenue: Number(data.sponsorshipRevenue),
      accommodationUsed: Number(data.accommodationUsed),
      pendingActions: Number(data.pendingActions),
      financialData: {
        registrationRevenue: Number(data.financialData?.registrationRevenue || 0),
        sponsorshipRevenue: Number(data.financialData?.sponsorshipRevenue || 0),
        accommodationRevenue: Number(data.financialData?.accommodationRevenue || 0)
      }
    };
    
    updateDashboardUI(processedData);
    
  } catch (error) {
    // Don't set default values here, let the caller decide what to do (e.g., try fallback)
    throw error; // Re-throw to allow caller to catch and handle
  }
}

// Fetch simplified dashboard statistics (fallback)
async function fetchSimpleDashboardStats() {
  try {
    const response = await fetch('/dashboard/simple-stats');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Convert string values to numbers if needed
    const processedData = {
      ...data,
      activeEvents: Number(data.activeEvents),
      totalRegistrations: Number(data.totalRegistrations),
      sponsorshipRevenue: Number(data.sponsorshipRevenue),
      accommodationUsed: Number(data.accommodationUsed),
      pendingActions: Number(data.pendingActions),
      financialData: {
        registrationRevenue: Number(data.financialData?.registrationRevenue || 0),
        sponsorshipRevenue: Number(data.financialData?.sponsorshipRevenue || 0),
        accommodationRevenue: Number(data.financialData?.accommodationRevenue || 0)
      }
    };
    
    updateDashboardUI(processedData);
    
  } catch (error) {
    // Set default values as last resort
    setDefaultDashboardValues();
  }
}

// Update the dashboard UI with data
function updateDashboardUI(data) {
  // Get references to DOM elements
  const eventsElement = document.getElementById('active-events');
  const registrationsElement = document.getElementById('registrations');
  const revenueElement = document.getElementById('sponsorship-revenue');
  const accommodationElement = document.getElementById('accommodation-used');
  const pendingElement = document.getElementById('pending-actions');
  
  // Update KPI values with proper error handling
  if (eventsElement) eventsElement.textContent = data.activeEvents || 0;
  if (registrationsElement) registrationsElement.textContent = formatNumber(data.totalRegistrations || 0);
  if (revenueElement) revenueElement.textContent = formatCurrency(data.sponsorshipRevenue || 0);
  
  // For accommodation, check if it's a percentage or just a count
  const accommodationValue = data.accommodationUsed || 0;
  if (accommodationElement) {
    accommodationElement.textContent = accommodationValue.toString();
  }
  
  if (pendingElement) pendingElement.textContent = data.pendingActions || 0;

  // Update financial summary with error handling
  const financeRegElement = document.getElementById('finance-registration');
  const financeSponsorElement = document.getElementById('finance-sponsorship');
  const financeAccomElement = document.getElementById('finance-accommodation');
  
  if (data.financialData) {
    if (financeRegElement) {
      financeRegElement.textContent = formatCurrency(data.financialData.registrationRevenue || 0);
    }
    if (financeSponsorElement) {
      financeSponsorElement.textContent = formatCurrency(data.financialData.sponsorshipRevenue || 0);
    }
    if (financeAccomElement) {
      financeAccomElement.textContent = formatCurrency(data.financialData.accommodationRevenue || 0);
    }

    // Update financial bar chart
    updateFinancialChart(data.financialData);
  } else {
    // Default values if financialData is missing
    if (financeRegElement) financeRegElement.textContent = formatCurrency(0);
    if (financeSponsorElement) financeSponsorElement.textContent = formatCurrency(0);
    if (financeAccomElement) financeAccomElement.textContent = formatCurrency(0);
    
    // Update chart with zeros
    updateFinancialChart({
      registrationRevenue: 0,
      sponsorshipRevenue: 0,
      accommodationRevenue: 0
    });
  }
}

// Set default values for all dashboard elements as a last resort
function setDefaultDashboardValues() {
  const elements = {
    'active-events': '0',
    'registrations': '0',
    'sponsorship-revenue': formatCurrency(0),
    'accommodation-used': '0',
    'pending-actions': '0',
    'finance-registration': formatCurrency(0),
    'finance-sponsorship': formatCurrency(0),
    'finance-accommodation': formatCurrency(0)
  };
  
  // Set default values for each element
  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
  
  // Update chart with zeros
  updateFinancialChart({
    registrationRevenue: 0,
    sponsorshipRevenue: 0,
    accommodationRevenue: 0
  });
}

// Fetch current sponsorships from API
async function fetchCurrentSponsorships() {
  try {
    const response = await fetch('/dashboard/sponsorships');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const sponsorships = await response.json();
    
    // Update sponsorships table
    const tableBody = document.getElementById('sponsorships-table-body');
    
    if (!tableBody) {
      return;
    }
    
    if (!Array.isArray(sponsorships) || sponsorships.length === 0) {
      // If no sponsorships or invalid response, show a message
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-gray-400">
            No sponsorships found.
          </td>
        </tr>
      `;
    } else {
      // Populate table with sponsorships
      tableBody.innerHTML = sponsorships.map(sponsorship => `
        <tr class="hover:bg-gray-700">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${sponsorship.id || 'N/A'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${sponsorship.category || 'N/A'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <span class="${getTypeColor(sponsorship.type)} px-2 py-1 rounded-full text-xs">
              ${sponsorship.type || 'Unknown'}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${formatDate(sponsorship.contractDate)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">${formatCurrency(sponsorship.amount || 0)}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    // Show error message
    const tableBody = document.getElementById('sponsorships-table-body');
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-red-400">
            Error fetching sponsorships. Please try again.
          </td>
        </tr>
      `;
    }
  }
}

// Helper function to get color class for sponsorship type
function getTypeColor(type) {
  switch (type) {
    case 'Platinum': return 'bg-purple-800 text-white';
    case 'Gold': return 'bg-yellow-600 text-white';
    case 'Silver': return 'bg-gray-400 text-gray-900';
    case 'Bronze': return 'bg-yellow-800 text-white';
    case 'Event Specific': return 'bg-blue-700 text-white';
    default: return 'bg-gray-600 text-white';
  }
}

// Update financial bar chart
function updateFinancialChart(financialData) {
  // Ensure all values are numbers
  const regRevenue = Number(financialData.registrationRevenue) || 0;
  const sponsorRevenue = Number(financialData.sponsorshipRevenue) || 0;
  const accomRevenue = Number(financialData.accommodationRevenue) || 0;
  
  // Check if chart exists
  if (window.financialChart) {
    // Update existing chart
    window.financialChart.data.datasets[0].data = [regRevenue, sponsorRevenue, accomRevenue];
    window.financialChart.update();
  }
}

// Helper function to format numbers (e.g., 1000 -> 1,000)
function formatNumber(number) {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  return new Intl.NumberFormat().format(number);
}

// Helper function to format currency
function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Helper function to format dates
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'N/A';
  }
}