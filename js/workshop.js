const workshop=document.querySelector('[data-workshop]');
if(workshop){
workshop.innerHTML=`<div class="section-heading"><div><h2>Попробуйте мою работу</h2><p>Соберите матч. Выберите устройство. Создайте бронь.</p></div></div><div class="workshop-tabs" role="group" aria-label="Выбрать проект"><button aria-pressed="true" data-scene="device">🎮 Device Service</button><button aria-pressed="false" data-scene="match">⌘ CyberRES</button><button aria-pressed="false" data-scene="booking">↗ Booking Notifier</button></div><div data-panel="device"><div class="scene-caption"><p>Каталог с дизайном из настоящего Device Service</p><a href="projects.html#device-service">Проект в списке</a></div><iframe class="device-demo-frame" src="demos/device/index.html" title="Device Service: выбор устройств" loading="lazy" scrolling="no" sandbox="allow-scripts allow-same-origin"></iframe></div><div data-panel="match" hidden><div class="scene-caption"><p>От команды до запуска матча</p><a href="projects.html#cyberres">Проект в списке</a></div><div class="match-scene"><div class="team"><strong>Команда A</strong><div class="players">● ● ● ● ●</div><span>5 игроков</span></div><div class="match-center"><span id="match-map">BO1 · 5 × 5</span><strong id="match-score">VS</strong><span id="match-status" role="status">Все игроки готовы</span></div><div class="team"><strong>Команда B</strong><div class="players">● ● ● ● ●</div><span>5 игроков</span></div></div><section class="veto" aria-labelledby="veto-title"><div class="veto-heading"><div><h3 id="veto-title">Вето карт</h3><p>Исключайте карты по очереди. Последняя остаётся для матча.</p></div><span id="veto-progress">0 / 6</span></div><p id="veto-turn" role="status"></p><div class="veto-maps"></div><ol class="veto-history" aria-label="История исключений"></ol><div class="veto-actions"><button class="scene-action" id="veto-undo" disabled>Отменить последний бан</button><button class="scene-action" id="veto-reset">Начать заново</button><button class="scene-action" id="match-start" disabled>Сначала завершите вето</button></div></section></div><div data-panel="booking" hidden><div class="scene-caption"><p>Бронирование превращается в сообщение команде</p><a href="projects.html#booking-notifier">Проект в списке</a></div><div class="booking-scene"><div class="booking-ticket"><span>Res Space</span><strong>ПК 07</strong><span>18:00 — 20:00</span><div class="seat-map" aria-hidden="true">▣ ▣ ▣ ▣<br>▣ ▣ <b>▣</b> ▣</div><button class="scene-action" id="booking-action">Создать бронь</button></div><div class="event-arrow" aria-hidden="true">→</div><div class="message-preview"><span>Telegram · команда клуба</span><div id="booking-message" role="status"><strong>Ожидаем событие</strong><p>Создайте бронь на соседнем экране.</p></div></div></div></div>`;
const deviceFrame=workshop.querySelector('.device-demo-frame');
function fitDeviceFrame(){
 const frameDocument=deviceFrame.contentDocument;
 const height=Math.max(frameDocument?.body?.scrollHeight||0,frameDocument?.documentElement?.scrollHeight||0);
 if(height)deviceFrame.style.height=`${height+2}px`;
}
deviceFrame.addEventListener('load',()=>{
 fitDeviceFrame();
 const content=deviceFrame.contentDocument?.body;
 if(content&&window.ResizeObserver)new ResizeObserver(fitDeviceFrame).observe(content);
});
window.addEventListener('resize',fitDeviceFrame);
workshop.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{
 workshop.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 workshop.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==button.dataset.scene);
}));
const mapPool=['Mirage','Inferno','Nuke','Ancient','Anubis','Dust II','Vertigo'];
const bans=[];
let match=false;
const matchStart=document.querySelector('#match-start');
const undo=document.querySelector('#veto-undo');
const maps=workshop.querySelector('.veto-maps');
maps.innerHTML=mapPool.map((name,i)=>`<button class="veto-map map-${i}" data-map="${i}" aria-label="Исключить ${name}"><span class="map-art" aria-hidden="true"><i></i><i></i><i></i></span><strong>${name}</strong><span class="map-state">Исключить</span></button>`).join('');
function renderVeto(){
 const remaining=mapPool.filter((_,i)=>!bans.includes(i));
 const ready=remaining.length===1;
 const team=bans.length%2===0?'A':'B';
 maps.querySelectorAll('[data-map]').forEach(button=>{
  const index=Number(button.dataset.map), banIndex=bans.indexOf(index);
  const banned=banIndex!==-1;
  button.disabled=banned||ready||match;
  button.classList.toggle('is-banned',banned);
  button.classList.toggle('is-picked',ready&&!banned);
  button.querySelector('.map-state').textContent=banned?`Бан · команда ${banIndex%2===0?'A':'B'}`:ready?'Карта матча':'Исключить';
 });
 document.querySelector('#veto-progress').textContent=`${bans.length} / 6`;
 document.querySelector('#veto-turn').textContent=match?`Вето завершено. Матч на ${remaining[0]}`:ready?`Выбрана ${remaining[0]}. Можно запускать матч.`:`Ход команды ${team} — исключите карту`;
 document.querySelector('#match-map').textContent=ready?`${remaining[0]} · BO1`:'BO1 · 5 × 5';
 document.querySelector('#match-score').textContent=match?'0 : 0':'VS';
 document.querySelector('#match-status').textContent=match?'Матч запущен':ready?'Команды готовы к старту':'Команды выбирают карту';
 workshop.querySelector('.match-scene').classList.toggle('is-live',match);
 workshop.querySelectorAll('.team').forEach((el,i)=>el.classList.toggle('is-turn',!ready&&i===bans.length%2));
 workshop.querySelector('.veto-history').innerHTML=bans.map((index,i)=>`<li><span>${i%2===0?'A':'B'}</span> <s>${mapPool[index]}</s></li>`).join('');
 undo.disabled=bans.length===0||match;
 matchStart.disabled=!ready||match;
 matchStart.textContent=match?'Матч запущен':ready?`Запустить на ${remaining[0]}`:'Сначала завершите вето';
}
maps.addEventListener('click',e=>{
 const button=e.target.closest('[data-map]');
 if(!button||button.disabled||match||bans.length>=6)return;
 bans.push(Number(button.dataset.map));renderVeto();
 if(bans.length===6)matchStart.focus();
 else maps.querySelector('button:not(:disabled)')?.focus();
});
undo.addEventListener('click',()=>{if(!match&&bans.length){const restored=bans.pop();renderVeto();maps.querySelector(`[data-map="${restored}"]`).focus();}});
document.querySelector('#veto-reset').addEventListener('click',()=>{match=false;bans.length=0;renderVeto();maps.querySelector('button').focus();});
matchStart.addEventListener('click',()=>{if(bans.length!==6||match)return;match=true;renderVeto();document.querySelector('#veto-reset').focus();});
renderVeto();
let booking=0;
document.querySelector('#booking-action').addEventListener('click',e=>{booking=(booking+1)%3;document.querySelector('#booking-message').innerHTML=[`<strong>Ожидаем событие</strong><p>Создайте бронь на соседнем экране.</p>`,`<strong>✓ Новая бронь</strong><p>ПК 07 · 18:00 — 20:00</p><small>Гость · место зарезервировано</small>`,`<strong>↶ Бронь отменена</strong><p>ПК 07 снова доступен</p><small>Команда видит изменение статуса</small>`][booking];e.target.textContent=['Создать бронь','Отменить бронь','Начать заново'][booking];workshop.querySelector('.booking-ticket').classList.toggle('is-booked',booking===1);});
}
