/* ═══════════════════════════════════════════════════════════════
   Francis Emmanuel Nweke — Portfolio Script
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // 1. DARK / LIGHT MODE TOGGLE
  // ─────────────────────────────────────────────────────────────

  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');

  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 2. HAMBURGER MENU
  // ─────────────────────────────────────────────────────────────

  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu   = document.getElementById('mobile-menu');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.removeAttribute('aria-hidden');
    hamburgerBtn.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close when a mobile nav link is clicked
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !hamburgerBtn.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 3. SMOOTH SCROLL WITH NAV OFFSET
  // ─────────────────────────────────────────────────────────────

  const NAV_HEIGHT = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '64'
  );

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. ACTIVE NAV HIGHLIGHT (IntersectionObserver)
  // ─────────────────────────────────────────────────────────────

  const navLinks = document.querySelectorAll('[data-nav-link]');
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: `-${NAV_HEIGHT}px 0px -55% 0px`, threshold: 0 }
  );

  sections.forEach(section => sectionObserver.observe(section));

  // ─────────────────────────────────────────────────────────────
  // 5. BACK TO TOP BUTTON
  // ─────────────────────────────────────────────────────────────

  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ─────────────────────────────────────────────────────────────

  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '-60px 0px', threshold: 0.1 }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // ─────────────────────────────────────────────────────────────
  // 7. TYPEWRITER EFFECT
  // ─────────────────────────────────────────────────────────────

  const typewriterTarget = document.getElementById('typewriter-target');

  if (typewriterTarget) {
    const phrases = [
      'Deep Learning Researcher',
      'Backend Engineer',
      'Aviation Enthusiast',
      'Building AI for Healthcare',
      'PhD Candidate @ KSU',
    ];

    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;

    function typewriter() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterTarget.textContent = currentPhrase.slice(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterTarget.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 45 : 80;

      if (!isDeleting && charIndex === currentPhrase.length) {
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 300;
      }

      setTimeout(typewriter, delay);
    }

    setTimeout(typewriter, 800);
  }

  // ─────────────────────────────────────────────────────────────
  // 8. HERO BACKGROUND GRID PARALLAX (desktop / hover device only)
  // ─────────────────────────────────────────────────────────────

  const heroSection = document.getElementById('hero');
  const heroBgGrid  = document.querySelector('.hero-bg-grid');

  if (heroSection && heroBgGrid && window.matchMedia('(hover: hover)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = heroSection.getBoundingClientRect();
      const xPercent = (e.clientX - left) / width - 0.5;
      const yPercent = (e.clientY - top)  / height - 0.5;
      heroBgGrid.style.transform = `translate(${xPercent * 18}px, ${yPercent * 12}px)`;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      heroBgGrid.style.transform = 'translate(0, 0)';
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 9. PROJECT FILTERING
  // ─────────────────────────────────────────────────────────────

  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update button states
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Filter cards with stagger
        let visibleIndex = 0;
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          const show = filter === 'all' || category === filter;

          if (show) {
            card.style.display = '';
            card.style.setProperty('--delay', `${visibleIndex * 0.06}s`);
            // Re-trigger reveal animation
            card.classList.remove('is-visible');
            requestAnimationFrame(() => {
              requestAnimationFrame(() => card.classList.add('is-visible'));
            });
            visibleIndex++;
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 10. GITHUB STATS (GitHub REST API)
  // ─────────────────────────────────────────────────────────────

  const GITHUB_USERNAME = 'asixofficial';
  let githubFetched = false;

  function animateCounter(containerId, targetValue) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const numberEl = container.querySelector('.stat-number');
    if (!numberEl) return;

    const start    = performance.now();
    const duration = 1400;

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      numberEl.textContent = Math.floor(eased * targetValue);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        numberEl.textContent = targetValue;
      }
    }

    requestAnimationFrame(step);
  }

  async function fetchGitHubStats() {
    if (githubFetched) return;
    githubFetched = true;

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
      ]);

      if (!userRes.ok || !reposRes.ok) return;

      const user  = await userRes.json();
      const repos = await reposRes.json();

      const totalStars = Array.isArray(repos)
        ? repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)
        : 0;

      animateCounter('gh-repos',     user.public_repos || 0);
      animateCounter('gh-stars',     totalStars);
      animateCounter('gh-followers', user.followers    || 0);
      animateCounter('gh-following', user.following    || 0);
    } catch {
      // Fail silently — "—" fallback values already shown in HTML
    }
  }

  // Fetch when Projects section enters viewport
  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    const ghObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchGitHubStats();
          ghObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    ghObserver.observe(projectsSection);
  }

  // ─────────────────────────────────────────────────────────────
  // 11. CONTACT FORM (Formspree)
  // ─────────────────────────────────────────────────────────────

  const contactForm  = document.getElementById('contact-form');
  const submitBtn    = document.getElementById('form-submit-btn');
  const formStatus   = document.getElementById('form-status');

  if (contactForm && submitBtn && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic client-side validation
      const requiredFields = contactForm.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#ff6b6b';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        formStatus.textContent = 'Please fill in all required fields.';
        formStatus.className   = 'form-status error';
        return;
      }

      // Send
      const btnText = submitBtn.querySelector('.btn-text');
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending…';
      formStatus.textContent = '';
      formStatus.className   = 'form-status';

      try {
        const res = await fetch(contactForm.action, {
          method:  'POST',
          body:    new FormData(contactForm),
          headers: { 'Accept': 'application/json' },
        });

        if (res.ok) {
          formStatus.textContent = 'Message sent! I will get back to you soon.';
          formStatus.className   = 'form-status success';
          contactForm.reset();
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Server error');
        }
      } catch {
        formStatus.textContent = 'Something went wrong. Please email me directly at nwekefrancis38@gmail.com';
        formStatus.className   = 'form-status error';
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message';
      }
    });

    // Clear field error styling on input
    contactForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 12. BLOG EXPAND / COLLAPSE
  // ─────────────────────────────────────────────────────────────

  document.querySelectorAll('.blog-read-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const postId = btn.getAttribute('data-post');
      const post   = document.getElementById(postId);
      if (!post) return;

      // If another post is open, close it first
      document.querySelectorAll('.blog-full-post:not([hidden])').forEach(openPost => {
        if (openPost !== post) {
          openPost.hidden = true;
          // Reset corresponding "Read More" button
          const otherBtn = document.querySelector(`.blog-read-more[data-post="${openPost.id}"]`);
          if (otherBtn) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherBtn.innerHTML = 'Read More <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>';
          }
        }
      });

      const isOpen = !post.hidden;

      if (isOpen) {
        post.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = 'Read More <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>';
      } else {
        post.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        btn.innerHTML = 'Collapse <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
        // Scroll to post with nav offset
        setTimeout(() => {
          const top = post.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 24;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 50);
      }
    });
  });

  document.querySelectorAll('.blog-post-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const postId = btn.getAttribute('data-post');
      const post   = document.getElementById(postId);
      if (!post) return;

      post.hidden = true;

      // Update corresponding "Read More" button
      const readMoreBtn = document.querySelector(`.blog-read-more[data-post="${postId}"]`);
      if (readMoreBtn) {
        readMoreBtn.setAttribute('aria-expanded', 'false');
        readMoreBtn.innerHTML = 'Read More <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>';
        // Scroll back up to the card
        const card = readMoreBtn.closest('.blog-card');
        if (card) {
          const top = card.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 24;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 13. EASTER EGG — Konami Code: ↑↑↓↓←→←→BA
  // ─────────────────────────────────────────────────────────────

  const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a',
  ];

  let konamiIndex = 0;

  const easterEgg  = document.getElementById('easter-egg');
  const eggClose   = document.getElementById('egg-close');
  const eggBackdrop = easterEgg ? easterEgg.querySelector('.egg-backdrop') : null;

  document.addEventListener('keydown', (e) => {
    if (e.key === KONAMI_CODE[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === KONAMI_CODE.length) {
        konamiIndex = 0;
        if (easterEgg) {
          easterEgg.hidden = false;
          easterEgg.removeAttribute('aria-hidden');
          if (eggClose) eggClose.focus();
        }
      }
    } else {
      konamiIndex = 0;
    }
  });

  function closeEasterEgg() {
    if (easterEgg) {
      easterEgg.hidden = true;
      easterEgg.setAttribute('aria-hidden', 'true');
    }
  }

  if (eggClose)   eggClose.addEventListener('click', closeEasterEgg);
  if (eggBackdrop) eggBackdrop.addEventListener('click', closeEasterEgg);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && easterEgg && !easterEgg.hidden) closeEasterEgg();
  });

})();
