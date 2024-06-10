// ==================== //
// ====== Header ====== //
// ==================== //
// Typing Animation Effect //
function typeEffect(words, typingTitle) {
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
      const currentWord = words[wordIndex];
      const currentChar = currentWord.substring(0, charIndex);
      typingTitle.textContent = currentChar;
      typingTitle.classList.add("stop-blinking");

      if (!isDeleting && charIndex < currentWord.length) {
          charIndex++;
          setTimeout(type, 200);
      } else if (isDeleting && charIndex > 0) {
          charIndex--;
          setTimeout(type, 100);
      } else {
          isDeleting = !isDeleting;
          typingTitle.classList.remove("stop-blinking");
          if (!isDeleting) {
              wordIndex = (wordIndex + 1) % words.length;
          }
          setTimeout(type, 1000);
      }
  }
  type();
}

const words = ["Phoenix Bikes", "Team 6"];
const typingTitle = document.querySelector(".title");
typeEffect(words, typingTitle);

// Dropdown Menu //
function toggleMenu(menuIcon, navMenu) {
  menuIcon.classList.toggle("active");
  navMenu.classList.toggle("active");
}
function addMenuToggleListener(menuIconSelector, navMenuSelector) {
  const menuIcon = document.querySelector(menuIconSelector);
  const navMenu = document.querySelector(navMenuSelector);

  if (menuIcon && navMenu) {
    menuIcon.addEventListener("click", () => toggleMenu(menuIcon, navMenu));
    navMenu.addEventListener("click", () => toggleMenu(menuIcon, navMenu));
  } else {
    console.error("menuIcon or navMenu is not found");
  }
}
const menuIcon = document.querySelector(".menu-icon");
const navMenu = document.querySelector(".nav-menu");

// Smooth Scroll //
function smoothScroll(event) {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute("href");
  const targetElement = document.querySelector(targetId);
  const offsetTop = 100;
  const scrollPosition = targetElement.offsetTop - offsetTop;
  window.scrollTo({
    behavior: "smooth",
    top: scrollPosition
  });
}

function addSmoothScrollListener(anchorSelector) {
  document.querySelectorAll(anchorSelector).forEach((anchor) => {
    anchor.addEventListener('click', smoothScroll);
  });
}

// Inisialisasi Menu //
function initEventListeners() {
  addMenuToggleListener(".menu-icon", ".nav-menu");
  addSmoothScrollListener('a[href^="#"]');
}
document.addEventListener("DOMContentLoaded", initEventListeners);

// ================= //
// === Dashboard === //
// ================= //
function toggleDropdownFilter() {
  var dropdownContent = document.getElementById("dropdown-content");
  if (dropdownContent.style.display === "none" || dropdownContent.style.display === "") {
      dropdownContent.style.display = "block";
  } else {
      dropdownContent.style.display = "none";
  }
}

function resetFilters() {
  var selects = document.getElementsByTagName("select");
  for (var i = 0; i < selects.length; i++) {
      selects[i].selectedIndex = 0;
  }
  toggleDropdownFilter(); // Tutup dropdown setelah reset
}

