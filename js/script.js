document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const logo = document.querySelector('.navbar .logo img');
  const links = document.querySelectorAll(".nav-links li:not(.navbar-logo) a");
  const indicator = document.querySelector(".nav-indicator");

  // Hero section ve diğer sectionları al
  const sections = [];
  links.forEach(link => {
    const targetId = link.getAttribute("href").substring(1);
    const section = document.getElementById(targetId);
    if (section) sections.push({ link, section });
  });

  let activeLink = null;
  indicator.style.width = 0;

  // Sayfa refresh olunca başa yumuşak kay
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Scroll ile active link ve navbar renk kontrolü
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const offset = navbar.offsetHeight + 5;

    // Navbar arka plan ve küçülme
    if (scrollPos > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hero section üstündeyse bantı kaldır
    if (scrollPos + offset < sections[0].section.offsetTop) {
      activeLink = null;
      indicator.style.width = 0;
      return;
    }

    // Her section'u kontrol et
    for (const { link, section } of sections) {
      if (scrollPos + offset >= section.offsetTop && scrollPos + offset < section.offsetTop + section.offsetHeight) {
        if (activeLink !== link) {
          activeLink = link;
          moveIndicator(link);
        }
        break;
      }
    }
  });

  // Linklere tıklama: smooth scroll + hash update
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });

        // Adres çubuğuna hash ekle
        history.pushState(null, null, `#${targetId}`);
      }
      activeLink = link;
      moveIndicator(link);
    });
  });

  // Logoya tıklayınca başa dön ve bant kaybolsun
  logo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeLink = null;
    indicator.style.width = 0;
    history.pushState(null, null, `#`); // hash temizle
  });

  function moveIndicator(link) {
    const rect = link.getBoundingClientRect();
    const navRect = link.closest(".navbar").getBoundingClientRect();
    const indicatorWidth = 120; // istediğin sabit genişlik, örn: 120px

    // Linkin ortasına hizala
    indicator.style.left = (rect.left - navRect.left + rect.width / 2 - indicatorWidth / 2) + "px";
    indicator.style.width = indicatorWidth + "px"; // sabit genişlik
  }


  // ===== CIRCLE ROTATION =====
  let currentPositions = [0, 1, 2, 3, 4, 5];
  let isAnimating = false;

  function rotate() {
    if (isAnimating) return;
    isAnimating = true;
    currentPositions.push(currentPositions.shift());
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
      circle.className = 'circle';
      circle.classList.add(`pos-${currentPositions[index]}`);
    });
    setTimeout(() => { isAnimating = false; }, 600);
  }

  document.querySelectorAll('.circle').forEach(circle => circle.addEventListener('click', rotate));
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') rotate();
  });
  // ===== END CIRCLE ROTATION =====

  // ===== SWIPER =====
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

});
