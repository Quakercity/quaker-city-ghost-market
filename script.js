// script.js — populate cards, filtering, music toggle, spin animation
(() => {
  const items = [
    {id:1,title:'Pistol — Tier 1',desc:'Reliable sidearm',cat:'t1',price:'$200',rarity:'Common'},
    {id:2,title:'Knife — Tier 1',desc:'Concealable blade',cat:'t1',price:'$150',rarity:'Common'},
    {id:3,title:'SMG — Tier 2',desc:'Compact submachine gun',cat:'t2',price:'$1200',rarity:'Uncommon'},
    {id:4,title:'Assault Rifle — Tier 2',desc:'Standard AR',cat:'t2',price:'$2500',rarity:'Rare'},
    {id:5,title:'Suppressor',desc:'Reduces noise',cat:'atts',price:'$450',rarity:'Uncommon'},
    {id:6,title:'Extended Mag',desc:'Higher capacity magazine',cat:'atts',price:'$300',rarity:'Uncommon'},
    {id:7,title:'Cocaine (1g)',desc:'Street drug',cat:'drugs',price:'$120',rarity:'Common'},
    {id:8,title:'Heroin (1g)',desc:'Street drug',cat:'drugs',price:'$160',rarity:'Uncommon'},
    {id:9,title:'Weapon Drop Crate',desc:'Random weapon drop',cat:'drops',price:'Varies',rarity:'Rare'},
    {id:10,title:'Turf Map (Sector A)',desc:'Map of Sector A',cat:'turf',price:'$50',rarity:'Common'},
    {id:11,title:'Price List (Wholesale)',desc:'Bulk pricing overview',cat:'prices',price:'$10',rarity:'Common'}
  ];

  const slider = document.getElementById('items-slider');
  const categorySelect = document.getElementById('category');
  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const spinBtn = document.getElementById('spin-btn');
  const spinBtnRight = document.getElementById('spin-btn-right');
  const audioClick = document.getElementById('audio-click');
  const audioSpin = document.getElementById('audio-spin');
  const audioMusic = document.getElementById('audio-music');
  const musicToggle = document.getElementById('music-toggle');
  const acquiredList = document.getElementById('acquired-list');
  const clearBtn = document.getElementById('clear-acquired');
  const yearSpan = document.getElementById('year');

  yearSpan.textContent = new Date().getFullYear();

  function playClick(){ if(audioClick && audioClick.play) { audioClick.currentTime = 0; audioClick.play().catch(()=>{}); } }
  function playSpin(){ if(audioSpin && audioSpin.play){ audioSpin.currentTime = 0; audioSpin.play().catch(()=>{}); } }

  function createCard(item){
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.cat = item.cat;
    el.dataset.id = item.id;
    el.innerHTML = `<h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.desc)}</p><div class="meta"><div class="price">${escapeHtml(item.price)}</div><div class="rarity">${escapeHtml(item.rarity)}</div></div>`;
    return el;
  }

  function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }

  function renderItems(filter='all'){
    slider.innerHTML='';
    const toShow = items.filter(i => filter==='all' ? true : i.cat===filter);
    toShow.forEach(i => slider.appendChild(createCard(i)));
  }

  // initial render
  renderItems('t1');

  // nav clicks
  navItems.forEach(btn => {
    btn.addEventListener('click', e=>{
      const cat = btn.dataset.cat;
      playClick();
      navItems.forEach(n=>n.classList.remove('active'));
      btn.classList.add('active');
      if(cat==='music'){
        // toggle music
        toggleMusic();
        return;
      }
      categorySelect.value = cat==='all' ? 'all' : cat;
      renderItems(cat==='all' ? 'all' : cat);
    });
  });

  categorySelect.addEventListener('change', e=>{
    playClick();
    renderItems(e.target.value);
    navItems.forEach(n=>n.classList.remove('active'));
  });

  function toggleMusic(){
    if(!audioMusic) return;
    if(audioMusic.paused){
      audioMusic.play().catch(()=>{});
      musicToggle.classList.add('active');
      musicToggle.style.color = 'var(--accent)';
    } else {
      audioMusic.pause();
      musicToggle.classList.remove('active');
      musicToggle.style.color = '';
    }
    playClick();
  }

  musicToggle.addEventListener('click', e=>{ e.preventDefault(); toggleMusic(); });

  // Spin logic: pick a random visible card
  function pickRandomVisibleCard(){
    const cards = Array.from(slider.querySelectorAll('.card'));
    if(!cards.length) return null;
    return cards[Math.floor(Math.random()*cards.length)];
  }

  function addAcquired(item){
    const list = JSON.parse(localStorage.getItem('acquired')||'[]');
    list.unshift({id:item.id,title:item.title,ts:Date.now()});
    localStorage.setItem('acquired', JSON.stringify(list.slice(0,25)));
    renderAcquired();
  }

  function renderAcquired(){
    const list = JSON.parse(localStorage.getItem('acquired')||'[]');
    acquiredList.innerHTML='';
    list.forEach(entry=>{
      const el = document.createElement('div');
      el.className='acquired-item';
      const d = new Date(entry.ts);
      el.innerHTML = `<div>${escapeHtml(entry.title)}</div><div style="color:var(--muted);font-size:12px">${d.toLocaleString()}</div>`;
      acquiredList.appendChild(el);
    });
  }

  clearBtn.addEventListener('click', e=>{
    playClick();
    localStorage.removeItem('acquired');
    renderAcquired();
  });

  function animateSpin(targetCard){
    if(!targetCard) return;
    document.body.classList.add('spin-active');
    // temporarily mark
    targetCard.classList.add('spin-target');
    playSpin();
    // simple timing to simulate wheel
    setTimeout(()=>{
      targetCard.classList.remove('spin-target');
      document.body.classList.remove('spin-active');
      const id = Number(targetCard.dataset.id);
      const item = items.find(i=>i.id===id);
      if(item) addAcquired(item);
    }, 1400);
  }

  function doSpin(){
    playClick();
    const target = pickRandomVisibleCard();
    if(!target) return;
    // quick button animation
    spinBtn.classList.add('glow');
    spinBtnRight.classList.add('glow');
    animateSpin(target);
    setTimeout(()=>{ spinBtn.classList.remove('glow'); spinBtnRight.classList.remove('glow'); }, 1600);
  }

  spinBtn.addEventListener('click', e=>{ playClick(); doSpin(); });
  spinBtnRight.addEventListener('click', e=>{ playClick(); doSpin(); });

  // initial acquired render
  renderAcquired();

  // keyboard accessibility: spacebar to spin when focused on spin button
  [spinBtn, spinBtnRight].forEach(b=>{
    b.addEventListener('keydown', e=>{ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); doSpin(); } });
  });

})();
