import { validateEnquiry, createBrief, whatsappUrl } from './enquiry.mjs';
const $ = selector => document.querySelector(selector);
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const header = $('.header');
const menuToggle = $('.menu-toggle');
const mobileNav = $('#mobile-nav');
function closeMenu(returnFocus = false) {
  const wasOpen = !mobileNav.hidden;
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  if (wasOpen && returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const open = mobileNav.hidden;
  mobileNav.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
document.addEventListener('click', event => { if (!mobileNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu(); });
document.addEventListener('focusin', event => { if (!mobileNav.contains(event.target) && !header.contains(event.target)) closeMenu(); });
matchMedia('(min-width: 961px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
// Fixed header dimensions prevent scroll-induced layout shifts.
const updateHeader = () => header.classList.toggle('scrolled', scrollY > 30);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
const sectionLinks = document.querySelectorAll('.desktop-nav a, #mobile-nav a[href^="#"]');
const navigationSections = [...document.querySelectorAll('main section[id]')];
function updateNavigation() {
  const marker = header.getBoundingClientRect().height + 140;
  const activeSection = navigationSections.find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top <= marker && rect.bottom > marker;
  });
  sectionLinks.forEach(link => {
    if (activeSection && link.hash === `#${activeSection.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
let navigationFrame;
window.addEventListener('scroll', () => {
  if (navigationFrame) return;
  navigationFrame = requestAnimationFrame(() => { updateNavigation(); navigationFrame = null; });
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();
// Avoid covering form controls or footer text with a duplicate contact button.
if ('IntersectionObserver' in window) {
  const contactRegions = new Set();
  const contactObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) contactRegions.add(entry.target);
      else contactRegions.delete(entry.target);
    });
    $('.floating-call').hidden = contactRegions.size > 0;
  });
  contactObserver.observe($('#contact'));
  contactObserver.observe($('footer'));
}
if ('IntersectionObserver' in window && !motion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(element => {
    if (element.getBoundingClientRect().bottom > 0) { element.classList.add('will-reveal'); observer.observe(element); }
  });
  motion.addEventListener('change', event => {
    if (event.matches) { observer.disconnect(); document.querySelectorAll('.will-reveal').forEach(element => element.classList.add('visible')); }
  });
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  document.querySelectorAll('[data-category]').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) { count++; card.classList.add('visible'); }
  });
  $('.project-grid').classList.toggle('filtered', button.dataset.filter !== 'all');
  $('#project-status').textContent = `Showing ${count} ${count === 1 ? 'project' : 'projects'}.`;
}));
const projects = [
  {
    "title": "Residential Building Exterior",
    "image": "assets/projects/work-1.webp",
    "service": "New construction",
    "description": "A multi-storey residential building photographed from street level."
  },
  {
    "title": "Street-facing Facade",
    "image": "assets/projects/work-2.webp",
    "service": "New construction",
    "description": "A street-level view of facade detailing and the building entrance."
  },
  {
    "title": "Multi-storey Development",
    "image": "assets/projects/work-3.webp",
    "service": "New construction",
    "description": "An exterior view showing the scale and facade of a multi-storey development."
  },
  {
    "title": "Concrete Structure in Progress",
    "image": "assets/projects/work-4.webp",
    "service": "New construction",
    "description": "Reinforced concrete construction with formwork and floor slabs taking shape on site."
  },
  {
    "title": "Foundation & Column Work",
    "image": "assets/projects/work-5.webp",
    "service": "New construction",
    "description": "An on-site view of foundation bases, column reinforcement, and early structural work."
  },
  {
    "title": "Staircase Construction",
    "image": "assets/projects/work-6.webp",
    "service": "New construction",
    "description": "A closer look at staircase formwork and structural construction on site."
  }
];
const dialog = $('#project-dialog');
let projectTrigger;
let selectedProject;
document.querySelectorAll('[data-project]').forEach(link => link.addEventListener('click', event => {
  if (typeof dialog.showModal !== 'function') return;
  event.preventDefault();
  selectedProject = projects[Number(link.dataset.project)];
  if (!selectedProject) return;
  projectTrigger = link;
  $('#dialog-title').textContent = selectedProject.title;
  $('#dialog-image').src = selectedProject.image;
  $('#dialog-image').alt = `${selectedProject.title} - Fazal & Sons Construction`;
  $('#dialog-description').textContent = selectedProject.description;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}));
$('.dialog-close').addEventListener('click', () => dialog.close());
$('#dialog-enquire').addEventListener('click', () => {
  $('#enquiry-details').open = true;
  $('#project-type').value = selectedProject.service;
  $('#project-message').value = `I'd like to discuss a project similar to ${selectedProject.title}.`;
  clearBrief();
  dialog.close();
  requestAnimationFrame(() => $('#project-name').focus({ preventScroll: true }));
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  projectTrigger?.focus({ preventScroll: true });
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
const form = $('#enquiry-form');
function clearBrief() {
  $('#enquiry-result').hidden = true;
  $('#copy-status').textContent = '';
  $('#send-whatsapp').removeAttribute('href');
}
form.addEventListener('input', event => {
  if (!event.target.matches('input,select,textarea:not([readonly])')) return;
  event.target.setCustomValidity('');
  event.target.removeAttribute('aria-invalid');
  clearBrief();
});
form.addEventListener('change', clearBrief);
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  $('#enquiry-details').open = true;
  $('#project-type').value = link.dataset.service;
  clearBrief();
}));
form.addEventListener('submit', event => {
  event.preventDefault();
  const { enquiry, errors } = validateEnquiry(Object.fromEntries(new FormData(form)));
  for (const [name, message] of Object.entries(errors)) {
    const field = form.elements.namedItem(name);
    field.setCustomValidity(message);
    field.setAttribute('aria-invalid', 'true');
  }
  if (Object.keys(errors).length) { form.reportValidity(); return; }
  const brief = createBrief(enquiry);
  $('#brief').value = brief;
  $('#send-whatsapp').href = whatsappUrl(brief);
  $('#enquiry-result').hidden = false;
  $('#copy-status').textContent = '';
  $('#result-title').focus({ preventScroll: true });
  $('#enquiry-result').scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'nearest' });
  trackEvent('generate_lead', { event_category: 'enquiry', event_label: enquiry.type });
});
$('#copy-brief').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#brief').value);
    $('#copy-status').textContent = 'Copied. You can now paste the brief into a message.';
    trackEvent('copy_brief', { event_category: 'enquiry' });
  } catch {
    $('#brief').focus(); $('#brief').select();
    $('#copy-status').textContent = 'Copy is unavailable in this browser. The brief is selected; use your device’s Copy command.';
  }
});
$('#year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-enhanced]').forEach(element => { element.hidden = false; });

