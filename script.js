(() => {
  const MAX = 30;
  const grid = document.getElementById('grid');
  const pickBtn = document.getElementById('pickBtn');
  const resetBtn = document.getElementById('resetBtn');
  const markDoneBtn = document.getElementById('markDoneBtn');
  const autoDisable = document.getElementById('autoDisable');
  const resultBox = document.getElementById('resultBox');
  const historyEl = document.getElementById('history');

  let items = []; // {n, el, disabled}
  let history = [];

  function createGrid(){
    grid.innerHTML = '';
    items = [];
    for(let i=1;i<=MAX;i++){
      const col = document.createElement('div');
      col.className = 'col-4 col-sm-3 col-md-2';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-light w-100 py-3 fw-semibold';
      btn.textContent = i;
      btn.dataset.num = i;
      btn.addEventListener('click', () => toggleDisable(i));
      col.appendChild(btn);
      grid.appendChild(col);
      items.push({n:i, el:btn, disabled:false, col});
    }
  }

  function toggleDisable(n){
    const it = items[n-1];
    if(it.disabled){
      it.disabled = false;
      it.el.classList.remove('opacity-50','text-decoration-line-through');
      it.el.disabled = false;
    } else {
      it.disabled = true;
      it.el.classList.add('opacity-50','text-decoration-line-through');
      it.el.disabled = true;
    }
  }

  function getAvailable(){
    return items.filter(i => !i.disabled).map(i => i.n);
  }

  function pickRandom(){
    const avail = getAvailable();
    if(avail.length===0){
      showResult('사용 가능한 번호가 없습니다');
      return;
    }
    const idx = Math.floor(Math.random()*avail.length);
    const num = avail[idx];
    highlight(num);
    pushHistory(num);
    if(autoDisable.checked){
      setTimeout(()=>{ disableNumber(num); }, 400);
    }
  }

  function showResult(text){
    resultBox.textContent = text;
  }

  function highlight(n){
    clearSelected();
    const it = items[n-1];
    it.el.classList.add('btn-primary','text-white','shadow');
    it.el.classList.remove('btn-light');
    // add small pop animation
    it.el.classList.add('pop');
    setTimeout(()=> it.el.classList.remove('pop'), 450);
    showResult(n + '번');
  }

  function clearSelected(){
    items.forEach(i=>{
      i.el.classList.remove('btn-primary','text-white','shadow');
      if(!i.disabled) i.el.classList.add('btn-light');
    });
  }

  function disableNumber(n){
    const it = items[n-1];
    it.disabled = true;
    it.el.classList.add('opacity-50','text-decoration-line-through');
    it.el.disabled = true;
  }

  function markPickedAsDisabled(){
    const sel = items.find(i=>i.el.classList.contains('selected'));
    if(sel) disableNumber(sel.n);
  }

  function pushHistory(n){
    history.unshift({n, t: new Date().toLocaleTimeString()});
    if(history.length>20) history.pop();
    renderHistory();
  }

  function renderHistory(){
    historyEl.innerHTML = '';
    history.forEach(h=>{
      const li = document.createElement('li');
      li.textContent = `${h.n}번 — ${h.t}`;
      historyEl.appendChild(li);
    });
  }

  function resetAll(){
    items.forEach(i=>{
      i.disabled=false;
      i.el.disabled = false;
      i.el.classList.remove('opacity-50','text-decoration-line-through','btn-primary','text-white','shadow','pop');
      i.el.classList.add('btn-light');
    });
    history = [];
    renderHistory();
    showResult('—');
  }

  pickBtn.addEventListener('click', pickRandom);
  resetBtn.addEventListener('click', resetAll);
  markDoneBtn.addEventListener('click', markPickedAsDisabled);

  // init
  createGrid();
})();