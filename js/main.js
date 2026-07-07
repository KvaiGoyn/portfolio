// ── Плейсхолдеры экранов ──
// Каждый .shot содержит <img data-src="..."> и плейсхолдер.
// Кладёшь файл по пути из data-src — картинка подхватывается, плейсхолдер прячется.
document.querySelectorAll('.shot').forEach((shot) => {
  const img = shot.querySelector('img[data-src]');
  if (!img) return;
  const src = img.getAttribute('data-src');
  const probe = new Image();
  probe.onload = () => {
    img.src = src;
    shot.classList.add('has-img');
  };
  probe.src = src;
});

// ── Появление при скролле ──
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ── Запуск отрисовки чертежа-схемы ──
const sch = document.querySelector('.schematic');
if (sch) requestAnimationFrame(() => sch.classList.add('play'));

// ── Активный пункт меню ──
const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.topnav a').forEach((a) => {
  if (a.getAttribute('href') === path) a.classList.add('active');
});
