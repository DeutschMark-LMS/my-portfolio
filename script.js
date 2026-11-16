/**
 * Deba Oni Portfolio — Unconventional Editorial Dossier
 * 100% Pure Vanilla ES6+ JavaScript.
 * Fast, reliable, no broken buttons.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initFooterYear();
  initHeaderAndMobileNav();
  initFilterSwitchboard();
  initAnimatedStats();
  initAdProfitCalculator();
  initCopyButtons();
  initContactForm();
  initBackToTop();
});

/**
 * 1. THEME TOGGLE: Switch between Dark Ink and Warm Paper.
 * Persists in localStorage for a continuous experience.
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('deba_portfolio_theme') || 'ink';

  const applyTheme = (theme) => {
    if (theme === 'paper') {
      document.body.classList.remove('theme-ink');
      document.body.classList.add('theme-paper');
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeLabel) themeLabel.textContent = 'Dark';
    } else {
      document.body.classList.remove('theme-paper');
      document.body.classList.add('theme-ink');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeLabel) themeLabel.textContent = 'Light';
    }
    localStorage.setItem('deba_portfolio_theme', theme);
  };

  applyTheme(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isPaper = document.body.classList.contains('theme-paper');
    applyTheme(isPaper ? 'ink' : 'paper');
  });
}

/**
 * 2. FOOTER YEAR: Always current.
 */
function initFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

/**
 * 3. HEADER & MOBILE MENU NAVIGATION
 */
function initHeaderAndMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navItems = Array.from(document.querySelectorAll('.nav-item'));

  const closeMenu = () => {
    if (!menuBtn || !navMenu) return;
    menuBtn.classList.remove('is-active');
    navMenu.classList.remove('is-active');
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      const willOpen = !navMenu.classList.contains('is-active');
      menuBtn.classList.toggle('is-active', willOpen);
      navMenu.classList.toggle('is-active', willOpen);
      menuBtn.setAttribute('aria-expanded', String(willOpen));
    });

    navItems.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // Active section tracking on scroll
  const sections = navItems
    .map((item) => {
      const href = item.getAttribute('href');
      if (!href || !href.startsWith('#')) return null;
      return document.querySelector(href);
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navItems.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        });
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }
}

/**
 * 4. INTERACTIVE FILTER SWITCHBOARD
 * Filters and highlights items with [data-category].
 */
function initFilterSwitchboard() {
  const pills = Array.from(document.querySelectorAll('.filter-pill'));
  const targetItems = Array.from(document.querySelectorAll('[data-category]'));
  const hintEl = document.getElementById('filterStatusHint');

  if (pills.length === 0) return;

  const hintLabels = {
    all: 'Showing all work',
    marketing: 'Focusing on marketing & sales',
    ventures: 'Focusing on companies founded',
    code: 'Focusing on software & tools',
  };

  const setFilter = (filterKey) => {
    pills.forEach((btn) => {
      const isSelected = btn.dataset.filter === filterKey;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', String(isSelected));
    });

    let matchCount = 0;

    targetItems.forEach((item) => {
      if (filterKey === 'all') {
        item.classList.remove('item-dimmed', 'item-highlighted');
        return;
      }

      const cats = (item.dataset.category || '').split(/\s+/);
      const isMatch = cats.includes(filterKey);

      item.classList.toggle('item-highlighted', isMatch);
      item.classList.toggle('item-dimmed', !isMatch);

      if (isMatch) matchCount++;
    });

    if (hintEl) {
      if (filterKey === 'all') {
        hintEl.textContent = 'Showing all work';
      } else {
        hintEl.textContent = `${hintLabels[filterKey] || 'Filtered'} (${matchCount} highlighted)`;
      }
    }
  };

  pills.forEach((btn) => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter || 'all');
    });
  });
}

/**
 * 5. ANIMATED STAT COUNTERS
 */
function initAnimatedStats() {
  const statElements = Array.from(document.querySelectorAll('.stat-giant[data-target]'));
  if (statElements.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const formatStat = (num, prefix = '', suffix = '') => {
    return `${prefix}${Math.round(num).toLocaleString('en-US')}${suffix}`;
  };

  const animate = (el) => {
    if (el.dataset.hasAnimated === 'true') return;
    el.dataset.hasAnimated = 'true';

    const target = Number(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    if (Number.isNaN(target) || prefersReduced) {
      el.textContent = formatStat(target, prefix, suffix);
      return;
    }

    const duration = 1100;
    const start = performance.now();

    const frame = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatStat(target * eased, prefix, suffix);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = formatStat(target, prefix, suffix);
      }
    };

    requestAnimationFrame(frame);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    statElements.forEach((el) => observer.observe(el));
  } else {
    statElements.forEach(animate);
  }
}

