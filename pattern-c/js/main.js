/* ============================================================
   便利屋ワンズスタイル – Pattern C  main.js
   Natural & Friendly design. No custom cursor.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. Header scroll effect
     ---------------------------------------------------------- */
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     2. Hamburger menu
     ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     3. Smooth scroll
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     4. Fade-in on scroll (IntersectionObserver)
     ---------------------------------------------------------- */
  const staggerContainerSelectors = [
    '.pillars',
    '.service-cards',
    '.service-grid--compact',
    '.testimonial-cards',
    '.flow-steps'
  ];

  // Assign data-delay to children of stagger containers
  staggerContainerSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(container => {
      const children = container.querySelectorAll('.fade-in');
      children.forEach((child, index) => {
        child.setAttribute('data-delay', index);
      });
    });
  });

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay');

        if (delay !== null) {
          setTimeout(() => {
            el.classList.add('visible');
          }, parseInt(delay, 10) * 120);
        } else {
          el.classList.add('visible');
        }

        fadeObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => {
    fadeObserver.observe(el);
  });

  /* ----------------------------------------------------------
     5. FAQ Accordion
     ---------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const parentItem = question.closest('.faq-item');

      // Close all other FAQ items
      document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== parentItem) {
          item.classList.remove('active');
        }
      });

      // Toggle current item
      parentItem.classList.toggle('active');
    });
  });

  /* ----------------------------------------------------------
     6. Contact Form
     ---------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const nameInput   = document.getElementById('name');
    const phoneInput  = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    // Clear error on input
    [nameInput, phoneInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          clearError(input);
        });
      }
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        showError(nameInput, 'お名前を入力してください');
        isValid = false;
      }

      // Validate phone
      const phoneRaw = phoneInput.value.replace(/[-\s]/g, '');
      if (!phoneInput.value.trim()) {
        showError(phoneInput, '正しい電話番号を入力してください');
        isValid = false;
      } else if (!/^0\d{9,10}$/.test(phoneRaw)) {
        showError(phoneInput, '正しい電話番号を入力してください');
        isValid = false;
      }

      // Validate message
      if (!messageInput.value.trim()) {
        showError(messageInput, 'ご依頼内容の詳細を入力してください');
        isValid = false;
      }

      if (!isValid) return;

      // Submit
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';

      try {
        const response = await fetch('https://formsubmit.co/ajax/info@benri-ya.work', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            message: messageInput.value.trim(),
            _subject: '便利屋ワンズスタイル HPからのお問い合わせ',
            _template: 'table'
          })
        });

        if (!response.ok) throw new Error('送信に失敗しました');

        submitBtn.textContent = '送信しました';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 4000);

      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        alert('送信に失敗しました。お手数ですが、お電話にてお問い合わせください。\nTEL: 090-6653-2851');
      }
    });
  }

  /* --- Form helper functions --- */

  function showError(input, message) {
    clearError(input);
    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    input.classList.add('error');
    input.parentNode.appendChild(errorEl);
  }

  function clearError(input) {
    input.classList.remove('error');
    const existing = input.parentNode.querySelector('.error-message');
    if (existing) existing.remove();
  }

});