function applyFilters() {
  var selects = document.getElementsByTagName("select");
  var selectedValues = {};
  for (var i = 0; i < selects.length; i++) {
      selectedValues[selects[i].id] = selects[i].value;
  }
  // Lakukan sesuatu dengan nilai yang telah dipilih (misalnya, kirim ke server)
  toggleDropdownFilter(); // Tutup dropdown setelah menerapkan filter
}
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.matches('select')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.style.display === "block") {
              openDropdown.style.display = "none";
          }
      }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.style.display = 'block';

  let data;
  let chart;

  fetch('./assets/data/dataset.json')
      .then(response => response.json())
      .then(dataset => {
          data = dataset; // Assign the fetched data to the outer variable

          const uniqueValues = extractUniqueValues(data);

          // Mengisi dropdown filter dengan nilai unik
          populateFilterDropdown('year', uniqueValues.year);
          populateFilterDropdown('gender', uniqueValues.gender);
          populateFilterDropdown('country', uniqueValues.country);
          populateFilterDropdown('continent', uniqueValues.continent);
          populateFilterDropdown('sub-category', uniqueValues.subCategory);

          chart = lineChartAverageProfit(data); // Assign the returned value to chart variable

          // Menambahkan event listener untuk tombol OK dan Reset
          document.getElementById('ok').addEventListener('click', applyFilters);
          document.getElementById('reset').addEventListener('click', resetFilters);

          // Update dashboard after chart initialization
          updateDashboard(data);
          updateScoreCard(data);
          drawHorizontalBarChart(data);
          productComposition(data);
          profitByGender(data);
          // profitByAge(data);

          loadingIndicator.style.display = 'none';

          fetchSecondDataset();
      })
      .catch(error => {
          console.error('Error loading the dataset:', error);
          loadingIndicator.style.display = 'none';
      });

      function fetchSecondDataset() {
        fetch('./assets/data/dataset-all-age.json')
          .then(response => response.json())
          .then(dataset2 => {
            data = dataset2;

            profitByAge(data);
          })
          .catch(error => {
            console.error('Error loading the second dataset:', error);
        });
      }

  // Function definitions

  function extractUniqueValues(data) {
      const uniqueValues = {
          year: [],
          gender: [],
          country: [],
          continent: [],
          subCategory: [],
          month: []
      };

      data.forEach(item => {
          if (!uniqueValues.year.includes(item.Year)) {
              uniqueValues.year.push(item.Year);
          }
          if (!uniqueValues.gender.includes(item.Customer_Gender) && item.Customer_Gender !== "-") {
              uniqueValues.gender.push(item.Customer_Gender);
          }
          if (!uniqueValues.country.includes(item.Country) && item.Country !== "-") {
              uniqueValues.country.push(item.Country);
          }
          if (!uniqueValues.continent.includes(item.Continent) && item.Continent !== "-") {
              uniqueValues.continent.push(item.Continent);
          }
          if (!uniqueValues.subCategory.includes(item.Sub_Category) && item.Sub_Category !== "-") {
              uniqueValues.subCategory.push(item.Sub_Category);
          }
          if (!uniqueValues.month.includes(item.Month) && item.Month !== "-") {
              uniqueValues.month.push(item.Month);
          }
      });

      Object.keys(uniqueValues).forEach(key => {
          uniqueValues[key].sort();
      });

      return uniqueValues;
  }

  function populateFilterDropdown(id, values) {
      const select = document.getElementById(id);
      values.forEach(value => {
          const option = document.createElement('option');
          option.text = value;
          option.value = value;
          select.appendChild(option);
      });
  }

  function resetFilters() {
      var selects = document.getElementsByTagName("select");
      for (var i = 0; i < selects.length; i++) {
          selects[i].selectedIndex = 0;
      }
      updateDashboard(data); // Update the dashboard with default filters after reset
  }

  function applyFilters() {
      updateDashboard(data); // Update dashboard with selected filters
  }

  function updateDashboard(data) {
      // Ambil nilai dari semua dropdown filter
      const selectedYear = document.getElementById('year').value;
      const selectedGender = document.getElementById('gender').value;
      const selectedCountry = document.getElementById('country').value;
      const selectedContinent = document.getElementById('continent').value;
      const selectedSubCategory = document.getElementById('sub-category').value;

      // Filter data sesuai dengan nilai dropdown yang dipilih
      let filteredData = data.filter(item => {
          if (selectedYear !== '' && item.Year !== parseInt(selectedYear)) {
              return false;
          }
          if (selectedGender !== '' && item.Customer_Gender !== selectedGender) {
              return false;
          }
          if (selectedCountry !== '' && item.Country !== selectedCountry) {
              return false;
          }
          if (selectedContinent !== '' && item.Continent !== selectedContinent) {
              return false;
          }
          if (selectedSubCategory !== '' && item.Sub_Category !== selectedSubCategory) {
              return false;
          }
          return true;
      });
      updateChart(chart, filteredData);
      updateScoreCard(filteredData);
      drawHorizontalBarChart(filteredData)
      productComposition(filteredData);
      profitByGender(filteredData);
      profitByAge(filteredData);
      return filteredData;
  }

  function updateScoreCard(data) {
    const totalOrders = data.length;
    const totalRevenue = data.reduce((acc, curr) => acc + curr.Revenue, 0);
    const totalCost = data.reduce((acc, curr) => acc + curr.Cost, 0);
    const totalProfit = data.reduce((acc, curr) => acc + curr.Profit, 0);

    document.getElementById('total-orders').textContent = formatNumber(totalOrders);
    document.getElementById('total-revenue').textContent = '$' + formatNumber(totalRevenue);
    document.getElementById('total-cost').textContent = '$' + formatNumber(totalCost);
    document.getElementById('total-profit').textContent = '$' + formatNumber(totalProfit);
}

