// Pattern 1 – main.js
(() => {
  // Header scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 10);
  });

  // Hamburger
  const burger = document.querySelector('.hamburger');
  const gnav = document.querySelector('.gnav');
  burger?.addEventListener('click', () => {
    gnav?.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    burger.classList.toggle('open');
    if (burger.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Price tabs
  document.querySelectorAll('.price-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.price-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.price-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      target?.classList.add('active');
    });
  });

  // Fade in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();
