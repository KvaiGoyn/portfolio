const devices = [
  {id:'headset', name:'HyperX Cloud III S WL', icon:'🎧', image:'../../assets/device-service/hyperx-cloud-iii-s-wl.png', specs:['Беспроводная','53 мм','DTS:X']},
  {id:'controller', name:'DualSense', icon:'🎮', image:'../../assets/device-service/dualsense.png', specs:['PS5','Тактильная отдача','Адаптивные триггеры']}
];
const quantities = {headset:0,controller:0};
let filter='all';
const $=s=>document.querySelector(s);
function render(){
 $('#catalog').innerHTML=devices.filter(d=>filter==='all'||d.id===filter).map(d=>`<article class="card ${quantities[d.id]?'selected':''}"><button class="card-img" data-details="${d.id}" aria-label="Подробнее: ${d.name}"><img src="${d.image}" alt="${d.name}" loading="lazy"></button><div class="card-body"><h2 class="card-name">${d.name}</h2><div class="card-specs">${d.specs.map(s=>`<span class="spec">${s}</span>`).join('')}</div><div class="card-bottom"><span class="avail">в наличии · 2</span><div class="qty"><button class="qty-btn" data-id="${d.id}" data-delta="-1" aria-label="Убрать ${d.name}" ${quantities[d.id]===0?'disabled':''}>−</button><span class="qty-val">${quantities[d.id]}</span><button class="qty-btn" data-id="${d.id}" data-delta="1" aria-label="Добавить ${d.name}" ${quantities[d.id]===2?'disabled':''}>+</button></div></div></div></article>`).join('');
 $('#basket-summary').textContent=devices.filter(d=>quantities[d.id]).map(d=>`${d.name} × ${quantities[d.id]}`).join(' · ')||'Устройства пока не выбраны';
 $('#checkout').disabled=!Object.values(quantities).some(Boolean);
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.filter){filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}
 if(b.dataset.delta){const id=b.dataset.id;quantities[id]=Math.max(0,Math.min(2,quantities[id]+Number(b.dataset.delta)));render();document.querySelector(`[data-id="${id}"][data-delta="${b.dataset.delta}"]:not(:disabled)`)?.focus();}
 if(b.dataset.details){const d=devices.find(d=>d.id===b.dataset.details);$('#detail-name').textContent=d.name;$('#detail-image').src=d.image;$('#detail-image').alt=d.name;$('#detail-specs').textContent=d.specs.join(' · ');$('#details').showModal();}
});
$('#checkout').addEventListener('click',()=>{
 if(!Object.values(quantities).some(Boolean))return;
 $('.basket').hidden=true;
 $('#catalog').hidden=true;
 $('.filters').hidden=true;
 $('#order').hidden=false;
 $('#order-title').textContent='Заказ создан';
});
render();