function formatNumber(num) {
    if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    }
    return num.toFixed(2);
}


  function lineChartAverageProfit(data) {
      const ctx = document.getElementById('line-average-profit').getContext('2d');
      return new Chart(ctx, {
          type: 'line',
          data: getData(data),
          options: {
            plugins: {
              title: {
                  display: true,
                  text: 'Average Profit',
                  font: {
                      size: 20
                  }
              },
              legend: {
                  display: false
              }
          },

              responsive: true,
              scales: {
                  y: {
                      beginAtZero: true,
                      title: {
                          display: true,
                          text: 'Average Profit'
                      }
                  },
                  x: {
                      title: {
                          display: true,
                          text: 'Year'
                      }
                  }
              }
          }
      });
  }

  function updateChart(chart, data) {
      const filters = {
          year: document.getElementById('year').value,
          gender: document.getElementById('gender').value,
          country: document.getElementById('country').value,
          continent: document.getElementById('continent').value,
          subCategory: document.getElementById('sub-category').value
      };

      const chartData = getData(data, filters);

      chart.data = chartData.data;
      chart.options.scales.x.title.text = chartData.xLabel;
      chart.update();
  }

  function getData(data, filters = {}) {
      let filteredData = data;

      if (filters.gender) {
          filteredData = filteredData.filter(d => d.Customer_Gender == filters.gender);
      }
      if (filters.country) {
          filteredData = filteredData.filter(d => d.Country == filters.country);
      }
      if (filters.continent) {
          filteredData = filteredData.filter(d => d.Continent == filters.continent);
      }
      if (filters.subCategory) {
          filteredData = filteredData.filter(d => d.Sub_Category == filters.subCategory);
      }

      if (filters.year && filters.year !== 'all') {
          filteredData = filteredData.filter(d => d.Year == filters.year);
          return getMonthlyData(filteredData);
      } else {
          return getYearlyData(filteredData);
      }
  }

  function getYearlyData(data) {
      const groupedData = data.reduce((acc, curr) => {
          if (!acc[curr.Year]) {
              acc[curr.Year] = { totalProfit: 0, count: 0 };
          }
          acc[curr.Year].totalProfit += curr.Profit;
          acc[curr.Year].count += 1;
          return acc;
      }, {});

      const years = Object.keys(groupedData);
      const averageProfits = years.map(year => groupedData[year].totalProfit / groupedData[year].count);

      return {
          data: {
              labels: years,
              datasets: [{
                  label: 'Average Profit',
                  data: averageProfits,
                  backgroundColor: '#4F6F52',
                  borderColor: '#4F6F52',
                  borderWidth: 2
              }]
          },
          xLabel: 'Year'
      };
  }

  function getMonthlyData(data) {
      const uniqueMonths = [...new Set(data.map(d => d.Month))];
      const groupedData = data.reduce((acc, curr) => {
          if (!acc[curr.Month]) {
              acc[curr.Month] = { totalProfit: 0, count: 0 };
          }
          acc[curr.Month].totalProfit += curr.Profit;
          acc[curr.Month].count += 1;
          return acc;
      }, {});

      const averageProfits = uniqueMonths.map(month => groupedData[month].totalProfit / groupedData[month].count);

      return {
          data: {
              labels: uniqueMonths,
              datasets: [{
                  label: 'Average Profit',
                  data: averageProfits,
                  backgroundColor: '#4F6F52',
                  borderColor: '#4F6F52',
                  borderWidth: 1
              }]
          },
          xLabel: 'Month'
      };
  }

  function drawHorizontalBarChart(data) {
    // Group data by Country and calculate total profit
    const filteredData = data.filter((data) => data.Country !== '-');
    const groupedData = filteredData.reduce((acc, curr) => {
        if (!acc[curr.Country]) {
            acc[curr.Country] = 0;
        }
        acc[curr.Country] += curr.Profit;
        return acc;
    }, {});

    const countries = Object.keys(groupedData);
    const totalProfits = countries.map(country => groupedData[country]).filter((data) => data.Country !== '-');

    // Get the canvas element
    const canvas = document.getElementById('bar-country-profit');

    // Destroy the previous chart if it exists
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    // Create the chart
    const ctx = canvas.getContext('2d');
    const config = {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                label: 'Total Profit',
                data: totalProfits,
                backgroundColor: '#E8D6AB',
                borderColor: '#E8CE8F',
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Total Profit by Country',
                    font: {
                        size: 20
                    }
                }
            }
        }
    };
    new Chart(ctx, config);
}

