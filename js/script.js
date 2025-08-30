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
  let isHovering = false;
  let scrollTimeout = null;
  let lastScrollPosition = 0;

  // Sayfa refresh olunca başa yumuşak kay
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Throttle function - çok sık çalışmayı engeller
  function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // ===== SCROLL EVENT - THROTTLED =====
  const handleScroll = throttle(() => {
    const scrollPos = window.scrollY;

    // Scroll pozisyon değişmemişse hiçbir şey yapma
    if (Math.abs(scrollPos - lastScrollPosition) < 5) return;
    lastScrollPosition = scrollPos;

    const offset = navbar.offsetHeight + 10;

    // Navbar arka plan ve küçülme
    if (scrollPos > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hover sırasında scroll ile bant değişmesini engelle
    if (isHovering) return;

    // Hero section üstündeyse bantı kaldır
    if (sections.length === 0 || scrollPos + offset < sections[0].section.offsetTop) {
      if (activeLink !== null) {
        activeLink = null;
        hideIndicator();
      }
      return;
    }

    // En uygun section'u bul
    let newActiveLink = null;
    let maxVisibleHeight = 0;

    for (const { link, section } of sections) {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const viewportTop = scrollPos + offset;
      const viewportBottom = scrollPos + window.innerHeight;

      // Section görünür aralıkta mı?
      if (viewportTop < sectionBottom && viewportBottom > sectionTop) {
        const visibleTop = Math.max(viewportTop, sectionTop);
        const visibleBottom = Math.min(viewportBottom, sectionBottom);
        const visibleHeight = visibleBottom - visibleTop;

        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          newActiveLink = link;
        }
      }
    }

    // Active link değiştiyse bantı hareket ettir
    if (newActiveLink !== activeLink) {
      activeLink = newActiveLink;
      if (activeLink) {
        showIndicatorForActive(activeLink);
      } else {
        hideIndicator();
      }
    }
  }, 16); // ~60fps

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', function (event) {
      if (!hamburger.contains(event.target) && !mobileMenu.contains(event.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
  }

  // ===== HOVER EFFECTS - SADECE RENK DEĞİŞİMİ =====
  links.forEach((link) => {
    link.addEventListener('mouseenter', function () {
      if (window.innerWidth <= 768) return;

      isHovering = true;
      // Sadece CSS hover efekti çalışsın, bant hareket etmesin
    });

    link.addEventListener('mouseleave', function () {
      if (window.innerWidth <= 768) return;

      // Küçük bir delay ile hover bittiğini işaretle
      setTimeout(() => {
        isHovering = false;
        // Hover bittikten sonra active link varsa bantı göster
        if (activeLink) {
          showIndicatorForActive(activeLink);
        }
      }, 50);
    });
  });

  // ===== LINK TIKLAMA =====
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Smooth scroll
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        // Adres çubuğuna hash ekle
        history.pushState(null, null, `#${targetId}`);

        // Active link güncelle
        activeLink = link;
        showIndicatorForActive(link);
      }
    });
  });

  // ===== LOGO TIKLAMA =====
  if (logo) {
    logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      activeLink = null;
      hideIndicator();
      history.pushState(null, null, window.location.pathname);
    });
  }

  // ===== INDICATOR FONKSİYONLARI =====
  function showIndicatorForActive(link) {
    if (window.innerWidth <= 768) return;

    const rect = link.getBoundingClientRect();
    const navRect = navbar.getBoundingClientRect();
    const indicatorWidth = 120;

    const leftPos = rect.left - navRect.left + rect.width / 2 - indicatorWidth / 2;

    indicator.style.left = leftPos + "px";
    indicator.style.width = indicatorWidth + "px";
    indicator.style.opacity = '1';
  }

  function hideIndicator() {
    indicator.style.width = '0';
    indicator.style.opacity = '0';
  }

  // Window resize'da indicator pozisyonunu düzelt
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (activeLink && window.innerWidth > 768) {
        showIndicatorForActive(activeLink);
      } else {
        hideIndicator();
      }
    }, 150);
  });

  let currentPositions = [0, 1, 2, 3, 4, 5];
