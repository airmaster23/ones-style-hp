// ===== 便利屋ワンズスタイル — Main JS =====

document.addEventListener('DOMContentLoaded', () => {

  // ===== Custom Cursor =====
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    document.querySelectorAll('a, button, .service-card, .service-card--compact, .pillar, .branch-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width  = '16px';
        cursor.style.height = '16px';
        follower.style.width  = '48px';
        follower.style.height = '48px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width  = '8px';
        cursor.style.height = '8px';
        follower.style.width  = '32px';
        follower.style.height = '32px';
      });
    });
  }

  // ===== Header scroll =====
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ===== Hamburger =====
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== Smooth scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Fade-in =====
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const delay = en.target.dataset.delay || 0;
        setTimeout(() => en.target.classList.add('visible'), delay);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Stagger siblings
  document.querySelectorAll('.pillars, .service-cards, .service-grid--compact').forEach(parent => {
    parent.querySelectorAll('.fade-in').forEach((el, i) => {
      el.dataset.delay = i * 120;
    });
  });

  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

  // ===== Contact Form =====
  // NOTE: エンドポイントは仮設定。お客様確認後に正式なメールアドレスに変更すること。
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/info@benri-ya.work';
  const form = document.getElementById('contactForm');
  if (!form) return;

  const validate = () => {
    let ok = true;

    const name    = form.querySelector('#name');
    const nameErr = form.querySelector('#nameErr');
    if (!name.value.trim()) {
      name.classList.add('error');
      nameErr.textContent = 'お名前を入力してください';
      ok = false;
    } else { name.classList.remove('error'); nameErr.textContent = ''; }

    const phone    = form.querySelector('#phone');
    const phoneErr = form.querySelector('#phoneErr');
    const phoneVal = phone.value.replace(/[-\s]/g, '');
    if (!phoneVal || !/^0\d{9,10}$/.test(phoneVal)) {
      phone.classList.add('error');
      phoneErr.textContent = '正しい電話番号を入力してください';
      ok = false;
    } else { phone.classList.remove('error'); phoneErr.textContent = ''; }

    const msg    = form.querySelector('#message');
    const msgErr = form.querySelector('#messageErr');
    if (!msg.value.trim()) {
      msg.classList.add('error');
      msgErr.textContent = 'ご依頼内容の詳細を入力してください';
      ok = false;
    } else { msg.classList.remove('error'); msgErr.textContent = ''; }

    return ok;
  };

  form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const err = el.parentElement.querySelector('.form-err');
      if (err) err.textContent = '';
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span>送信中...</span>';

    try {
      const formData = new FormData(form);
      const data = {};
      formData.forEach((val, key) => { data[key] = val; });
      data['_subject'] = '便利屋ワンズスタイル HPからのお問い合わせ';
      data['_template'] = 'table';

      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        btn.innerHTML = '<span>送信しました</span>';
        btn.style.background = 'var(--primary)';
        form.reset();
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 4000);
      } else { throw new Error(); }
    } catch {
      btn.disabled = false;
      btn.innerHTML = orig;
      alert('送信に失敗しました。お電話にてお問い合わせください。\n080-2516-3271');
    }
  });

});