function productComposition(data) {
  // Group data by Sub_Category 
  const groupedData = data.reduce((acc, curr) => {
      if (!acc[curr.Year]) {
          acc[curr.Year] = {};
      }
      if (!acc[curr.Year][curr.Sub_Category]) {
          acc[curr.Year][curr.Sub_Category] = 0;
      }
      acc[curr.Year][curr.Sub_Category] += curr.Order_Quantity;
      return acc;
  }, {});

  const years = Object.keys(groupedData)
  const subCategories = [...new Set(data.map(d => d.Sub_Category))];

  const datasets = subCategories.map(subCategory => {
      return {
          label: subCategory,
          data: years.map(years => groupedData[years][subCategory] || 0),
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
          // borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
          // borderWidth: 1
      };
  });

  // Get the canvas element
  const canvas = document.getElementById('composition-product');

  // Destroy the previous chart if it exists
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
      existingChart.destroy();
  }

  // Create the chart
  const ctx = canvas.getContext('2d');
  const config = {
      type: 'bar',
      data: {
          labels: years,
          datasets: datasets
      },
      options: {
          plugins: {
              title: {
                  display: true,
                  text: 'Product Type Composition in Years',
                  font: {
                      size: 20
                  }
              },
              legend: {
                  display: false
              }
          },
          responsive: true,
          maintainAspectRatio: false, 
          scales: {
              x: {
                  stacked: true,
                  title: {
                      display: true,
                      text: 'Year'
                  }
              },
              y: {
                  stacked: true,
                  title: {
                      display: true,
                      text: 'Order Quantity'
                  }
              }
          },
      }
  };
  new Chart(ctx, config);
}

