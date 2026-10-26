const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function closeMenu() { mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); }
menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') !== 'true'; mobileNav.hidden = !open; menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (innerWidth > 960) closeMenu(); });
function updateHeader() { header.classList.toggle('scrolled', window.scrollY > 30); }
window.addEventListener('scroll', updateHeader, { passive: true }); updateHeader();
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveals.unobserve(entry.target); } }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => { el.classList.add('will-reveal'); reveals.observe(el); });
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
  button.classList.add('active'); button.setAttribute('aria-pressed', 'true');
  document.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
  document.querySelector('.project-grid').classList.toggle('filtered', button.dataset.filter !== 'all');
}));
const projects = [
  { title: 'The Courtyard Residence', image: 'assets/residence.jpg', description: 'An exploration of open living, natural light, and contemporary exterior materials. A starting point for a conversation about your own residential project.' },
  { title: 'A Space to Call Home', image: 'assets/interior.jpg', description: 'Warm neutral tones, natural textures, and room to live well. This sample shows one possible visual direction for a thoughtfully considered interior.' },
  { title: 'Room for Better Work', image: 'assets/commercial.jpg', description: 'Light-filled spaces with flexibility at their heart. A commercial inspiration for businesses thinking about their next space.' }
];
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[Number(button.dataset.project)];
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-image').src = project.image;
  document.querySelector('#dialog-image').alt = `Sample inspiration: ${project.title}`;
  document.querySelector('#dialog-description').textContent = project.description;
  dialog.showModal(); document.body.classList.add('dialog-open');
}));
function closeDialog() { dialog.close(); }
document.querySelector('.dialog-close').addEventListener('click', closeDialog);
document.querySelector('#dialog-enquire').addEventListener('click', closeDialog);
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(); } });
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { document.querySelector('select[name="type"]').value = link.dataset.service; }));
document.querySelector('#enquiry-form').addEventListener('submit', e => {
  e.preventDefault(); const data = new FormData(e.currentTarget);
  document.querySelector('#brief').value = `Hello Fazal & Sons,\nI'm ${data.get('name').trim()}.\nProject: ${data.get('type')}\nLocation: ${data.get('location').trim()}${data.get('message').trim() ? `\nDetails: ${data.get('message').trim()}` : ''}\nI'd like to discuss the next steps.`;
  document.querySelector('#enquiry-result').hidden = false;
  document.querySelector('#enquiry-result').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
});
document.querySelector('#copy-brief').addEventListener('click', async () => {
  const brief = document.querySelector('#brief');
  try { await navigator.clipboard.writeText(brief.value); document.querySelector('#copy-status').textContent = 'Copied. Your brief is ready to share.'; }
  catch { brief.focus(); brief.select(); document.querySelector('#copy-status').textContent = 'Select and copy the brief above to share it.'; }
});
document.querySelector('#year').textContent = new Date().getFullYear();
