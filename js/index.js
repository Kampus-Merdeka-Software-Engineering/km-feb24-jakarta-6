// header 
const menuIcon = document.querySelector(".menu-icon");
const navMenu = document.querySelector(".nav-menu");

menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("active");
    navMenu.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    menuIcon.classList.remove("active");
    navMenu.classList.remove("active");
}));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));
      const offsetTop = 100; // Ubah sesuai dengan jumlah pixel yang ingin Anda turunkan
      const scrollPosition = target.offsetTop - offsetTop;

      window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
      });
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
  