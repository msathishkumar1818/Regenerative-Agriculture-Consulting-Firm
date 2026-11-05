/**
 * REGENERATIVE AGRICULTURE CONSULTING FIRM
 * Main Global JavaScript Module
 * Handles: Preloader, Fixed Header, Dark Mode (#000000), RTL/LTR,
 * Dropdown (Click-Only), Mobile Drawer & Accordion, Active Nav, Scroll-to-Top.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State Handlers (Theme & Direction from LocalStorage)
  initTheme();
  initDirection();
  initPreloader();
  initHeader();
  initNavigation();
  initMobileDrawer();
  initScrollToTop();
  highlightActiveNav();
  initMapTabs();
});

/* -------------------------------------------------------------------------
   1. Theme Management (Dark Mode #000000 / Light Mode)
   ------------------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem('regen_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Bind all dark mode toggle buttons (Desktop & Mobile)
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Ensure theme icon correctly reflects active theme immediately on page initialization
  updateThemeIcons();
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('regen_theme', isDark ? 'dark' : 'light');
  updateThemeIcons();
}

function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');

  // Sun icon for dark mode (click to switch to light mode)
  const sunIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>`;

  // Moon icon for light mode (click to switch to dark mode)
  const moonIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>`;

  themeToggles.forEach(btn => {
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');

    const svg = btn.querySelector('svg');
    if (svg) {
      svg.outerHTML = isDark ? sunIcon : moonIcon;
    }

    const span = btn.querySelector('span');
    if (span) {
      span.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }
  });
}

/* -------------------------------------------------------------------------
   2. Direction Management (RTL / LTR)
   ------------------------------------------------------------------------- */
function initDirection() {
  const savedDir = localStorage.getItem('regen_dir') || 'ltr';
  document.documentElement.dir = savedDir;
  updateRtlLabels(savedDir);

  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggles.forEach(btn => {
    btn.addEventListener('click', toggleDirection);
  });
}

function updateRtlLabels(dir) {
  const rtlTexts = document.querySelectorAll('.rtl-toggle-btn .rtl-text');
  rtlTexts.forEach(el => {
    el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
  });

  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggles.forEach(btn => {
    btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left to Right' : 'Switch to Right to Left');
    btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
  });
}

function toggleDirection() {
  const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
  const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
  document.documentElement.setAttribute('dir', newDir);
  localStorage.setItem('regen_dir', newDir);
  updateRtlLabels(newDir);
}

/* -------------------------------------------------------------------------
   3. Branded Preloader
   ------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hidePreloader = () => {
    preloader.classList.add('loaded');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 600);
  };

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
    // Fallback safety timeout
    setTimeout(hidePreloader, 2200);
  }
}

/* -------------------------------------------------------------------------
   4. Header Scroll State
   ------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* -------------------------------------------------------------------------
   5. Desktop Navigation & Click-Only Dropdowns
   ------------------------------------------------------------------------- */
function initNavigation() {
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');

  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentItem = trigger.closest('.nav-item');
      if (!parentItem) return;

      const isOpen = parentItem.classList.contains('dropdown-open');
      
      // Close any other open dropdowns first
      document.querySelectorAll('.nav-item.dropdown-open').forEach(item => {
        if (item !== parentItem) item.classList.remove('dropdown-open');
      });

      if (!isOpen) {
        parentItem.classList.add('dropdown-open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        parentItem.classList.remove('dropdown-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-item.dropdown-open').forEach(item => {
        item.classList.remove('dropdown-open');
        const trigger = item.querySelector('.dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-item.dropdown-open').forEach(item => {
        item.classList.remove('dropdown-open');
      });
      closeMobileDrawer();
    }
  });
}

/* -------------------------------------------------------------------------
   6. Mobile Drawer & Click-Only Accordion
   ------------------------------------------------------------------------- */
function initMobileDrawer() {
  const openBtn = document.querySelector('.mobile-toggle-btn');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const overlay = document.querySelector('.mobile-overlay');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      openMobileDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeMobileDrawer();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      closeMobileDrawer();
    });
  }

  // Mobile Accordion (Click only - closed by default, opens only when user clicks)
  const accordionTriggers = document.querySelectorAll('.mobile-accordion-trigger, .drawer-accordion-btn');
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const item = trigger.closest('.mobile-item, .drawer-nav-item');
      if (!item) return;
      const isOpen = item.classList.contains('accordion-open');

      // Close all other accordions first
      document.querySelectorAll('.mobile-item.accordion-open, .drawer-nav-item.accordion-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('accordion-open');
          const otherBtn = openItem.querySelector('.mobile-accordion-trigger, .drawer-accordion-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle this item
      if (isOpen) {
        item.classList.remove('accordion-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('accordion-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Clicking ANY mobile navigation link must close the mobile menu immediately
  const navLinks = document.querySelectorAll('.mobile-drawer a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  // Auto-close mobile drawer when viewport expands to desktop size (> 1100px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) {
      closeMobileDrawer();
    }
  });

  // Close mobile drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileDrawer();
    }
  });
}

function openMobileDrawer() {
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-overlay');

  // Ensure dropdowns are automatically closed every time the drawer opens
  document.querySelectorAll('.mobile-item, .drawer-nav-item').forEach(item => {
    item.classList.remove('accordion-open');
  });
  document.querySelectorAll('.mobile-accordion-trigger, .drawer-accordion-btn').forEach(trigger => {
    trigger.setAttribute('aria-expanded', 'false');
  });

  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-overlay');

  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';

  // Reset dropdown state on drawer close
  document.querySelectorAll('.mobile-item, .drawer-nav-item').forEach(item => {
    item.classList.remove('accordion-open');
  });
  document.querySelectorAll('.mobile-accordion-trigger, .drawer-accordion-btn').forEach(trigger => {
    trigger.setAttribute('aria-expanded', 'false');
  });
}

/* -------------------------------------------------------------------------
   7. Active Navigation State Detection
   ------------------------------------------------------------------------- */
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  let filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  if (filename === '') filename = 'index.html';

  const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-link, .mobile-nav-link, .mobile-sub-link');
  
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const linkTarget = href.split('#')[0];
    if (linkTarget === filename) {
      link.classList.add('active');
      
      // If it's a sub-item, highlight the parent as well
      const parentNavItem = link.closest('.nav-item');
      if (parentNavItem) {
        const topLink = parentNavItem.querySelector('.nav-link');
        if (topLink) topLink.classList.add('active');
      }
      
      const parentMobileItem = link.closest('.mobile-item, .drawer-nav-item');
      if (parentMobileItem) {
        const mobileTopLink = parentMobileItem.querySelector('.mobile-nav-link, .drawer-accordion-btn');
        if (mobileTopLink) mobileTopLink.classList.add('active');
      }
    }
  });
}

/* -------------------------------------------------------------------------
   8. Scroll To Top Button
   ------------------------------------------------------------------------- */
function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-to-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 280) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* -------------------------------------------------------------------------
   9. Contact Page Interactive Facility Map Tabs
   ------------------------------------------------------------------------- */
function initMapTabs() {
  const mapCards = document.querySelectorAll('.map-location-card');
  const mapIframe = document.getElementById('contactMapIframe');

  if (!mapCards.length || !mapIframe) return;

  mapCards.forEach(card => {
    const activateCard = () => {
      mapCards.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });

      card.classList.add('active');
      card.setAttribute('aria-selected', 'true');

      const mapUrl = card.getAttribute('data-map-url');
      if (mapUrl && mapIframe.src !== mapUrl) {
        mapIframe.src = mapUrl;
      }
    };

    card.addEventListener('click', activateCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateCard();
      }
    });
  });
}
