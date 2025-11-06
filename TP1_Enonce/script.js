
const sections = document.querySelectorAll('.content-box');
function showSection(id){
  sections.forEach(s => s.classList.toggle('active', s.id === id));
}
document.querySelectorAll('[data-target]').forEach(el=>{
  el.addEventListener('click', ()=> showSection(el.dataset.target));
});
document.querySelectorAll('.menu .item > td > a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const tr = a.closest('.item');
    const id = tr?.getAttribute('data-target');
    if(id){ e.preventDefault(); showSection(id); }
  });
});
showSection('accueil');


function readActivityNames(){
  return Array.from(document.querySelectorAll('#activities tbody tr'))
    .map(tr => tr.querySelectorAll('td')[1]?.textContent?.trim())
    .filter(Boolean);
}
function fillActivitiesSelect(){
  const select = document.getElementById('select-activite');
  if(!select) return;
  
  Array.from(select.querySelectorAll('option')).forEach(opt=>{
    if(opt.value !== '') opt.remove();
  });
  readActivityNames().forEach(name=>{
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}
fillActivitiesSelect();


const STORAGE_KEY = 'tp1_counts';

function loadCounts(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveCounts(obj){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}
function bootstrapCounts(){
  const stored = loadCounts();
  if(Object.keys(stored).length) return stored;
  
  const counts = {};
  document.querySelectorAll('#activities tbody tr').forEach(tr=>{
    const tds = tr.querySelectorAll('td');
    const name = tds[1]?.textContent?.trim();
    const count = parseInt(tds[3]?.textContent?.trim() || '0', 10) || 0;
    if(name) counts[name] = count;
  });
  saveCounts(counts);
  return counts;
}
function applyCounts(counts){
  document.querySelectorAll('#activities tbody tr').forEach(tr=>{
    const tds = tr.querySelectorAll('td');
    const name = tds[1]?.textContent?.trim();
    if(name && counts[name] != null){
      tds[3].textContent = counts[name];
    }
  });
}

let counts = bootstrapCounts();
applyCounts(counts);


const form = document.getElementById('form-inscription');
const errorsBox = document.getElementById('form-errors');

form?.addEventListener('submit', (ev)=>{
  errorsBox.textContent = '';
  const d = new FormData(form);
  const errs = [];
  if(!d.get('nom')?.trim()) errs.push('• Le nom est obligatoire.');
  if(!d.get('prenom')?.trim()) errs.push('• Le prénom est obligatoire.');
  if(!d.get('naissance')) errs.push('• La date de naissance est obligatoire.');
  if(!d.get('sexe')) errs.push('• Le sexe est obligatoire.');
  if(!d.get('activite')) errs.push('• Choisissez une activité.');

  if(errs.length){
    ev.preventDefault();
    errorsBox.textContent = errs.join('\n');
    return;
  }

  ev.preventDefault();
  const chosen = d.get('activite');
  counts[chosen] = (counts[chosen] || 0) + 1;
  saveCounts(counts);
  applyCounts(counts);
  alert("Inscription enregistrée ! Le nombre d’inscrits a été mis à jour.");
  form.reset();
  showSection('accueil');
});

form?.addEventListener('reset', ()=> errorsBox.textContent = '');
