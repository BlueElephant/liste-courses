'use strict';

// ── State ──────────────────────────────────────────────
const STORAGE_KEY = 'courses_v1';
let items = [];
let nextId = 1;
let activeFilter = 'Tout';

const CATS = ['Tout', 'Fruits & Légumes', 'Épicerie', 'Frais', 'Boulangerie', 'Boissons', 'Hygiène', 'Autre'];

// ── Persistence ────────────────────────────────────────
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, nextId }));
  } catch (e) { /* storage full */ }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      items = d.items || [];
      nextId = d.nextId || (items.length + 1);
    }
  } catch (e) {
    items = [];
  }
  // données de démo si liste vide
  if (items.length === 0) {
    items = [
      { id: nextId++, name: 'Pommes Golden', cat: 'Fruits & Légumes', done: false },
      { id: nextId++, name: 'Pâtes Barilla', cat: 'Épicerie', done: false },
      { id: nextId++, name: 'Yaourts nature', cat: 'Frais', done: true },
      { id: nextId++, name: 'Baguette tradition', cat: 'Boulangerie', done: false },
      { id: nextId++, name: 'Eau Evian x6', cat: 'Boissons', done: false },
    ];
    save();
  }
}

// ── DOM refs ───────────────────────────────────────────
const elListArea   = document.getElementById('list-area');
const elEmptyMsg   = document.getElementById('empty-msg');
const elHeaderSub  = document.getElementById('header-sub');
const elCats       = document.getElementById('cats');
const elInput      = document.getElementById('input-item');
const elInputCat   = document.getElementById('input-cat');
const elBtnAdd     = document.getElementById('btn-add');
const elBtnClear   = document.getElementById('btn-clear-done');
const elProgressW  = document.getElementById('progress-wrap');
const elProgressB  = document.getElementById('progress-bar');

// ── Render ─────────────────────────────────────────────
function render() {
  // header sub
  const total = items.length;
  const done  = items.filter(i => i.done).length;
  elHeaderSub.textContent = total === 0
    ? 'Liste vide'
    : `${done} / ${total} article${total > 1 ? 's' : ''} coché${done > 1 ? 's' : ''}`;

  // progress
  if (total > 0) {
    elProgressW.style.display = 'block';
    elProgressB.style.width = Math.round((done / total) * 100) + '%';
  } else {
    elProgressW.style.display = 'none';
  }

  // category pills
  elCats.innerHTML = CATS.map(c => `
    <button class="cat-pill ${activeFilter === c ? 'active' : ''}" data-cat="${c}">${c}</button>
  `).join('');

  // filter items
  const filtered = activeFilter === 'Tout'
    ? items
    : items.filter(i => i.cat === activeFilter);

  const todo = filtered.filter(i => !i.done);
  const doneList = filtered.filter(i => i.done);

  // clear list (keep empty-msg)
  elListArea.innerHTML = '';

  if (filtered.length === 0) {
    elEmptyMsg.style.display = 'block';
    elListArea.appendChild(elEmptyMsg);
    return;
  }
  elEmptyMsg.style.display = 'none';

  if (todo.length > 0) {
    const sec = makeSection('À acheter', todo);
    elListArea.appendChild(sec);
  }
  if (doneList.length > 0) {
    const sec = makeSection('Dans le caddie', doneList);
    elListArea.appendChild(sec);
  }
}

function makeSection(label, list) {
  const wrap = document.createElement('div');
  const lbl = document.createElement('p');
  lbl.className = 'section-label';
  lbl.textContent = label;
  wrap.appendChild(lbl);

  const group = document.createElement('div');
  group.className = 'section-group';
  list.forEach(item => group.appendChild(makeItem(item)));
  wrap.appendChild(group);
  return wrap;
}

function makeItem(item) {
  const el = document.createElement('div');
  el.className = 'item' + (item.done ? ' done' : '');
  el.dataset.id = item.id;

  el.innerHTML = `
    <div class="item-check">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
        stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="2,6 5,9 10,3"/>
      </svg>
    </div>
    <div class="item-body">
      <div class="item-name">${escHtml(item.name)}</div>
      <div class="item-cat">${escHtml(item.cat)}</div>
    </div>
    <button class="item-del" title="Supprimer" data-id="${item.id}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.8" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  el.addEventListener('click', (e) => {
    if (e.target.closest('.item-del')) return;
    toggle(item.id);
  });

  el.querySelector('.item-del').addEventListener('click', (e) => {
    e.stopPropagation();
    deleteItem(item.id);
  });

  return el;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Actions ────────────────────────────────────────────
function addItem() {
  const name = elInput.value.trim();
  if (!name) { elInput.focus(); return; }
  const cat = elInputCat.value;
  items.unshift({ id: nextId++, name, cat, done: false });
  elInput.value = '';
  elInput.focus();
  save();
  render();
}

function toggle(id) {
  const item = items.find(i => i.id === id);
  if (item) { item.done = !item.done; save(); render(); }
}

function deleteItem(id) {
  items = items.filter(i => i.id !== id);
  save(); render();
}

function clearDone() {
  const count = items.filter(i => i.done).length;
  if (count === 0) return;
  if (!confirm(`Supprimer ${count} article${count > 1 ? 's' : ''} coché${count > 1 ? 's' : ''} ?`)) return;
  items = items.filter(i => !i.done);
  save(); render();
}

// ── Events ─────────────────────────────────────────────
elBtnAdd.addEventListener('click', addItem);
elInput.addEventListener('keydown', e => { if (e.key === 'Enter') addItem(); });
elBtnClear.addEventListener('click', clearDone);

elCats.addEventListener('click', e => {
  const pill = e.target.closest('.cat-pill');
  if (pill) { activeFilter = pill.dataset.cat; render(); }
});

// ── Service Worker ─────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('SW enregistré'))
      .catch(err => console.warn('SW échec:', err));
  });
}

// ── Init ───────────────────────────────────────────────
load();
render();
