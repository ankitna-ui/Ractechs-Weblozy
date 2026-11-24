/**
 * main.js - Interactions & animations
 * Handles Nixtio-style preloader, page transitions, header scroll, mobile menu,
 * scroll reveal, stat count-up, and FAQ accordion.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Nixtio-Style Preloader Animation Sequence
  const preloader = document.getElementById('site-preloader');
  const preloaderLogo = preloader ? preloader.querySelector('.preloader-logo') : null;
  const preloaderLogoText = preloader ? preloader.querySelector('.preloader-logo-text') : null;
  const preloaderTagline = preloader ? preloader.querySelector('.preloader-tagline') : null;

  if (preloader) {
    if (prefersReducedMotion) {
      preloader.style.display = 'none';
      document.body.classList.add('page-loaded');
    } else {
      // Step A: Logo & tagline slide up into view from bottom
      setTimeout(() => {
        if (preloaderLogo) preloaderLogo.classList.add('visible');
        if (preloaderLogoText) preloaderLogoText.classList.add('visible');
        if (preloaderTagline) preloaderTagline.classList.add('visible');
      }, 120);

      // Step B: Black curtain slides UP off the screen, revealing website & triggering hero entrance
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.add('page-loaded');

        // Step C: Remove preloader from display after transition finishes
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 800);
      }, 850);
    }
  } else {
    document.body.classList.add('page-loaded');
  }

  // 2. Smooth Page Transitions for Internal Links
  const transitionOverlay = document.getElementById('site-page-transition');
  if (transitionOverlay && !prefersReducedMotion) {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      // Only internal HTML pages, not hash anchors, mailto, tel, or external
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !href.startsWith('http') &&
        !link.getAttribute('target')
      ) {
        link.addEventListener('click', (e) => {
          const currentUrl = window.location.pathname.split('/').pop() || 'index.html';
          if (href !== currentUrl) {
            e.preventDefault();
            transitionOverlay.classList.add('is-active');
            setTimeout(() => {
              window.location.href = href;
            }, 350);
          }
        });
      }
    });
  }

  // 3. Header scroll effect (after 40px)
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 4. Mobile Menu Toggle (Nixtio style)
  const hamburgerBtn = document.getElementById('nav-hamburger-btn');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');

  if (hamburgerBtn && mobileOverlay) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.toggle('open');
      mobileOverlay.classList.toggle('open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) {
        hamburgerBtn.classList.remove('open');
        mobileOverlay.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu on clicking any mobile link
    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        mobileOverlay.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // 5. Scroll Reveal (Fade up 24px, once)
  const revealElements = document.querySelectorAll('.reveal-element');
  if (revealElements.length > 0) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
    } else {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      revealElements.forEach((el) => observer.observe(el));
    }
  }

  // 6. Count-up Animation for Stat Numbers
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      statNumbers.forEach((el) => {
        el.textContent = el.getAttribute('data-target') || el.textContent;
      });
    } else {
      const statsObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const targetStr = el.getAttribute('data-target') || el.textContent.trim();
              const suffix = el.getAttribute('data-suffix') || '';
              const targetNum = parseInt(targetStr.replace(/[^0-9]/g, ''), 10);

              if (!isNaN(targetNum)) {
                const duration = 1500;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                  const elapsed = currentTime - startTime;
                  const progress = Math.min(elapsed / duration, 1);
                  const easeProgress = 1 - (1 - progress) * (1 - progress);
                  const currentVal = Math.floor(easeProgress * targetNum);

                  el.textContent = currentVal + suffix;

                  if (progress < 1) {
                    requestAnimationFrame(updateCount);
                  } else {
                    el.textContent = targetStr;
                  }
                };

                requestAnimationFrame(updateCount);
              }

              obs.unobserve(el);
            }
          });
        },
        { threshold: 0.25 }
      );

      statNumbers.forEach((el) => statsObserver.observe(el));
    }
  }

  // 7. FAQ Accordion (One open at a time, plus/minus toggle)
  const faqButtons = document.querySelectorAll('.faq-button');
  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parentItem = btn.closest('.faq-item');
      const answer = parentItem.querySelector('.faq-answer');
      const isCurrentlyOpen = parentItem.classList.contains('is-open');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach((item) => {
        item.classList.remove('is-open');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
        const btnElem = item.querySelector('.faq-button');
        if (btnElem) btnElem.setAttribute('aria-expanded', 'false');
      });

      // If it wasn't open, open it
      if (!isCurrentlyOpen) {
        parentItem.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });

  // 8. Cinematic Railway Hero Section Animations (GSAP + ScrollTrigger)
  function initCinematicHero() {
    const heroSection = document.querySelector('.hero-outer-container');
    if (!heroSection) return;

    // Check GSAP availability
    if (typeof gsap === 'undefined') {
      heroSection
        .querySelectorAll(
          '.hero-word, .hero-subtitle, .hero-cta-btn-primary, .hero-cta-btn-talk, .hero-stat-item, .hero-scroll-indicator'
        )
        .forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      const bgImg = heroSection.querySelector('.hero-bg-image');
      if (bgImg) bgImg.style.transform = 'none';
      return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const heroBgImage = heroSection.querySelector('.hero-bg-image');
    const heroMediaBlock = heroSection.querySelector('.hero-media-block');
    const heroContent = heroSection.querySelector('.hero-content');
    const heroWords = heroSection.querySelectorAll('.hero-word');
    const heroSubtitle = heroSection.querySelector('.hero-subtitle');
    const ctaButtons = heroSection.querySelectorAll(
      '.hero-cta-btn-primary, .hero-cta-btn-talk, .hero-cta-group a'
    );
    const scrollIndicator = heroSection.querySelector('.hero-scroll-indicator');
    const statItems = heroSection.querySelectorAll('.hero-stat-item');

    if (prefersReducedMotion) {
      if (heroBgImage) gsap.set(heroBgImage, { scale: 1, x: 0, y: 0, opacity: 1 });
      if (heroMediaBlock) gsap.set(heroMediaBlock, { opacity: 1 });
      if (heroWords.length) gsap.set(heroWords, { y: 0, opacity: 1 });
      if (heroSubtitle) gsap.set(heroSubtitle, { y: 0, opacity: 1 });
      if (ctaButtons.length) gsap.set(ctaButtons, { y: 0, opacity: 1 });
      if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0.8 });
      if (statItems.length) gsap.set(statItems, { y: 0, opacity: 1 });
      return;
    }

    // Set initial states
    if (heroBgImage) gsap.set(heroBgImage, { scale: 1.12 });
    if (heroWords.length) gsap.set(heroWords, { y: 50, opacity: 0 });
    if (heroSubtitle) gsap.set(heroSubtitle, { y: 30, opacity: 0 });
    if (ctaButtons.length) gsap.set(ctaButtons, { y: 20, opacity: 0 });
    if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0 });
    if (statItems.length) gsap.set(statItems, { y: 20, opacity: 0 });

    // Entrance timeline
    const runEntrance = () => {
      const entranceTl = gsap.timeline({
        delay: 0.15,
        defaults: { ease: 'power3.out' }
      });

      // 1. Background image zoom out from 1.12 to 1.0
      if (heroBgImage) {
        entranceTl.to(
          heroBgImage,
          {
            scale: 1.0,
            duration: 2.2,
            ease: 'power2.out'
          },
          0
        );
      }

      // 2. Heading word-by-word reveal (0.12s stagger, y: 50 -> 0, opacity: 0 -> 1)
      if (heroWords.length) {
        entranceTl.to(
          heroWords,
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out'
          },
          0.25
        );
      }

      // 3. Subtitle fade & translateY
      if (heroSubtitle) {
        entranceTl.to(
          heroSubtitle,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          },
          0.85
        );
      }

      // 4. CTA buttons fade in with stagger
      if (ctaButtons.length) {
        entranceTl.to(
          ctaButtons,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out'
          },
          1.05
        );
      }

      // 5. Scroll indicator reveal
      if (scrollIndicator) {
        entranceTl.to(
          scrollIndicator,
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          },
          1.2
        );
      }

      // 6. Bottom statistics sequential upward reveal
      if (statItems.length) {
        entranceTl.to(
          statItems,
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.12,
            ease: 'power2.out'
          },
          1.25
        );
      }
    };

    // Coordinate entrance with preloader
    if (document.body.classList.contains('page-loaded')) {
      runEntrance();
    } else {
      const checkLoaded = setInterval(() => {
        if (document.body.classList.contains('page-loaded')) {
          clearInterval(checkLoaded);
          runEntrance();
        }
      }, 50);
    }

    // Scroll-linked Scrub Animation via ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
          invalidateOnRefresh: true
        }
      });

      // Heading and hero content moves upward and fades
      if (heroContent) {
        scrollTl.to(
          heroContent,
          {
            y: -90,
            opacity: 0,
            ease: 'power1.out'
          },
          0
        );
      }

      // Background parallax (Y movement, slight X movement, scale to 1.15)
      if (heroBgImage) {
        scrollTl.to(
          heroBgImage,
          {
            y: '18%',
            x: '-2.5%',
            scale: 1.15,
            ease: 'none'
          },
          0
        );
      }

      // Scroll indicator fades away immediately upon scroll
      if (scrollIndicator) {
        scrollTl.to(
          scrollIndicator,
          {
            opacity: 0,
            y: -25,
            duration: 0.15,
            ease: 'power1.out'
          },
          0
        );
      }

      // Hero media block gradually fades into next section
      if (heroMediaBlock) {
        scrollTl.to(
          heroMediaBlock,
          {
            opacity: 0.15,
            ease: 'power1.inOut'
          },
          0.2
        );
      }
    }
  }

  initCinematicHero();
});
