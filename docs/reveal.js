(function () {
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s || "").replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function track(name, params) { try { if (window.gtag) gtag("event", name, params || {}); } catch (e) {} }

  var data = SantaCodec.decode(location.hash.slice(1));
  if (!data || !data.g || !data.r) {
    $("#bad").classList.remove("hidden");
    $("#good").classList.add("hidden");
    return;
  }

  $("#hello").textContent = "Hi " + data.g + "!";
  if (data.e) $("#evLine").textContent = "Your Secret Santa for " + data.e;

  var facts = [];
  if (data.b) facts.push("Budget: " + (data.c || "$") + data.b);
  if (data.d) {
    var d = new Date(data.d + "T12:00:00");
    if (!isNaN(d)) facts.push("Exchange: " + d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }));
  }
  $("#facts").innerHTML = facts.map(function (f) { return '<span class="fact">' + esc(f) + "</span>"; }).join("");
  if (data.n) { $("#note").textContent = "📝 " + data.n; $("#note").classList.remove("hidden"); }

  function tierFor(b) {
    b = parseFloat(b);
    if (!b || b <= 12) return "10";
    if (b <= 22) return "20";
    if (b <= 35) return "25";
    return "50";
  }

  function renderIdeas() {
    var tier = tierFor(data.b), list = (window.GIFTS[tier] || []).slice();
    // Put ideas that match the wishlist first
    var wish = (data.w || "").toLowerCase();
    if (wish) list.sort(function (a, b) {
      var sa = a.tags.some(function (t) { return wish.indexOf(t) >= 0; }) ? 0 : 1;
      var sb = b.tags.some(function (t) { return wish.indexOf(t) >= 0; }) ? 0 : 1;
      return sa - sb;
    });
    var cards = list.slice(0, 9).map(function (g) {
      return '<div class="idea"><b>' + esc(g.name) + "</b><p>" + esc(g.why) + '</p><a rel="sponsored noopener" target="_blank" data-gift="' + esc(g.name) + '" href="' + DS.amz(g.q) + '">See options on Amazon &rarr;</a></div>';
    });
    if (data.w) {
      cards.unshift('<div class="idea" style="border-color:var(--gold)"><b>From their wishlist</b><p>' + esc(data.w) + '</p><a rel="sponsored noopener" target="_blank" data-gift="wishlist" href="' + DS.amz(data.w.slice(0, 80)) + '">Search their wishlist &rarr;</a></div>');
    }
    $("#ideas").innerHTML = cards.join("");
    $("#ideasTitle").textContent = "Gift ideas for " + data.r + (data.b ? " under " + (data.c || "$") + data.b : "");
    Array.prototype.forEach.call(document.querySelectorAll("#ideas a"), function (a) {
      a.addEventListener("click", function () { track("gift_click", { gift: a.dataset.gift, tier: tier }); });
    });
  }

  function confetti() {
    var colors = ["#c8102e", "#14532d", "#d4a017", "#ffffff", "#2f855a"];
    for (var i = 0; i < 90; i++) {
      var c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 1.8 + Math.random() * 2 + "s";
      c.style.animationDelay = Math.random() * 0.4 + "s";
      document.body.appendChild(c);
      setTimeout(function (el) { el.remove(); }.bind(null, c), 4600);
    }
  }

  var opened = false;
  function open() {
    if (opened) return; opened = true;
    $("#gift").classList.add("open");
    setTimeout(function () {
      $("#gift").classList.add("hidden");
      $("#tap").classList.add("hidden");
      $("#result").classList.remove("hidden");
      $("#rName").textContent = data.r;
      if (data.w) { $("#rWish").textContent = data.w; $("#wishBox").classList.remove("hidden"); }
      renderIdeas();
      $("#after").classList.remove("hidden");
      confetti();
      track("reveal_open");
    }, 650);
  }
  $("#gift").addEventListener("click", open);
  $("#gift").addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
})();
