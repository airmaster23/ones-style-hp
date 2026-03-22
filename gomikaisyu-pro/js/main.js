/* ================================================
   ゴミ屋敷清掃 専門サイト — JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== Header scroll ===== */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ===== Hamburger ===== */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open', isOpen);
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ===== FAQ Accordion ===== */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        if (o !== item) {
          o.classList.remove('open');
          o.querySelector('.faq-answer').style.maxHeight = '0';
          o.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ===== Price Tabs ===== */
  document.querySelectorAll('.price-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.price-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.price-table-wrap').forEach(w => w.classList.add('hidden'));
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.remove('hidden');
    });
  });

  /* ===== Intersection Observer — fade-up & fade-stagger ===== */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .fade-up-delay').forEach(el => observer.observe(el));
  document.querySelectorAll('.fade-stagger').forEach(el => observer.observe(el));

  /* ===== Smooth scroll ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===== Contact form validation ===== */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = ['name', 'phone', 'message', 'service'];
      let valid = true;
      fields.forEach(name => {
        const field = form.querySelector(`[name="${name}"]`);
        if (!field) return;
        if (!field.value.trim()) {
          field.style.borderColor = '#F97316';
          field.style.boxShadow = '0 0 0 3px rgba(249,115,22,.15)';
          valid = false;
        } else {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }
        field.addEventListener('input', () => {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }, { once: true });
      });
      if (valid) {
        const btn = form.querySelector('.form-submit');
        const original = btn.innerHTML;
        btn.innerHTML = '✓ 送信しました！担当者よりご連絡いたします';
        btn.disabled = true;
        btn.style.background = '#22C55E';
        setTimeout(() => {
          form.reset();
          btn.innerHTML = original;
          btn.disabled = false;
          btn.style.background = '';
        }, 4000);
      }
    });
  }

});