// Google Ads & Analytics conversion tracking helper
function trackEvent(name, params = {}) {
  try {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...params });
  } catch {}
}

document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', () => {
    trackEvent('contact_phone_call', { event_category: 'engagement', event_label: link.getAttribute('href') });
  });
});

document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
  link.addEventListener('click', () => {
    trackEvent('contact_whatsapp_chat', { event_category: 'engagement', event_label: link.getAttribute('id') || 'whatsapp_cta' });
  });
});

// Smooth Minimalistic FAQ Accordion Animation
document.querySelectorAll('.faq-item').forEach(details => {
  const summary = details.querySelector('summary');
  const content = details.querySelector('.faq-answer');
  if (!summary || !content) return;

  let animation = null;
  let isClosing = false;
  let isExpanding = false;

  summary.addEventListener('click', event => {
    event.preventDefault();
    if (motion.matches) {
      details.open = !details.open;
      return;
    }
    details.style.overflow = 'hidden';
    if (isClosing || !details.open) {
      openItem();
    } else if (isExpanding || details.open) {
      shrinkItem();
    }
  });

  function shrinkItem() {
    isClosing = true;
    const startHeight = `${details.offsetHeight}px`;
    const endHeight = `${summary.offsetHeight}px`;

    if (animation) animation.cancel();
    animation = details.animate(
      { height: [startHeight, endHeight] },
      { duration: 280, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );

    animation.onfinish = () => {
      details.open = false;
      finishAnimation();
    };
    animation.oncancel = () => { isClosing = false; };
  }

  function openItem() {
    details.style.height = `${details.offsetHeight}px`;
    details.open = true;
    requestAnimationFrame(() => {
      isExpanding = true;
      const startHeight = `${details.offsetHeight}px`;
      const endHeight = `${summary.offsetHeight + content.offsetHeight}px`;

      if (animation) animation.cancel();
      animation = details.animate(
        { height: [startHeight, endHeight] },
        { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      );

      animation.onfinish = () => finishAnimation();
      animation.oncancel = () => { isExpanding = false; };
    });
  }

  function finishAnimation() {
    animation = null;
    isClosing = false;
    isExpanding = false;
    details.style.height = '';
    details.style.overflow = '';
  }
});

