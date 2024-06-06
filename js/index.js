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
  console.log(selectedValues);
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
          populateFilterDropdown('product-type', uniqueValues.productType);

          chart = lineChartAverageRevenue(data); // Assign the returned value to chart variable

          // Menambahkan event listener untuk tombol OK dan Reset
          document.getElementById('ok').addEventListener('click', applyFilters);
          document.getElementById('reset').addEventListener('click', resetFilters);

          // Update dashboard after chart initialization
          updateDashboard(data);
          updateScoreCard(data);
          drawHorizontalBarChart(data);
          productComposition(data);

          loadingIndicator.style.display = 'none';
      })
      .catch(error => {
          console.error('Error loading the dataset:', error);
          loadingIndicator.style.display = 'none';
      });

  // Function definitions

  function extractUniqueValues(data) {
      const uniqueValues = {
          year: [],
          gender: [],
          country: [],
          continent: [],
          productType: [],
          month: []
      };

      data.forEach(item => {
          if (!uniqueValues.year.includes(item.Year)) {
              uniqueValues.year.push(item.Year);
          }
          if (!uniqueValues.gender.includes(item.Customer_Gender) && item.Customer !== "-") {
              uniqueValues.gender.push(item.Customer_Gender);
          }
          if (!uniqueValues.country.includes(item.Country)) {
              uniqueValues.country.push(item.Country);
          }
          if (!uniqueValues.continent.includes(item.Continent)) {
              uniqueValues.continent.push(item.Continent);
          }
          if (!uniqueValues.productType.includes(item.Product_Type) && item.Product_Type !== "-") {
              uniqueValues.productType.push(item.Product_Type);
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
      const selectedProductType = document.getElementById('product-type').value;

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
          if (selectedProductType !== '' && item.Product_Type !== selectedProductType) {
              return false;
          }
          return true;
      });
      updateChart(chart, filteredData);
      updateScoreCard(filteredData);
      drawHorizontalBarChart(filteredData)
      productComposition(filteredData);
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


  function lineChartAverageRevenue(data) {
      const ctx = document.getElementById('line-average-revenue').getContext('2d');
      return new Chart(ctx, {
          type: 'line',
          data: getData(data),
          options: {
              responsive: true,
              scales: {
                  y: {
                      beginAtZero: true,
                      title: {
                          display: true,
                          text: 'Average Revenue'
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
          productType: document.getElementById('product-type').value
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
      if (filters.productType) {
          filteredData = filteredData.filter(d => d.Product_Type == filters.productType);
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
              acc[curr.Year] = { totalRevenue: 0, count: 0 };
          }
          acc[curr.Year].totalRevenue += curr.Revenue;
          acc[curr.Year].count += 1;
          return acc;
      }, {});

      const years = Object.keys(groupedData);
      const averageRevenues = years.map(year => groupedData[year].totalRevenue / groupedData[year].count);

      return {
          data: {
              labels: years,
              datasets: [{
                  label: 'Average Revenue',
                  data: averageRevenues,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
              }]
          },
          xLabel: 'Year'
      };
  }

  function getMonthlyData(data) {
      const uniqueMonths = [...new Set(data.map(d => d.Month))];
      const groupedData = data.reduce((acc, curr) => {
          if (!acc[curr.Month]) {
              acc[curr.Month] = { totalRevenue: 0, count: 0 };
          }
          acc[curr.Month].totalRevenue += curr.Revenue;
          acc[curr.Month].count += 1;
          return acc;
      }, {});

      const averageRevenues = uniqueMonths.map(month => groupedData[month].totalRevenue / groupedData[month].count);

      return {
          data: {
              labels: uniqueMonths,
              datasets: [{
                  label: 'Average Revenue',
                  data: averageRevenues,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
              }]
          },
          xLabel: 'Month'
      };
  }

  function drawHorizontalBarChart(data) {
    // Group data by Country and calculate total profit
    const groupedData = data.reduce((acc, curr) => {
        if (!acc[curr.Country]) {
            acc[curr.Country] = 0;
        }
        acc[curr.Country] += curr.Profit;
        return acc;
    }, {});

    const countries = Object.keys(groupedData);
    const totalProfits = countries.map(country => groupedData[country]);

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
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
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
                    text: 'Total Profit by Country'
                }
            }
        }
    };
    new Chart(ctx, config);
}

function productComposition(data) {
  // Group data by Sub_Category and Product_Type
  const groupedData = data.reduce((acc, curr) => {
      if (!acc[curr.Sub_Category]) {
          acc[curr.Sub_Category] = {};
      }
      if (!acc[curr.Sub_Category][curr.Product_Type]) {
          acc[curr.Sub_Category][curr.Product_Type] = 0;
      }
      acc[curr.Sub_Category][curr.Product_Type] += curr.Order_Quantity;
      return acc;
  }, {});

  const subCategories = Object.keys(groupedData);
  const productTypes = [...new Set(data.map(d => d.Product_Type))];

  const datasets = productTypes.map(productType => {
      return {
          label: productType,
          data: subCategories.map(subCategory => groupedData[subCategory][productType] || 0),
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
          borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
          borderWidth: 1
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
          labels: subCategories,
          datasets: datasets
      },
      options: {
          plugins: {
              title: {
                  display: true,
                  text: 'Product Type Composition by Sub Category'
              },
              legend: {
                  display: false
              }
          },
          responsive: true,
          scales: {
              x: {
                  stacked: true,
                  title: {
                      display: true,
                      text: 'Sub Category'
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






});

$(document).ready(function() {
  $.getJSON("./assets/data/dataset.json", function(data) {
      var keys = Object.keys(data[0]); 
      
      var thead = "<tr>";
      keys.forEach(function(key) {
          thead += "<th>" + key + "</th>";
      });
      thead += "</tr>";
      $("#dataTable thead").html(thead);

      var tbody = "";
      data.forEach(function(item) {
          tbody += "<tr>";
          keys.forEach(function(key) {
              tbody += "<td>" + item[key] + "</td>";
          });
          tbody += "</tr>";
      });
      $("#dataTable tbody").html(tbody);

      $('#dataTable').DataTable();
  });
});


// Insight Section
document.addEventListener("DOMContentLoaded", function() {
  const insights = document.querySelectorAll('.insight-div');
  
  insights.forEach(function(insight) {
    const question = insight.querySelector('.question');
    
    question.addEventListener('click', function() {
      insight.classList.toggle('active');
    });
  });
});


function generateInsight(question, answers) {
  
  const insightItem = document.createElement('div');
  insightItem.classList.add('insight-div');
  
  const questionElement = document.createElement('h1');
  questionElement.classList.add('question');
  questionElement.textContent = question;
  
  insightItem.appendChild(questionElement);
  
  const answerContainer = document.createElement('div');
  answerContainer.classList.add('answer');
  
  answers.forEach((answer) => {
    const answerItem = document.createElement('div');
    answerItem.classList.add('answer-item');
    answerItem.textContent = answer;
    
    answerContainer.appendChild(answerItem);
  });
  
  insightItem.appendChild(answerContainer);
  
  return insightItem;
}

const insightData = [
  {
    question: 'Daftar Pawang Hujan',
    answer: [
      'Mbak Rara',
      'Kobokan Aeru'
    ]
  },
  {
    question: 'Waga na wa Megumin! Ākuwizādo wo nariwai toshi, saikyou no kougeki no mahou "bakuretsu mahou" wo ayatsuru mono!',
    answer: [
      'ORA!.!.!. ORA!.!.! ORA!.!.!. ORA!.!.!. ORA!.!.!. ORA!.!.!. ORA!.!.!. ORA!.!.!. ORA!.!.!. ORA!.!.!. ORA!.!.!. ORA!.!.!. ORA!.!.!. ORA!.!.!. ORA!.!.!. ',
      'MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!. MUDA.!.!.',
      'MCLaren Lu Warna Apa Bos?'
    ]}
  ];
  
  const insightListContainer = document.querySelector('.insight-list');
  
  insightData.forEach((insightItem) => {
    const insightElement = generateInsight(insightItem.question, insightItem.answer);
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
      imgSrc: "./assets/img/maurita.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/maurita-eka-suraningtyas/",
        instagram: "https://www.instagram.com/mauritaeka.s_",
        gmail: "mailto:mauritaeka.suraningtyas@gmail.com"
      }
    },
    {
      name: "Elsa Hanifah Ananda",
      role: "Front End Engineer",
      imgSrc: "./assets/img/elsa.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/elsa-ananda-1a5230265/",
        instagram: "http://http://instagram.com/saaaeeell_",
        gmail: "mailto:elsaananda325@gmail.com"
      }
    },
    {
      name: "Ica Nur Halimah",
      role: "Front End Engineer",
      imgSrc: "./assets/img/ica.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/ica-nur-halimah/",
        instagram: "http://http://instagram.com/icaacoo",
        gmail: "mailto:icanur468@gmail.com"
      }
    },
    {
      name: "Nurul Syifa Khairani",
      role: "Front End Engineer",
      imgSrc: "./assets/img/syifa.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/nurul-syifa-khairani-395484219",
        instagram: "http://instagram.com/syifa.bluu",
        gmail: "mailto:nsk.syifa@gmail.com"
      }
    },
    {
      name: "Arya Syamudra",
      role: "Front End Engineer",
      imgSrc: "./assets/img/Arya.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/arya-syamudra/",
        instagram: "http://instagram.com/arya_syamudra",
        gmail: "mailto:aryasyamudra24@gmail.com"
      }
    },
    {
      name: "Rizal Maulana",
      role: "Deployment Team",
      imgSrc: "rizalmaulana",
      social: {
        linkedin: "belum ada",
        instagram: "https://instagram.com/rrizlms",
        gmail: "mailto:rizal.maulanasx@gmail.com"
      }
    },
    {
      name: "Rizky Fadilah",
      role: "Deployment Team",
      imgSrc: "./assets/img/rizky f.jpg",
      social: {
        linkedin: "belum ada",
        instagram: "http://instagram.com/fadilahvk",
        gmail: "mailto:fadilahvk@gmail.com"
      }
    },
    {
      name: "Nabila Balqis",
      role: "Quality Assurance",
      imgSrc: "./assets/img/belum ada",
      social: {
        linkedin: "belum ada",
        instagram: "https://www.instagram.com/nabila.balqis.167",
        gmail: "mailto:nabilabalqis97@gmail.com"
      }
    },
    {
      name: "Dzikha Pahrezi Kameswara",
      role: "Quality Assurance",
      imgSrc: "./assets/img/pahrezi.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/dzikra-pahrezi-kameswara",
        instagram: "http://instagram.com/dzikrapahrezi",
        gmail: "mailto:pahrezikameswara@gmail.com"
      }
    },
    {
      name: "Indira Febrica",
      role: "Quality Assurance",
      imgSrc: "./assets/img/indira.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/indira-febrica-66999a29a",
        instagram: "http://instagram.com/heydirra",
        gmail: "mailto:indirafebrica230202@gmail.com"
      }
    },
    {
      name: "Rizky Maulana",
      role: "Pitch Deck Team",
      imgSrc: "./assets/img/belum ada.jpg",
      social: {
        linkedin: "belum ada",
        instagram: "https://www.instagram.com/muhammad_rizky_maulana01/",
        gmail: "mailto:maulanarizky2401@gmail.com"
      }
    },
    {
      name: "Afifah Khoirun Nisa",
      role: "Pitch Deck Team",
      imgSrc: "./assets/img/belum ada.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/afifah-khoirun-nisa-35aa471a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        instagram: "http://instagram.com/ifahhhkn",
        gmail: "mailto:afifahknsaaa@gmail.com"
      }
    },
    {
      name: "Ferdinand Ramadhani Firmansyah",
      role: "Pitch Deck Team",
      imgSrc: "./assets/img/ferdi.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/ferdinand-ramadhani-firmansyah-a703b02a5/",
        instagram: "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Instagram_colored_svg_1-1024.png",
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