function profitByGender(data) {
  // Group data by gender
  const filteredData = data.filter((data) => data.Customer_Gender !== '-');
  const groupedData = filteredData.reduce((acc, curr) => {
    if (!acc[curr.Customer_Gender]) {
      acc[curr.Customer_Gender] = 0;
    }
    acc[curr.Customer_Gender] += curr.Profit;
    return acc;
  }, {});

  const genders = Object.keys(groupedData);

  // Get the canvas element
  const canvas = document.getElementById('profit-by-gender');

  // Destroy the previous chart if it exists
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  // Create the chart
  const ctx = canvas.getContext('2d');
  const config = {
    type: 'doughnut',
    data: {
      labels: genders,
      datasets: [{
        label: 'Profit by Gender',
        data: Object.values(groupedData),
        backgroundColor: [
          '#658D68',
          '#DFCEB7'   
        ],
        borderColor: [
          '#658D68',
          '#DFCEB7'
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Profit by Gender',
          font: {
            size: 20 // Set the font size for the title
          }
        }
      }
    }
  };
  new Chart(ctx, config);
}

function profitByAge(data) {
  // Group data by age and calculate total profit for each age
  const filteredData = data.filter((data) => data.Age_Group !== '-');
  const groupedData = filteredData.reduce((acc, curr) => {
    if (!acc[curr.Age_Group]) {
      acc[curr.Age_Group] = 0;
    }
    acc[curr.Age_Group] += curr.Profit;
    return acc;
  }, {});

  // Calculate total profit overall
  const totalProfitOverall = Object.values(groupedData).reduce((total, profit) => total + profit, 0);

  // Calculate profit percentage for each age
  const profitPercentageData = {};
  for (const age in groupedData) {
    const profit = groupedData[age];
    const percentage = (profit / totalProfitOverall) * 100;
    profitPercentageData[age] = percentage;
  }

  // Create data for pie chart
  const labels = Object.keys(profitPercentageData);
  const dataValues = Object.values(profitPercentageData)
  

  // Generate random colors dynamically
  const colors = labels.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`);

  // Get the canvas element
  const canvas = document.getElementById('profit-by-age');

  // Destroy the previous chart if it exists
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  // Create the chart
  const ctx = canvas.getContext('2d');
  const config = {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Profit by Age',
        data: dataValues,
        backgroundColor: colors,
        // borderColor: colors.map(color => color.replace('0.5', '1')), // Adjust alpha for border color
        // borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Profit Percentage by Age',
          font: {
            size: 20 // Set the font size for the title
        }

        }
      }
    }  };
  new Chart(ctx, config);
}






});

$(document).ready(function() {
  // Fungsi untuk menginisialisasi tabel pertama
  function initializeTable(data) {
      var keys = Object.keys(data[0]);
      
      var thead = "<tr>";
      keys.forEach(function(key) {
          thead += "<th>" + key + "</th>";
      });
      thead += "</tr>";
      $("#dataTable1 thead").html(thead);

      var tbody = "";
      data.forEach(function(item) {
          tbody += "<tr>";
          keys.forEach(function(key) {
              tbody += "<td>" + item[key] + "</td>";
          });
          tbody += "</tr>";
      });
      $("#dataTable1 tbody").html(tbody);

      $("#dataTable1").DataTable();
  }

  // Fungsi untuk menginisialisasi tabel kedua
  function pivotTotalByCountry(data) {
      // Agregasi data berdasarkan negara
      var aggregatedData = data.reduce((acc, item) => {
          if (!acc[item.Country]) {
              acc[item.Country] = {
                  "Country": item.Country,
                  "Total_Order_Quantity": 0,
                  "Total_Cost": 0,
                  "Total_Profit": 0,
                  "Total_Revenue": 0
              };
          }
          acc[item.Country].Total_Order_Quantity += item.Order_Quantity;
          acc[item.Country].Total_Cost += item.Cost;
          acc[item.Country].Total_Profit += item.Profit;
          acc[item.Country].Total_Revenue += item.Revenue;
          return acc;
      }, {});

      // Konversi data agregasi ke dalam format array
      var tableData = Object.values(aggregatedData).filter((data) => data.Country !== '-');

      // Inisialisasi DataTable
      $('#dataTable2').DataTable({
          data: tableData,
          columns: [
              { data: 'Country' },
              { data: 'Total_Order_Quantity' },
              { data: 'Total_Cost' },
              { data: 'Total_Profit' },
              { data: 'Total_Revenue' }
          ]
      });
  }

  // Memuat data untuk kedua tabel dari satu file JSON
  $.getJSON("./assets/data/dataset.json", function(data) {
      initializeTable(data);  // Menginisialisasi tabel pertama dengan seluruh data
      pivotTotalByCountry(data);  // Menginisialisasi tabel kedua dengan data agregat
  }).fail(function() {
      console.error("An error occurred while loading the JSON file.");
  });
});



function createInsightItem(insight, recomendations) {
  // Membuat elemen utama untuk item insight
  const insightItem = document.createElement('div');
  insightItem.classList.add('insight-item');
  
  // Membuat elemen untuk insight
  const insightElement = document.createElement('h1');
  insightElement.classList.add('insight');
  insightElement.textContent = insight;

  // Membuat kontainer untuk konten insight
  const insightContent = document.createElement('div');
  insightContent.classList.add('insight-content');

  // Menambahkan elemen insight ke dalam insightContent
  insightContent.appendChild(insightElement);
  
  // Menambahkan insightContent ke dalam insightItem
  insightItem.appendChild(insightContent);
  
  // Membuat elemen untuk kontainer rekomendasi
  const recomendationContainer = document.createElement('div');
  recomendationContainer.classList.add('recomendation');
  
  // Menambahkan rekomendasi ke dalam recomendationContainer
  recomendations.forEach((recomendation) => {
      const recomendationItem = document.createElement('div');
      recomendationItem.classList.add('recomendation-item');

      const recomendationText = document.createElement('p');
      recomendationText.textContent = recomendation;

      recomendationItem.appendChild(recomendationText);
      recomendationContainer.appendChild(recomendationItem);
  });
  
  // Menambahkan recomendationContainer ke dalam insightItem
  insightItem.appendChild(recomendationContainer);
  
  // Menambahkan event listener untuk toggle aktif/inaktif rekomendasi
  insightContent.addEventListener('click', () => {
      insightItem.classList.toggle('active');
  });

  return insightItem;
}

// Display Insight Items
const insightListContainer = document.querySelector('.insight-list');

const insightsData = [
  {
    insight: 'Scorecards',
    recomendations: [
      "The situation involved 1,800 orders with total sales revenue of 4.5 million dollars. However, the net profit was only 1.48 million dollars, creating a 3 million dollar gap between revenue and net profit. This highlights the need for careful cost analysis to reduce this gap and improve the company's operational efficiency."
    ]
  },
  {
    insight: "Company's Annual Profit Graphic",
    recomendations: [
     "The graph shows that the company's annual profit decreased dramatically in 2014 due to the absence of bicycle sales. The highest profit recorded was in 2015, amounting to 530,758 dollars."
    ]
  },
  {
    insight: 'Country with Highest Profit',
    recomendations: [
      "The country with the highest profits is Australia, generating around 500 thousand dollars. This is noteworthy because Australia is part of the non-European countries, while European countries contributed less to the company's profits."
    ]
  },
  {
    insight: 'Product Type Composition in Years',
    recomendations: [
      'Phoenix companies in Europe need to increase their product variations to boost profits from bicycle sales, particularly for road bikes, which are the best-selling products and contribute the highest profits.'
    ]
  },
  {
    insight: 'Comparison of Customer Gender',
    recomendations: [
      'Purchases were made by 51.7% men and 48.3% women.'
    ]
  },
  {
    insight: 'Comparison of Customer Age',
    recomendations: [
      "The age difference in bicycle purchases is significant, indicating that buyers come from various age groups."
    ]
  },
  {
    insight: 'Average Discount per Country',
    recomendations: [
      "Phoenix companies in Germany and France do not need to offer discounts, as they are less effective in increasing company profits."
    ]
  }
];

insightsData.forEach((insight) => {
  const insightElement = createInsightItem(insight.insight, insight.recomendations);
  if (insightListContainer) {
      insightListContainer.appendChild(insightElement);
  } else {
      document.body.appendChild(insightElement);
  }
});
  
  // About - Us
  var teamMembers = [
    {
      name: "Maurita Eka Suraningtyas",
      role: "Project leader",
      imgSrc: "./assets/img/maurita.png",
      social: {
        linkedin: "https://www.linkedin.com/in/maurita-eka-suraningtyas/",
        instagram: "https://www.instagram.com/mauritaeka.s_",
        gmail: "mailto:mauritaeka.suraningtyas@gmail.com"
      }
    },
    {
      name: "Elsa Hanifah Ananda",
      role: "Front End Engineer",
      imgSrc: "./assets/img/elsa.png",
      social: {
        linkedin: "https://www.linkedin.com/in/elsa-ananda-1a5230265/",
        instagram: "https://www.instagram.com/saaaeeell_",
        gmail: "mailto:elsaananda325@gmail.com"
      }
    },
    {
      name: "Ica Nur Halimah",
      role: "Front End Engineer",
      imgSrc: "./assets/img/ica.png",
      social: {
        linkedin: "https://www.linkedin.com/in/ica-nur-halimah/",
        instagram: "https://www.instagram.com/icaacoo",
        gmail: "mailto:icanur468@gmail.com"
      }
    },
    {
      name: "Nurul Syifa Khairani",
      role: "Front End Engineer",
      imgSrc: "./assets/img/syifa.png",
      social: {
        linkedin: "https://www.linkedin.com/in/nurul-syifa-khairani-395484219",
        instagram: "http://instagram.com/syifa.bluu",
        gmail: "mailto:nsk.syifa@gmail.com"
      }
    },
    {
      name: "Arya Syamudra",
      role: "Front End Engineer",
      imgSrc: "./assets/img/Arya.png",
      social: {
        linkedin: "https://www.linkedin.com/in/arya-syamudra/",
        instagram: "http://instagram.com/arya_syamudra",
        gmail: "mailto:aryasyamudra24@gmail.com"
      }
    },
    {
      name: "Rizal Maulana",
      role: "Deployment Team",
      imgSrc: "./assets/img/rizalmaulana.png",
      social: {
        linkedin: "linkedin.com/in/rizal-maulana-sanjaya-470612277",
        instagram: "https://instagram.com/rrizlms",
        gmail: "mailto:rizal.maulanasx@gmail.com"
      }
    },
    {
      name: "Rizky Fadilah",
      role: "Deployment Team",
      imgSrc: "./assets/img/rizky f.png",
      social: {
        linkedin: "https://www.linkedin.com/in/rizky-fadilah-b26b7521b/",
        instagram: "http://instagram.com/fadilahvk",
        gmail: "mailto:fadilahvk@gmail.com"
      }
    },
    {
      name: "Nabila Balqis",
      role: "Quality Assurance",
      imgSrc: "./assets/img/nabila.png",
      social: {
        linkedin: "https://www.linkedin.com/in/nabila-balqis-7121712b2",
        instagram: "https://www.instagram.com/nabila.balqis.167",
        gmail: "mailto:nabilabalqis97@gmail.com"
      }
    },
    {
      name: "Dzikra Pahrezi Kameswara",
      role: "Quality Assurance",
      imgSrc: "./assets/img/pahrezi.png",
      social: {
        linkedin: "https://www.linkedin.com/in/dzikra-pahrezi-kameswara",
        instagram: "http://instagram.com/dzikrapahrezi",
        gmail: "mailto:pahrezikameswara@gmail.com"
      }
    },
    {
      name: "Indira Febrica",
      role: "Quality Assurance",
      imgSrc: "./assets/img/indira.png",
      social: {
        linkedin: "https://www.linkedin.com/in/indira-febrica-66999a29a",
        instagram: "http://instagram.com/heydirra",
        gmail: "mailto:indirafebrica230202@gmail.com"
      }
    },
    {
      name: "Rizky Maulana",
      role: "Pitch Deck Team",
      imgSrc: "./assets/img/maulana.png",
      social: {
        linkedin: "belum ada",
        instagram: "https://www.instagram.com/muhammad_rizky_maulana01/",
        gmail: "mailto:maulanarizky2401@gmail.com"
      }
    },
    {
      name: "Afifah Khoirun Nisa",
      role: "Pitch Deck Team",
      imgSrc: "./assets/img/afifah.png",
      social: {
        linkedin: "https://www.linkedin.com/in/afifah-khoirun-nisa-35aa471a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        instagram: "http://instagram.com/ifahhhkn",
        gmail: "mailto:afifahknsaaa@gmail.com"
      }
    },
    {
      name: "Ferdinand Ramadhani Firmansyah",
      role: "Pitch Deck Team",
      imgSrc: "./assets/img/ferdi.png",
      social: {
        linkedin: "https://www.linkedin.com/in/ferdinand-ramadhani-firmansyah-a703b02a5/",
        instagram: "https://www.instagram.com/",
        gmail: "mailto:ferdyhisoka22@gmail.com"
      }
    },
  ];
  
  // Fungsi untuk menambahkan data dari variabel object
  function addCard(member) {
    var container = document.getElementById('cards-container');
    var card = document.createElement('div');
    card.className = 'card';
    
    var imageDiv = document.createElement('div');
    imageDiv.className = 'image';
    var image = document.createElement('img');
    image.src = member.imgSrc;
    image.alt = 'Foto Profil';
    imageDiv.appendChild(image);
    
    var nameHeading = document.createElement('h2');
    nameHeading.className = 'name';
    nameHeading.textContent = member.name;
    
    var rolePara = document.createElement('p');
    rolePara.className = 'role';
    rolePara.textContent = member.role;
    
    var iconsDiv = document.createElement('div');
    iconsDiv.className = 'icons';
    
    var linkedinLink = createIconLink(member.social.linkedin, 'https://cdn.iconscout.com/icon/free/png-256/free-linkedin-circle-1868976-1583140.png?f=webp');
    var instagramLink = createIconLink(member.social.instagram, 'https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Instagram_colored_svg_1-1024.png');
    var gmailLink = createIconLink(member.social.gmail, 'https://cdn1.iconfinder.com/data/icons/google-new-logos-1/32/gmail_new_logo-1024.png');
    
    iconsDiv.appendChild(linkedinLink);
    iconsDiv.appendChild(instagramLink);
    iconsDiv.appendChild(gmailLink);
    
    card.appendChild(imageDiv);
    card.appendChild(nameHeading);
    card.appendChild(rolePara);
    card.appendChild(iconsDiv);
    
    container.appendChild(card);
  }
  
  // Fungsi untuk membuat ikon link
  function createIconLink(href, imgSrc) {
    var link = document.createElement('a');
    link.href = href;
    var icon = document.createElement('img');
    icon.src = imgSrc; // Menambahkan sumber gambar ikon
    icon.alt = 'Icon'; // Menambahkan atribut alt untuk aksesibilitas
    link.appendChild(icon);
    return link;
  }
  
  // Menambahkan data dari variabel object
  teamMembers.forEach(function(member) {
    addCard(member);
  });
  
  
  ///Feedback
  function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    
    let isValid = true;
    
    // Clear previous error messages
    document.getElementById('name-error').innerText = '';
    document.getElementById('email-error').innerText = '';
    document.getElementById('message-error').innerText = '';
    
    // Validate name
    const name = document.getElementById('name').value;
    if (!name) {
      document.getElementById('name-error').innerText = 'Name cannot be empty!';
      isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email').value;
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,6}$/;
    if (!email) {
      document.getElementById('email-error').innerText = 'E-mail cannot be empty!';
      isValid = false;
    } else if (!email.match(emailPattern)) {
      document.getElementById('email-error').innerText = 'Invalid E-Mail address!';
      isValid = false;
    }
    
    // Validate message
    const message = document.getElementById('message').value;
    if (!message) {
      document.getElementById('message-error').innerText = 'Feedback cannot be empty!';
      isValid = false;
    }
    
    // If all validations pass, submit the form
    if (isValid) {
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.classList.add('success-message');
      successMessage.innerHTML = 'Your feedback has been sent.<span>Thank you for your feedback.</span>';
      successMessage.querySelector('span').textContent = ' Thank you for your feedback.';
      const feedbackDescription = document.querySelector('.feedback-description');
      feedbackDescription.parentNode.insertBefore(successMessage, feedbackDescription.nextSibling);
      
      // Reset form fields
      document.getElementById('feedback-form').reset();
      
      setTimeout(function() {
        successMessage.style.display = 'none';
      }, 5000);
      
      
      return false;
    }
  }