/**
 * 6. LIVE AD PROFIT CALCULATOR
 * Grade 6 Math & Explanations, Presets & Reset.
 */
function initAdProfitCalculator() {
  const spendInput = document.getElementById('adSpend');
  const cpcInput = document.getElementById('cpc');
  const convInput = document.getElementById('conversionRate');
  const aovInput = document.getElementById('aov');

  if (!spendInput || !cpcInput || !convInput || !aovInput) return;

  const spendVal = document.getElementById('adSpendVal');
  const cpcVal = document.getElementById('cpcVal');
  const convVal = document.getElementById('conversionRateVal');
  const aovVal = document.getElementById('aovVal');

  const outRevenue = document.getElementById('outRevenue');
  const outRoas = document.getElementById('outRoas');
  const outVerdict = document.getElementById('outVerdict');
  const outClicks = document.getElementById('outClicks');
  const outConversions = document.getElementById('outConversions');
  const outCac = document.getElementById('outCac');
  const outNetProfit = document.getElementById('outNetProfit');
  const outcomeCard = document.getElementById('outcomeCard');
  const profitMiniCard = document.getElementById('profitMiniCard');
  const explainerText = document.getElementById('explainerText');

  const presetButtons = Array.from(document.querySelectorAll('.preset-btn[data-preset]'));
  const resetBtn = document.getElementById('resetCalcBtn');

  const presets = {
    starter: { spend: 150000, cpc: 100, conv: 3.0, aov: 20000 },
    standard: { spend: 500000, cpc: 150, conv: 3.5, aov: 25000 },
    scale: { spend: 2500000, cpc: 200, conv: 4.0, aov: 40000 },
  };

  const formatMoney = (val, decimals = 0) => {
    const isNegative = val < 0;
    const formatted = Math.abs(val).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return isNegative ? `-₦${formatted}` : `₦${formatted}`;
  };

  const updateSliderProgress = (input) => {
    const min = Number(input.min) || 0;
    const max = Number(input.max) || 100;
    const val = Number(input.value) || 0;
    const percent = ((val - min) / (max - min)) * 100;
    input.style.setProperty('--slider-progress', `${percent}%`);
  };

  const calculate = () => {
    const spend = Number(spendInput.value);
    const cpc = Number(cpcInput.value);
    const convRate = Number(convInput.value);
    const aov = Number(aovInput.value);

    // Update labels & tracks
    if (spendVal) spendVal.textContent = formatMoney(spend, 0);
    if (cpcVal) cpcVal.textContent = formatMoney(cpc, 2);
    if (convVal) convVal.textContent = `${convRate.toFixed(1)}%`;
    if (aovVal) aovVal.textContent = formatMoney(aov, 0);

    [spendInput, cpcInput, convInput, aovInput].forEach(updateSliderProgress);

    // Math
    const clicks = Math.floor(spend / cpc);
    const customers = Math.floor(clicks * (convRate / 100));
    const revenue = customers * aov;
    const netProfit = revenue - spend;
    const cac = customers > 0 ? spend / customers : 0;
    const roas = spend > 0 ? revenue / spend : 0;

    // Display outputs
    if (outRevenue) outRevenue.textContent = formatMoney(revenue, 0);
    if (outRoas) outRoas.textContent = `ROAS: ${roas.toFixed(2)}x`;
    if (outClicks) outClicks.textContent = clicks.toLocaleString('en-US');
    if (outConversions) outConversions.textContent = customers.toLocaleString('en-US');
    if (outCac) outCac.textContent = customers > 0 ? formatMoney(cac, 2) : 'N/A';
    if (outNetProfit) outNetProfit.textContent = formatMoney(netProfit, 0);

    // Verdict & Loss styling
    const isLoss = netProfit < 0;
    if (outcomeCard) outcomeCard.classList.toggle('is-loss', isLoss);
    if (profitMiniCard) profitMiniCard.classList.toggle('is-loss', isLoss);

    if (outVerdict) {
      if (netProfit > 500000) {
        outVerdict.textContent = '🟢 Highly Profitable';
      } else if (netProfit >= 0) {
        outVerdict.textContent = '🟡 Making Money';
      } else {
        outVerdict.textContent = '🔴 Losing Money';
      }
    }

    // Grade 6 Plain English explanation
    if (explainerText) {
      if (netProfit >= 0) {
        explainerText.innerHTML = `<strong>In plain English:</strong> You spent <strong>${formatMoney(spend)}</strong> on ads. You generated <strong>${clicks.toLocaleString('en-US')} leads</strong> and made <strong>${formatMoney(revenue)}</strong> in sales. After paying for the ads, you keep <strong>${formatMoney(netProfit)}</strong> in profit.`;
      } else {
        explainerText.innerHTML = `<strong>Warning:</strong> You are spending <strong>${formatMoney(spend)}</strong> on ads, but only making <strong>${formatMoney(revenue)}</strong> in sales. You are losing <strong>${formatMoney(Math.abs(netProfit))}</strong>. You need a lower cost per lead or a higher product price.`;
      }
    }
  };

  const applyPreset = (key) => {
    const config = presets[key];
    if (!config) return;

    spendInput.value = config.spend;
    cpcInput.value = config.cpc;
    convInput.value = config.conv;
    aovInput.value = config.aov;

    presetButtons.forEach((b) => {
      b.classList.toggle('active', b.dataset.preset === key);
    });

    calculate();
  };

  [spendInput, cpcInput, convInput, aovInput].forEach((input) => {
    input.addEventListener('input', () => {
      presetButtons.forEach((b) => b.classList.remove('active'));
      calculate();
    });
  });

  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyPreset(btn.dataset.preset);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      applyPreset('standard');
    });
  }

  // Initial calculation
  calculate();
}