let isAnimating = false;

// Her balonun kendi rengini tanımlayın
const circleColors = [
  '#ff1744e3', // Access Bars - Kırmızı
  '#ff9100ba', // ThetaHealing - Turuncu  
  '#ffea00e6', // Nefes Çalışmaları - Sarı
  '#00c853ba', // Meditasyon - Yeşil
  '#2979ffd4', // Reiki - Mavi
  '#aa00ffba'  // Kalbin Rehberliği - Mor
];

// Full text content
const fullTexts = [
  {
    title: "Access Bars",
    text: "Access Bars, baş üzerinde bulunan 32 enerji noktasına hafif dokunuşlarla uygulanan bir yöntemdir. Bu noktalar, hayatımızda para, sağlık, mutluluk, yaratıcılık gibi farklı alanları temsil eder. Bars çalışması sırasında zihinde biriken gereksiz düşünceler ve sınırlayıcı kalıplar serbest bırakılır. Sonuç olarak kişi daha sakin, açık ve özgür bir zihinle yaşamına devam edebilir."
  },
  {
    title: "ThetaHealing",
    text: "ThetaHealing, bilinçaltındaki olumsuz inanç ve kalıpları dönüştürmeye yardımcı olan güçlü bir şifa yöntemidir. Kişi, özel bir meditasyon tekniğiyle beyin dalgalarını 'theta' frekansına getirir ve bu derin gevşeme halinde içsel değişim kolaylaşır. Kısıtlayıcı inançlar yerine destekleyici ve iyileştirici düşünceler yerleştirilerek, kişinin yaşamında daha huzurlu ve dengeli adımlar atması hedeflenir."
  },
  {
    title: "Nefes Çalışmaları",
    text: "Nefes, yaşam enerjimizin en önemli kaynağıdır. Farkındalıklı nefes teknikleri sayesinde beden, zihin ve ruh dengelenir. Derin ve bilinçli nefes, stresi azaltır, zihinsel berraklığı artırır ve bedeni canlandırır. Düzenli yapılan nefes çalışmaları, hem duygusal yüklerden arınmayı hem de günlük hayatta daha dingin ve enerjik hissetmeyi sağlar."
  },
  {
    title: "Meditasyon",
    text: "Meditasyon, zihni sakinleştirmenin ve anda kalmanın en etkili yollarından biridir. Düzenli meditasyon pratiği, kişinin iç huzurunu güçlendirir, stres ve kaygıyı azaltır. Rehberli meditasyonlardan sessizlik çalışmalarına kadar farklı yöntemlerle uygulanabilir. Meditasyon sayesinde kişi, kendi iç dünyasına daha derin bir yolculuk yapar ve yaşamında farkındalık geliştirmeye başlar."
  },
  {
    title: "Reiki",
    text: "Reiki, evrensel yaşam enerjisini bedene aktarmayı amaçlayan Japon kökenli bir şifa tekniğidir. Reiki uygulaması sırasında eller aracılığıyla enerji akışı sağlanır ve bu sayede kişinin bedeninde, zihninde ve ruhunda denge kurulur. Reiki, rahatlama, enerji artışı ve içsel huzur arayanlar için etkili bir yöntemdir. Düzenli uygulamalarla yaşam enerjisi yeniden uyumlu hale gelir."
  },
  {
    title: "Kalbin Rehberliği",
    text: "Kalbin rehberliği, içsel sezgiyi ve kalpten gelen bilgeliği duymayı öğrenmektir. Zihnin karmaşasından sıyrılarak kalbe odaklanıldığında, daha doğru ve uyumlu kararlar almak kolaylaşır. Kalbin rehberliğini takip eden kişi, yaşamını sevgi, huzur ve güven duygusuyla şekillendirebilir. Bu yaklaşım, hem ruhsal yolculukta hem de günlük hayatta kişinin kendi özüne daha yakın hissetmesini sağlar."
  }
];

