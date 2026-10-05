// ===== الإعدادات (عدّل هنا فقط) =====
const WHATSAPP_NUMBER = '249999510745'; // بدون + أو مسافات
// ====================================

document.documentElement.classList.add('js');

const header = document.querySelector('.header');
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');

const setMenu = (open) => {
  menu.classList.toggle('show', open);
  toggle.setAttribute('aria-expanded', String(open));
};
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

document.getElementById('year').textContent = new Date().getFullYear();

// تمييز القسم الحالي في القائمة
const links = [...menu.querySelectorAll('a[href^="#"]:not(.btn)')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });

// ظهور تدريجي (يعمل فقط مع JavaScript، والمحتوى ظاهر بدونه)
const items = document.querySelectorAll('.service, .steps li, .solutions li, .form, .logo-full');
items.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: .1 });
items.forEach(el => io.observe(el));

// نموذج الطلب -> واتساب
const form = document.getElementById('contactForm');
const errorBox = document.getElementById('formError');
const phoneOk = v => v.replace(/\D/g, '').length >= 9;

form.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(form);
  const name = String(d.get('name')).trim();
  const phone = String(d.get('phone')).trim();
  const msg = String(d.get('message')).trim() || 'لا توجد تفاصيل إضافية';

  form.name.classList.toggle('invalid', !name);
  form.phone.classList.toggle('invalid', !phoneOk(phone));

  if (!name || !phoneOk(phone)) {
    errorBox.textContent = !name ? 'اكتب اسمك لنتمكن من مخاطبتك.' : 'اكتب رقم هاتف صحيحاً (9 أرقام على الأقل).';
    errorBox.hidden = false;
    (name ? form.phone : form.name).focus();
    return;
  }
  errorBox.hidden = true;

  const text = `مرحباً EyeSecure، أريد طلب عرض سعر.\nالاسم: ${name}\nالهاتف: ${phone}\nالخدمة: ${d.get('service')}\nالتفاصيل: ${msg}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});
