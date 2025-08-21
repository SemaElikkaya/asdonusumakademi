document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const logo = document.querySelector('.navbar .logo img');

  // Scroll ile navbar rengini değiştir
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Logoya tıklayınca sayfa başa dönsün
  logo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  let currentPositions = [0, 1, 2, 3, 4, 5]; // Her dairenin hangi pozisyonda olduğu
  let isAnimating = false;

  function rotate() {
    if (isAnimating) return;
    isAnimating = true;

    // Pozisyonları sola kaydır: [0,1,2,3] -> [3,0,1,2]
    currentPositions.push(currentPositions.shift());

    // Daireleri yeni pozisyonlarına taşı
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
      const newPosition = currentPositions[index];

      // Eski pozisyon sınıfını kaldır
      circle.className = 'circle';

      // Yeni pozisyon sınıfını ekle
      circle.classList.add(`pos-${newPosition}`);
    });

    setTimeout(() => {
      isAnimating = false;
    }, 600);
  }

  // Tıklama olayları
  document.querySelectorAll('.circle').forEach(circle => {
    circle.addEventListener('click', rotate);
  });

  // Klavye kontrolleri
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
      rotate();
    }
  });
});
  const swiper = new Swiper(".swiper", {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }
  });