// Renkleri güncelleme fonksiyonu
function updateColors() {
  const circles = document.querySelectorAll('.circle');
  circles.forEach((circle, index) => {
    const dataIndex = parseInt(circle.getAttribute('data-index'));
    circle.style.backgroundColor = circleColors[dataIndex];
  });
}

// Rotate function - renk güncellemesi eklendi
function rotate(direction = 'next') {
  if (isAnimating) return;
  isAnimating = true;

  const circles = document.querySelectorAll('.circle');

  if (direction === 'next') {
    currentPositions.push(currentPositions.shift());
  } else {
    currentPositions.unshift(currentPositions.pop());
  }

  circles.forEach((circle, index) => {
    circle.className = 'circle';
    circle.classList.add(`pos-${currentPositions[index]}`);
  });

  // Renkleri güncelle
  updateColors();

  setTimeout(() => {
    isAnimating = false;
  }, 600);
}

// Sayfa yüklendiğinde renkleri ayarla
function initializeColors() {
  const circles = document.querySelectorAll('.circle');
  circles.forEach((circle, index) => {
    const dataIndex = parseInt(circle.getAttribute('data-index'));
    circle.style.backgroundColor = circleColors[dataIndex];
  });
}

// Birden fazla yöntemle renklerin yüklenip yüklenmediğini kontrol et:
document.addEventListener('DOMContentLoaded', initializeColors);
window.addEventListener('load', initializeColors);

// Modal functions
function openModal(index) {
  const modal = document.getElementById('textModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');

  const pos1Index = currentPositions.indexOf(1);
  const actualIndex = (pos1Index + index) % fullTexts.length;

  modalTitle.textContent = fullTexts[actualIndex].title;
  modalText.textContent = fullTexts[actualIndex].text;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('textModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Event listeners
document.querySelectorAll('.circle').forEach(circle => {
  circle.addEventListener('click', (e) => {
    if (!e.target.classList.contains('read-more-btn')) {
      if (window.innerWidth > 480) {
        rotate();
      }
    }
  });
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('read-more-btn')) {
    e.stopPropagation();
    const circle = e.target.closest('.circle');
    const index = parseInt(circle.getAttribute('data-index'));
    openModal(index);
  }
});

document.querySelector('.next-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  rotate('next');
});

document.querySelector('.prev-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  rotate('prev');
});

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
    e.preventDefault();
    rotate('next');
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    rotate('prev');
  }
  if (e.key === 'Escape') {
    closeModal();
  }
});

window.addEventListener("click", (event) => {
  const modal = document.getElementById('textModal');
  if (event.target === modal) {
    closeModal();
  }
});

document.querySelector(".close-btn").addEventListener("click", closeModal);

// Touch events for mobile swipe
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (window.innerWidth > 480) return;

  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      rotate('next');
    } else {
      rotate('prev');
    }
  }
}

  // Seminer Fiyat Butonları
  document.querySelectorAll('.fiyat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // circle click gibi davranmasını engelle
      const modal = document.getElementById('textModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalText = document.getElementById('modalText');

      modalTitle.textContent = btn.dataset.seminar;
      modalText.innerHTML = `
      Fiyat ve detaylar için aşağıdaki seçeneklerden birini seçebilirsiniz:<br><br>
      <div style="display:flex; gap:15px; justify-content:center;">
        <button onclick="window.open('https://www.instagram.com/yourprofile','_blank')" class="fiyat-option-btn">Instagram</button>
        <button onclick="window.location.href='tel:+905XXXXXXXXX'" class="fiyat-option-btn">Telefon</button>
      </div>
    `;

      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });


  // ===== SWIPER =====
  if (typeof Swiper !== 'undefined') {
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
  }

});