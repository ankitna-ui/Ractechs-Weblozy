/**
 * layout.js - Injects shared Header, Footer, and Preloader Overlay
 * Works seamlessly from file:// protocol without fetch.
 */

(function () {
  const currentPath = window.location.pathname;
  const isHomePage =
    currentPath.endsWith('index.html') ||
    currentPath === '/' ||
    currentPath.endsWith('/') ||
    currentPath.split('/').pop() === '';

  // 1. Inject Preloader Overlay (if not already present in HTML)
  if (!document.getElementById('site-preloader')) {
    const preloader = document.createElement('div');
    preloader.id = 'site-preloader';
    preloader.className = 'preloader-overlay';
    preloader.setAttribute('aria-hidden', 'true');
    preloader.innerHTML = `
      <div class="preloader-content">
        <div class="preloader-logo-wrapper">
          <img src="assets/logo/logo.png" alt="RACTECHS" class="preloader-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <span class="preloader-logo-text" style="display:none;">RACTECHS</span>
        </div>
        <div class="preloader-tagline">INNOVATION CREATES TECHNOLOGY</div>
      </div>
    `;
    document.body.prepend(preloader);
  }

  // 2. Inject Page Transition Overlay (for smooth upward curtain transition)
  if (!document.getElementById('site-page-transition')) {
    const transitionOverlay = document.createElement('div');
    transitionOverlay.id = 'site-page-transition';
    transitionOverlay.className = 'page-transition-overlay';
    transitionOverlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(transitionOverlay);
  }

  // 3. Inject Header
  const headerContainer = document.getElementById('site-header');
  if (headerContainer) {
    if (!isHomePage) {
      headerContainer.classList.add('inner-page-header');
    }

    const navLinks = [
      { name: 'Products', href: 'products.html' },
      { name: 'About', href: 'about.html' },
      { name: 'Facilities', href: 'facilities.html' },
      { name: 'Clients', href: 'clients.html' },
      { name: 'Contact', href: 'contact.html' }
    ];

    const currentFile = currentPath.split('/').pop() || 'index.html';

    const navItemsHtml = navLinks
      .map((link) => {
        const isActive = currentFile === link.href ? 'active' : '';
        return `<a href="${link.href}" class="header-nav-link ${isActive}">${link.name}</a>`;
      })
      .join('');

    const mobileNavItemsHtml = navLinks
      .map((link) => {
        const isActive = currentFile === link.href ? 'active' : '';
        return `<a href="${link.href}" class="mobile-nav-link ${isActive}">${link.name}</a>`;
      })
      .join('');

    headerContainer.innerHTML = `
      <div class="header-content">
        <a href="index.html" class="header-logo" aria-label="RACTECHS Home">
          <img src="assets/logo/logo.png" alt="RACTECHS" class="header-logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
          <span class="header-logo-text" style="display:none;">RACTECHS</span>
        </a>
        <nav class="header-nav-pill" aria-label="Main Navigation">
          ${navItemsHtml}
        </nav>
        <div class="header-actions">
          <a href="contact.html" class="button-flip header-cta-btn" aria-label="Get a Quote">
            <span class="btn-flip-wrapper">
              <span class="btn-flip-text">Get a Quote</span>
              <span class="btn-flip-text btn-flip-duplicate">Get a Quote</span>
            </span>
          </a>
          <button type="button" class="header-menu-button" id="nav-hamburger-btn" aria-label="Toggle menu" aria-expanded="false">
            <span class="burger-line"></span>
            <span class="burger-line"></span>
            <span class="burger-line"></span>
          </button>
        </div>
      </div>
      <div class="mobile-menu-overlay" id="mobile-nav-overlay">
        <nav class="mobile-nav-card" aria-label="Mobile Navigation">
          ${mobileNavItemsHtml}
          <a href="contact.html" class="button-flip header-cta-btn" style="margin-top: 8px;">
            <span class="btn-flip-wrapper">
              <span class="btn-flip-text">Get a Quote</span>
              <span class="btn-flip-text btn-flip-duplicate">Get a Quote</span>
            </span>
          </a>
        </nav>
      </div>
    `;
  }

  // 4. Inject Footer
  const footerContainer = document.getElementById('site-footer');
  if (footerContainer) {
    const contactBlockHtml = isHomePage
      ? `
      <div class="footer-contact-wrapper container">
        <div class="footer-contact-info">
          <span class="section-label text-light">Section 10 • Let's talk</span>
          <h2 class="footer-contact-title">Let's talk</h2>
          <p class="body-text text-light" style="margin-bottom: 24px;">Have a requirement in mind? Let's make it real.</p>
          <div class="contact-points">
            <div class="contact-point-item">
              <span class="contact-point-dot"></span>
              <span>Quick response</span>
            </div>
            <div class="contact-point-item">
              <span class="contact-point-dot"></span>
              <span>Clear next steps</span>
            </div>
          </div>
        </div>
        <div class="footer-contact-form-wrap">
          <form class="contact-form" onsubmit="event.preventDefault();">
            <div>
              <input type="text" class="input" placeholder="Full Name*" required>
            </div>
            <div>
              <input type="email" class="input" placeholder="Email*" required>
            </div>
            <div>
              <input type="tel" class="input" placeholder="Phone*" required>
            </div>
            <div>
              <textarea class="input" placeholder="Message*" required></textarea>
            </div>
            <button type="submit" class="button-secondary" style="align-self: flex-start;">Send Message</button>
            <p class="contact-legal-note">By submitting this form, you acknowledge our Privacy Policy and Cookie Policy.</p>
          </form>
        </div>
      </div>
      `
      : '';

    footerContainer.innerHTML = `
      <footer class="site-footer-block" id="contact">
        ${contactBlockHtml}
        <div class="container">
          <div class="footer-bottom-grid">
            <div class="footer-col-brand">
              <div class="footer-brand-title">RACTECHS</div>
              <div class="footer-tagline">“ Innovation Creates Technology ”</div>
              <p class="text-14" style="color: rgba(255, 255, 255, 0.6); max-width: 320px;">
                Rail Autocom Technologies (P) Ltd. — Woman-owned startup MSME manufacturing premium coach furnishing, electrical, signalling & trackside railway products.
              </p>
            </div>
            <div class="footer-col-links">
              <div style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #fff; margin-bottom: 16px;">Navigation</div>
              <div class="footer-links-list">
                <a href="products.html" class="footer-link">Products</a>
                <a href="about.html" class="footer-link">About</a>
                <a href="facilities.html" class="footer-link">Facilities</a>
                <a href="clients.html" class="footer-link">Clients</a>
                <a href="contact.html" class="footer-link">Contact</a>
              </div>
            </div>
            <div class="footer-col-contact">
              <div style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #fff; margin-bottom: 16px;">Contact & Locations</div>
              <div class="footer-contact-details">
                <div><strong>Phone:</strong> <a href="tel:9289862001">9289862001</a> / <a href="tel:9910271475">9910271475</a></div>
                <div><strong>Email:</strong> <a href="mailto:smb@ractechs.com">smb@ractechs.com</a></div>
                <div><strong>Web:</strong> <a href="https://www.ractechs.com" target="_blank" rel="noopener">www.ractechs.com</a></div>
                <div style="margin-top: 6px;"><strong>Office:</strong> A-112, Sector-83, Phase II, Gautam Buddha Nagar, Noida-201305</div>
                <div><strong>Works:</strong> H-127, Site-5, Kasna Industrial Area, Greater Noida-201306</div>
              </div>
            </div>
          </div>
          <div class="footer-copyright">
            © 2026 Rail Autocom Technologies (P) Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    `;
  }
})();
