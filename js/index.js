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
// Load Dataset // 
document.addEventListener('DOMContentLoaded', function() {
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.style.display = 'block';

  fetch('./assets/data/dataset.json')
      .then(response => response.json())
      .then(data => {
          loadingIndicator.style.display = 'none'; 
          console.log(data);
        })
      .catch(error => {
          console.error('Error loading the dataset:', error);
          loadingIndicator.style.display = 'none'; 
      });
});


//Insight
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
      imgSrc: "belum ada",
      social: {
        linkedin: "belum ada",
        instagram: "https://www.instagram.com/muhammad_rizky_maulana01/",
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
      imgSrc: "./assets/img/belum ada.jpg",
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
      document.getElementById('name-error').innerText = 'Name tidak boleh kosong!';
      isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email').value;
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,6}$/;
    if (!email) {
      document.getElementById('email-error').innerText = 'E-mail tidak boleh kosong!';
      isValid = false;
    } else if (!email.match(emailPattern)) {
      document.getElementById('email-error').innerText = 'Alamat E-Mail tidak Valid';
      isValid = false;
    }
    
    // Validate message
    const message = document.getElementById('message').value;
    if (!message) {
      document.getElementById('message-error').innerText = 'Feedback tidak boleh kosong!.';
      isValid = false;
    }
    
    // If all validations pass, submit the form
    if (isValid) {
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.classList.add('success-message');
      successMessage.innerHTML = 'Masukan Anda telah terkirim.<span>Terima kasih atas masukannya.</span>';
      successMessage.querySelector('span').textContent = ' Terima kasih atas masukannya.';
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
