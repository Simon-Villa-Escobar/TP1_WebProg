const TABLE_ID = 'activities';
const SELECT_ID = 'select-activite';
const FORM_ID = 'form-inscription';

function showSection(id) {
  var sections = document.querySelectorAll('.content-box');
  for (var i = 0; i < sections.length; i++) {
    var s = sections[i];
    if (s.id === id) s.classList.add('active');
    else s.classList.remove('active');
  }
}

function setupMenuClicks() {
  var items = document.querySelectorAll('.menu .item');
  for (var i = 0; i < items.length; i++) {
    (function (tr) {
      tr.addEventListener('click', function (e) {
        var target = tr.getAttribute('data-target');
        if (target) {
          e.preventDefault();
          showSection(target);
        }
      });
    })(items[i]);
  }

  var anchors = document.querySelectorAll('.menu .item > td > a');
  for (i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener('click', function (ev) {
      ev.preventDefault();
      var tr = this.closest('.item');
      if (tr) {
        var t = tr.getAttribute('data-target');
        if (t) showSection(t);
      }
    });
  }
}

function readTableRows() {
  var out = [];
  var tbody = document.querySelector('#' + TABLE_ID + ' tbody');
  if (!tbody) return out;
  var rows = tbody.querySelectorAll('tr');
  for (var i = 0; i < rows.length; i++) {
    var tds = rows[i].querySelectorAll('td');
    var name = tds[1].textContent.trim();
    var count = parseInt(tds[3].textContent.trim());
    out.push({ name: name, tr: rows[i], count: count });
  }
  return out;
}

function applyCountsToTable(counts) {
  var rows = readTableRows();
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (counts[r.name] !== undefined) {
      var tds = r.tr.querySelectorAll('td');
      tds[3].textContent = counts[r.name];
    }
  }
}

function fillActivitiesSelectFromTable() {
  var select = document.getElementById(SELECT_ID);
  if (!select) return;
  var opts = select.querySelectorAll('option');
  for (var i = opts.length - 1; i >= 0; i--) {
    if (opts[i].value !== '') opts[i].remove();
  }
  var rows = readTableRows();
  for (i = 0; i < rows.length; i++) {
    var option = document.createElement('option');
    option.value = rows[i].name;
    option.textContent = rows[i].name;
    select.appendChild(option);
  }
}

function setupFormBehavior(counts) {
  var form = document.getElementById(FORM_ID);
  var errorsBox = document.getElementById('form-errors');

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();

    var fd = new FormData(form);
    var nom = fd.get('nom').trim();
    var prenom = fd.get('prenom').trim();
    var naissance = fd.get('naissance');
    var sexe = fd.get('sexe');
    var activite = fd.get('activite');

    var errors = [];
    if (!nom) errors.push('• Le nom est obligatoire.');
    if (!prenom) errors.push('• Le prénom est obligatoire.');
    if (!naissance) errors.push('• La date de naissance est obligatoire.');
    if (!sexe) errors.push('• Le sexe est obligatoire.');
    if (!activite) errors.push('• Choisissez une activité.');

    if (errors.length > 0) {
      errorsBox.textContent = errors.join('\n');
      return;
    }

    counts[activite] = counts[activite] + 1;
    applyCountsToTable(counts);

    errorsBox.textContent = '';
    alert('Inscription enregistrée — tableau mis à jour.');
    form.reset();
    showSection('accueil');
  });

  form.addEventListener('reset', function () {
    errorsBox.textContent = '';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  setupMenuClicks();
  var counts = {};
  var rows = readTableRows();
  for (var i = 0; i < rows.length; i++) {
    counts[rows[i].name] = rows[i].count;
  }
  fillActivitiesSelectFromTable();
  setupFormBehavior(counts);
  showSection('accueil');
});
