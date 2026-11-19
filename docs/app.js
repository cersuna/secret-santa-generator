(function () {
  var $ = function (s) { return document.querySelector(s); };
  var STORE = "drawsanta:v1";
  var state = { people: [], exclusions: [] };

  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function track(name, params) { try { if (window.gtag) gtag("event", name, params || {}); } catch (e) {} }

  // ---------- participants ----------
  function addRow(name, wish) {
    var row = document.createElement("div");
    row.className = "row";
    row.innerHTML = '<input class="name" placeholder="Name" maxlength="40" aria-label="Participant name">' +
      '<input class="wish" placeholder="Wishlist / hints (optional)" maxlength="200" aria-label="Wishlist">' +
      '<button type="button" class="icon-btn" aria-label="Remove participant" title="Remove">&times;</button>';
    row.querySelector(".name").value = name || "";
    row.querySelector(".wish").value = wish || "";
    row.querySelector("button").onclick = function () { row.remove(); syncPeople(); };
    row.querySelector(".name").addEventListener("input", syncPeople);
    row.querySelector(".name").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); var r = addRow(); r.querySelector(".name").focus(); }
    });
    $("#people").appendChild(row);
    return row;
  }
  function readPeople() {
    return Array.prototype.map.call(document.querySelectorAll("#people .row"), function (r) {
      return { name: r.querySelector(".name").value.trim(), wish: r.querySelector(".wish").value.trim() };
    }).filter(function (p) { return p.name; });
  }
  function syncPeople() {
    var names = readPeople().map(function (p) { return p.name; });
    ["#exA", "#exB"].forEach(function (sel) {
      var el = $(sel), cur = el.value;
      el.innerHTML = names.map(function (n) { return "<option>" + esc(n) + "</option>"; }).join("");
      if (names.indexOf(cur) >= 0) el.value = cur;
    });
    $("#count").textContent = names.length + (names.length === 1 ? " person" : " people");
  }

  // ---------- exclusions ----------
  function renderEx() {
    $("#exList").innerHTML = state.exclusions.map(function (e, i) {
      return '<span class="chip">' + esc(e[0]) + (e[2] ? " &harr; " : " &rarr; ") + esc(e[1]) +
        ' <button type="button" data-i="' + i + '" aria-label="Remove rule">&times;</button></span>';
    }).join("");
    Array.prototype.forEach.call(document.querySelectorAll("#exList button"), function (b) {
      b.onclick = function () { state.exclusions.splice(+b.dataset.i, 1); renderEx(); save(); };
    });
  }
  $("#exAdd").onclick = function () {
    var a = $("#exA").value, b = $("#exB").value;
    if (!a || !b || a === b) return toast("Pick two different people");
    state.exclusions.push([a, b, $("#exBoth").checked]); renderEx(); save();
  };

  // ---------- draw ----------
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function rand() { var u = new Uint32Array(1); crypto.getRandomValues(u); return u[0] / 4294967296; }

  function draw(names, exclusions, noPairs) {
    var n = names.length, banned = names.map(function () { return {}; });
    var idx = {}; names.forEach(function (nm, i) { idx[nm.toLowerCase()] = i; });
    exclusions.forEach(function (e) {
      var a = idx[e[0].toLowerCase()], b = idx[e[1].toLowerCase()];
      if (a == null || b == null) return;
      banned[a][b] = 1; if (e[2]) banned[b][a] = 1;
    });
    for (var attempt = 0; attempt < 400; attempt++) {
      var order = shuffle(names.map(function (_, i) { return i; }));
      var target = new Array(n), used = {}, steps = 0;
      var ok = (function solve(k) {
        if (++steps > 20000) return false;
        if (k === n) return true;
        var g = order[k];
        var cands = shuffle(names.map(function (_, i) { return i; }));
        for (var c = 0; c < n; c++) {
          var r = cands[c];
          if (r === g || used[r] || banned[g][r]) continue;
          if (noPairs && n > 2 && target[r] === g) continue;
          target[g] = r; used[r] = 1;
          if (solve(k + 1)) return true;
          used[r] = 0; target[g] = undefined;
        }
        return false;
      })(0);
      if (ok) return target;
    }
    return null;
  }

  function linkFor(payload) {
    return location.origin + DS.base + "/reveal/#" + SantaCodec.encode(payload);
  }

  function showErr(msg) { var e = $("#err"); e.textContent = msg; e.style.display = msg ? "block" : "none"; }

  $("#drawBtn").onclick = function () {
    showErr("");
    var people = readPeople();
    var names = people.map(function (p) { return p.name; });
    var lower = names.map(function (n) { return n.toLowerCase(); });
    if (names.length < 3) return showErr("Add at least 3 people to draw names.");
    var dup = lower.filter(function (n, i) { return lower.indexOf(n) !== i; });
    if (dup.length) return showErr('Two people are both called "' + dup[0] + '". Add a last initial so links don\'t get mixed up.');
    var target = draw(names, state.exclusions, $("#noPairs").checked);
    if (!target) return showErr("Those rules make a valid draw impossible. Try removing an exclusion or turning off \"no drawing each other\".");

    var ev = {
      e: $("#evName").value.trim(), b: $("#budget").value.trim(), c: $("#currency").value,
      d: $("#evDate").value, n: $("#note").value.trim()
    };
    var links = people.map(function (p, i) {
      var r = people[target[i]];
      return { name: p.name, url: linkFor({ v: 1, g: p.name, r: r.name, w: r.wish, e: ev.e, b: ev.b, c: ev.c, d: ev.d, n: ev.n }) };
    });
    renderResults(links, ev);
    save(links);
    track("draw_complete", { participants: names.length, exclusions: state.exclusions.length });
  };

  function shareText(l, ev) {
    return "Hi " + l.name + "! 🎅 Your Secret Santa" + (ev.e ? " for " + ev.e : "") +
      " is ready. Open your private link (only open your own!): " + l.url;
  }

  function renderResults(links, ev) {
    var box = $("#results");
    box.classList.remove("hidden");
    var ul = $("#resList");
    ul.innerHTML = links.map(function (l, i) {
      var txt = encodeURIComponent(shareText(l, ev));
      return "<li><b>" + esc(l.name) + "</b><span class=\"acts\">" +
        '<button class="btn small" data-copy="' + i + '">Copy link</button>' +
        '<a class="btn small ghost" target="_blank" rel="noopener" href="https://wa.me/?text=' + txt + '">WhatsApp</a>' +
        '<a class="btn small ghost" href="sms:?&body=' + txt + '">Text</a>' +
        '<a class="btn small ghost" href="mailto:?subject=' + encodeURIComponent("Your Secret Santa 🎁") + "&body=" + txt + '">Email</a>' +
        "</span></li>";
    }).join("");
    Array.prototype.forEach.call(ul.querySelectorAll("[data-copy]"), function (b) {
      b.onclick = function () { copy(shareText(links[+b.dataset.copy], ev)); b.textContent = "Copied ✓"; track("link_copied"); };
    });
    $("#copyAll").onclick = function () {
      copy(links.map(function (l) { return l.name + ": " + l.url; }).join("\n"));
      track("links_copy_all");
    };
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function copy(text) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
      function () { toast("Copied to clipboard"); },
      function () { window.prompt("Copy this:", text); }
    );
  }

  // ---------- persistence ----------
  function save(links) {
    try {
      if (links === undefined) { var prev = load(); links = prev && prev.links; }
      localStorage.setItem(STORE, JSON.stringify({
        people: readPeople(), exclusions: state.exclusions, links: links || null,
        ev: { e: $("#evName").value, b: $("#budget").value, c: $("#currency").value, d: $("#evDate").value, n: $("#note").value }
      }));
    } catch (e) {}
  }
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE) || "null"); } catch (e) { return null; }
  }
  $("#resetBtn").onclick = function () {
    if (!confirm("Clear everything and start a new exchange?")) return;
    try { localStorage.removeItem(STORE); } catch (e) {}
    location.reload();
  };

  // ---------- init ----------
  var saved = load();
  if (saved && saved.people && saved.people.length) {
    saved.people.forEach(function (p) { addRow(p.name, p.wish); });
    state.exclusions = saved.exclusions || [];
    var ev = saved.ev || {};
    $("#evName").value = ev.e || ""; $("#budget").value = ev.b || ""; $("#currency").value = ev.c || "$";
    $("#evDate").value = ev.d || ""; $("#note").value = ev.n || "";
    if (saved.links) renderResults(saved.links, { e: ev.e });
  } else {
    for (var i = 0; i < 4; i++) addRow();
  }
  // budget preset from query (?budget=20) for SEO landing pages
  var qb = new URLSearchParams(location.search).get("budget");
  if (qb && !$("#budget").value) $("#budget").value = qb.replace(/[^\d.]/g, "");

  $("#addPerson").onclick = function () { addRow().querySelector(".name").focus(); };
  $("#bulkBtn").onclick = function () {
    var txt = prompt("Paste names, one per line or separated by commas:");
    if (!txt) return;
    Array.prototype.forEach.call(document.querySelectorAll("#people .row"), function (r) {
      if (!r.querySelector(".name").value.trim()) r.remove();
    });
    txt.split(/[\n,;]+/).map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (n) { addRow(n); });
    syncPeople();
  };
  document.addEventListener("input", function () { syncPeople(); save(); });
  renderEx(); syncPeople();
})();