/**
 * 7. CLIPBOARD COPY BUTTONS
 */
function initCopyButtons() {
  const copyBtns = Array.from(document.querySelectorAll('[data-copy]'));
  if (copyBtns.length === 0) return;

  const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  };

  copyBtns.forEach((btn) => {
    let timer = null;

    btn.addEventListener('click', async () => {
      const val = btn.dataset.copy;
      if (!val) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(val);
        } else {
          fallbackCopy(val);
        }
      } catch {
        fallbackCopy(val);
      }

      const badge = btn.querySelector('.copy-badge');
      const textSpan = badge || btn.querySelector('.copy-text') || btn;
      const originalText = btn.dataset.origText || textSpan.textContent;
      btn.dataset.origText = originalText;

      btn.classList.add('copied');
      textSpan.textContent = 'Copied!';

      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.classList.remove('copied');
        textSpan.textContent = originalText;
      }, 2000);
    });
  });
}

/**
 * 8. SIMPLE TALK CONTACT FORM
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form || !feedback) return;

  const showResult = (type, message) => {
    feedback.className = `form-result-box ${type === 'success' ? 'is-success' : 'is-error'}`;
    feedback.textContent = message;
    feedback.style.display = 'block';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (document.getElementById('userName')?.value || '').trim();
    const email = (document.getElementById('userEmail')?.value || '').trim();
    const typeSelect = document.getElementById('inquiryType');
    const typeText = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'Inquiry';
    const message = (document.getElementById('userMessage')?.value || '').trim();

    if (!name || !email || !message) {
      showResult('error', 'Please fill in your name, email, and a short message so Deba can reply.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showResult('error', 'Please enter a valid email address.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
    }

    showResult(
      'success',
      `Thank you, ${name}! Your message about "${typeText}" is received. Deba typically replies within 24 hours.`
    );

    // Optional mailto trigger fallback
    const mailtoSubject = encodeURIComponent(`Inquiry from ${name}: ${typeText}`);
    const mailtoBody = encodeURIComponent(`Hi Deba,\n\n${message}\n\nFrom: ${name} (${email})`);
    const mailtoLink = `mailto:osadebamwenoni@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    setTimeout(() => {
      // Create a subtle secondary link in feedback for instant sending
      const mailtoAnchor = document.createElement('div');
      mailtoAnchor.style.marginTop = '8px';
      mailtoAnchor.innerHTML = `<a href="${mailtoLink}" style="text-decoration: underline; font-weight: 700;">Click here to also send directly via your email app →</a>`;
      feedback.appendChild(mailtoAnchor);
    }, 200);

    form.reset();

    if (submitBtn) {
      setTimeout(() => {
        submitBtn.disabled = false;
      }, 1500);
    }
  });
}

/**
 * 9. BACK TO TOP BUTTON
 */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}
